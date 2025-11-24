/**
 * Learning and evolution logic from user actions
 */

import { UserActionEvent, UserPersonalityExtended, UserAction } from '../../models';
import { Op } from 'sequelize';
import { startOfTodayInKarachi } from '../../utils/timezone';
import { archetypesToPersona } from './persona';
import { weightsFromPersona } from './weights';
import type { WeightPrefs } from './scoring';

/**
 * Infer the top utility dimension from a recommendation
 */
async function inferTopUtilityDimension(recommendationId: string): Promise<'pkr' | 'time' | 'co2'> {
  // This would ideally query the catalog to get metrics
  // For now, return a default - can be enhanced
  return 'co2';
}

/**
 * Clamp weights to reasonable bounds
 */
function clampWeights(w: WeightPrefs): WeightPrefs {
  const clamp = (x: number) => Math.max(0.5, Math.min(2.0, x));
  return {
    pkr: clamp(w.pkr),
    time: clamp(w.time),
    co2: clamp(w.co2),
    effort: clamp(w.effort),
    novelty: clamp(w.novelty),
    recency: clamp(w.recency),
    diversity: clamp(w.diversity),
    fit: clamp(w.fit),
  };
}

/**
 * Get user weights from database or create defaults
 */
export async function getUserWeights(userId: string): Promise<WeightPrefs> {
  const pers = await UserPersonalityExtended.findByPk(userId);
  if (pers && pers.weightPrefs) {
    return pers.weightPrefs as WeightPrefs;
  }
  // Default weights
  return {
    pkr: 1.0,
    time: 1.0,
    co2: 1.0,
    effort: 1.0,
    novelty: 0.7,
    recency: 0.8,
    diversity: 0.6,
    fit: 1.0,
  };
}

/**
 * Save user weights to database
 */
export async function saveUserWeights(userId: string, weights: WeightPrefs): Promise<void> {
  await UserPersonalityExtended.upsert({
    userId,
    weightPrefs: weights,
    updatedAt: new Date(),
  } as any);
}

/**
 * Mark action done and learn from outcome
 */
export async function markDoneAndLearn(
  userId: string,
  recId: string,
  outcome: 'done' | 'dismiss' | 'snooze',
  ctx: any
): Promise<{
  verifiedImpact: { rupees: number; co2_kg: number };
  streak: { current: number; longest: number };
  bonus?: { awarded: boolean; xp?: number; label?: string };
}> {
  // 1) Idempotency check (today) - only for "done" outcomes
  if (outcome === 'done') {
    const todayStart = startOfTodayInKarachi();
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

    const { UserAction } = await import('../../models');
    const existing = await UserAction.findOne({
      where: {
        userId,
        recommendationId: recId,
        occurredAt: {
          [Op.gte]: todayStart,
          [Op.lt]: todayEnd,
        },
      },
    });

    if (existing) {
      // Return existing response
      const streak = await getStreak(userId);
      return {
        verifiedImpact: {
          rupees: Number(existing.impactRupees),
          co2_kg: Number(existing.impactCo2Kg),
        },
        streak,
      };
    }
  }

  // 2) Estimate impact (reuse existing logic from engagementService)
  const { queryCatalog } = await import('../recommendationCatalogService');
  const candidates = queryCatalog({});
  const card = candidates.find((c) => c.id === recId);
  
  if (!card) {
    throw new Error('Recommendation not found');
  }

  let weeklyCo2 = card.estImpactKgPerYear / 52;
  let estimatedRupees = Math.round(weeklyCo2 * 75); // Rough conversion

  // 3) Persist event with correct type (for learning)
  const { outcomeToEventType } = await import('./eventTypes');
  const eventType = outcomeToEventType(outcome);
  
  await UserActionEvent.create({
    userId,
    recommendationId: recId,
    eventType,
    occurredAt: new Date(),
  });

  // 3b) Also persist to UserAction if done (for existing streak/impact tracking)
  if (outcome === 'done') {
    const { UserAction } = await import('../../models');
    const todayStart = startOfTodayInKarachi();
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

    try {
      // Try to create the record
      await UserAction.create({
        userId,
        recommendationId: recId,
        occurredAt: new Date(),
        impactRupees: estimatedRupees,
        impactCo2Kg: weeklyCo2,
        surface: ctx?.surface || 'web',
        metadata: ctx || {},
        source: 'catalog:v1',
      });
    } catch (error: any) {
      // Handle unique constraint violation (race condition)
      if (error?.name === 'SequelizeUniqueConstraintError' || error?.code === '23505') {
        // Record already exists, fetch it and use its values
        const existing = await UserAction.findOne({
          where: {
            userId,
            recommendationId: recId,
            occurredAt: {
              [Op.gte]: todayStart,
              [Op.lt]: todayEnd,
            },
          },
        });
        
        if (existing) {
          estimatedRupees = Number(existing.impactRupees);
          weeklyCo2 = Number(existing.impactCo2Kg);
        }
        // If we can't find it, continue with the estimated values
      } else {
        // Re-throw if it's a different error
        throw error;
      }
    }
  }

  // 4) Update weights (tiny nudges)
  const W = await getUserWeights(userId);
  const topDim = await inferTopUtilityDimension(recId);

  if (outcome === 'done') {
    W[topDim] += 0.05;
    W.effort = Math.max(0.8, W.effort - 0.02);
  } else if (outcome === 'dismiss') {
    W.fit -= 0.03;
    W.novelty -= 0.02;
    W.recency += 0.05;
  } else if (outcome === 'snooze') {
    W.recency += 0.08;
  }

  const clamped = clampWeights(W);
  await saveUserWeights(userId, clamped);

  // 5) Optional bonus
  const bonusAwarded = Math.random() < 0.15;
  const bonus = bonusAwarded
    ? {
        awarded: true,
        xp: 10,
        label: 'Bamboo Bonus',
      }
    : undefined;

  // 6) Get/update streak (only for "done" outcomes)
  let streak = await getStreak(userId);
  if (outcome === 'done') {
    const { updateStreak } = await import('../engagementService');
    streak = await updateStreak(userId);
  }

  // For "done" outcomes, return full response with impact and streak
  // For "snooze" and "dismiss", return minimal response (no impact, no streak update)
  if (outcome === 'done') {
    return {
      verifiedImpact: {
        rupees: estimatedRupees,
        co2_kg: Number(weeklyCo2.toFixed(3)),
      },
      streak,
      bonus,
    };
  } else {
    // For snooze/dismiss, return minimal response (no impact tracked)
    return {
      verifiedImpact: {
        rupees: 0,
        co2_kg: 0,
      },
      streak,
    };
  }
}

