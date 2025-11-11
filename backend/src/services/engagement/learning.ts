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

  const weeklyCo2 = card.estImpactKgPerYear / 52;
  const estimatedRupees = Math.round(weeklyCo2 * 75); // Rough conversion

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
    await UserAction.create({
      userId,
      recommendationId: recId,
      occurredAt: new Date(),
      impactRupees: estimatedRupees,
      impactCo2Kg: weeklyCo2,
      surface: ctx?.surface || 'web',
      metadata: ctx,
      source: 'catalog:v1',
    });
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