/**
 * Get user streak (helper)
 */
async function getStreak(userId: string): Promise<{ current: number; longest: number }> {
  const { UserStreak } = await import('../../models');
  const streak = await UserStreak.findByPk(userId);
  if (!streak) {
    return { current: 0, longest: 0 };
  }
  return {
    current: streak.currentStreakDays,
    longest: streak.longestStreakDays,
  };
}

/**
 * Handle "intended" event - user clicked "Do it now" (micro-commitment)
 * Large positive ranking boost: +0.4 relevance, +0.3 contextual match, +0.2 archetype fit
 */
export async function recordIntendedAction(
  userId: string,
  recId: string,
  ctx: { device?: string; time_of_day?: string; archetype?: string; location?: string }
): Promise<void> {
  await UserActionEvent.create({
    userId,
    recommendationId: recId,
    eventType: 'INTENDED',
    occurredAt: new Date(),
    metadata: ctx,
  } as any);

  // Apply large positive ranking boost
  const W = await getUserWeights(userId);
  W.fit += 0.4; // Relevance boost
  W.recency += 0.3; // Contextual match
  W.fit += 0.2; // Archetype fit reinforcement
  const clamped = clampWeights(W);
  await saveUserWeights(userId, clamped);
}

/**
 * Handle "snoozed" event with time context
 * Reduce immediate ranking, increase future resurfacing score
 */
export async function recordSnoozedAction(
  userId: string,
  recId: string,
  timeContext?: 'evening' | 'weekend' | 'no_reminders',
  ctx?: { time_of_day?: string; session_energy?: string }
): Promise<{ cooldown_days: number }> {
  await UserActionEvent.create({
    userId,
    recommendationId: recId,
    eventType: 'SNOOZE',
    occurredAt: new Date(),
    metadata: {
      reason: 'timing',
      time_context: timeContext,
      ...ctx,
    },
  } as any);

  // Reduce immediate ranking, increase future match
  const W = await getUserWeights(userId);
  W.recency -= 0.2; // Reduce immediate ranking
  W.recency += 0.3; // Increase future resurfacing when context matches
  const clamped = clampWeights(W);
  await saveUserWeights(userId, clamped);

  // Adaptive cooldown: 1-3 days
  const cooldownDays = timeContext === 'weekend' ? 3 : timeContext === 'evening' ? 1 : 2;
  return { cooldown_days: cooldownDays };
}

/**
 * Handle "not useful" event with reason
 * Apply reason-specific penalties and cooldowns
 */
export async function recordNotUsefulAction(
  userId: string,
  recId: string,
  reason: 'not_relevant' | 'too_hard' | 'already_doing',
  ctx?: Record<string, any>
): Promise<{ cooldown_days: number; adjustments: Partial<WeightPrefs> }> {
  await UserActionEvent.create({
    userId,
    recommendationId: recId,
    eventType: 'DISMISS',
    occurredAt: new Date(),
    metadata: {
      reason,
      ...ctx,
    },
  } as any);

  const W = await getUserWeights(userId);
  const adjustments: Partial<WeightPrefs> = {};
  let cooldownDays = 30;

  // Reason-specific handling
  if (reason === 'not_relevant') {
    // Category penalty
    W.fit -= 0.4;
    adjustments.fit = -0.4;
    cooldownDays = 60;
  } else if (reason === 'too_hard') {
    // Prefer lower effort actions
    W.effort += 0.3; // Higher effort penalty = prefer lower effort
    adjustments.effort = 0.3;
    cooldownDays = 30;
  } else if (reason === 'already_doing') {
    // Mastery mode - unlock next level
    W.novelty += 0.2; // Prefer new challenges
    W.fit += 0.1; // Still relevant, just level up
    adjustments.novelty = 0.2;
    adjustments.fit = 0.1;
    cooldownDays = 90;
  }

  const clamped = clampWeights(W);
  await saveUserWeights(userId, clamped);

  return { cooldown_days: cooldownDays, adjustments };
}

