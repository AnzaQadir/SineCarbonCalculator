/**
 * Enhanced engagement service with personality-based scoring
 * Integrates with existing Card-based catalog system
 */

import { User, UserPersonality, UserPersonalityExtended, UserActionEvent, RecommendationCatalog } from '../../models';
import { queryCatalog } from '../recommendationCatalogService';
import { Card } from '../../types/recommendationCatalog';
import { NextAction, NextActionsResponse, RecommendationDetails } from '../../types/engagement';
import { Op } from 'sequelize';
import { archetypesToPersona, type PersonaVec } from './persona';
import { weightsFromPersona } from './weights';
import { scoreAction, rankMMR, type CatalogItem, type ScoredItem } from './ranker';
import { startOfTodayInKarachi, isSprintWeek, isMonthEnd } from '../../utils/timezone';
import { EngagementRuleOverlayService } from '../engagementRuleOverlayService';

const ESTIMATE_RUPEES_PER_CO2_KG = 75;

type RecommendationRecord = InstanceType<typeof RecommendationCatalog>;

/**
 * Convert Card + RecommendationCatalog record to CatalogItem for scoring
 */
function cardToCatalogItem(card: Card, record?: RecommendationRecord): CatalogItem {
  const weeklyCo2 = card.estImpactKgPerYear / 52;
  const estimatedRupees = Math.round(weeklyCo2 * ESTIMATE_RUPEES_PER_CO2_KG);

  if (record) {
    const recordMetrics = (record.metrics as Record<string, number>) || {};
    const recordEffort = (record.effort as Record<string, number | boolean>) || {};
    const metadata = (record as any).metadata || {};

    const fallbackSteps =
      card.behaviorDistance === 'small' ? 2 : card.behaviorDistance === 'medium' ? 4 : 6;
    const fallbackMinutes =
      card.behaviorDistance === 'small' ? 3 : card.behaviorDistance === 'medium' ? 10 : 30;

    return {
      id: record.id,
      category: record.category || card.domain,
      title: record.title || card.action,
      subtitle:
        record.subtitle ||
        metadata?.messages?.web_subtitle ||
        card.levels?.start ||
        card.action,
      metrics: {
        pkrMonth:
          typeof recordMetrics.pkrMonth === 'number'
            ? recordMetrics.pkrMonth
            : estimatedRupees,
        minutes:
          typeof recordMetrics.minutes === 'number'
            ? recordMetrics.minutes
            : fallbackMinutes,
        kgco2eMonth:
          typeof recordMetrics.kgco2eMonth === 'number'
            ? recordMetrics.kgco2eMonth
            : weeklyCo2 * 4.33,
      },
      effort: {
        steps:
          typeof recordEffort.steps === 'number' ? recordEffort.steps : fallbackSteps,
        requiresPurchase:
          typeof recordEffort.requiresPurchase === 'boolean'
            ? recordEffort.requiresPurchase
            : card.prerequisites.some((p) =>
                p.toLowerCase().includes('buy') || p.toLowerCase().includes('purchase')
              ),
        avgMinutesToDo:
          typeof recordEffort.avgMinutesToDo === 'number'
            ? recordEffort.avgMinutesToDo
            : fallbackMinutes,
      },
      tags:
        Array.isArray(record.tags) && record.tags.length > 0
          ? record.tags
          : [...card.chips, ...card.accessTags],
      regions: Array.isArray(record.regions) ? record.regions : [],
    };
  }

  return {
    id: card.id,
    category: card.domain,
    title: card.action,
    subtitle: card.levels.start,
    metrics: {
      pkrMonth: estimatedRupees,
      minutes: 10, // Default estimate - could be enhanced
      kgco2eMonth: weeklyCo2 * 4.33, // Convert weekly to monthly
    },
    effort: {
      steps: card.behaviorDistance === 'small' ? 2 : card.behaviorDistance === 'medium' ? 4 : 6,
      requiresPurchase: card.prerequisites.some((p) => p.toLowerCase().includes('buy') || p.toLowerCase().includes('purchase')),
      avgMinutesToDo: card.behaviorDistance === 'small' ? 3 : card.behaviorDistance === 'medium' ? 10 : 30,
    },
    tags: [...card.chips, ...card.accessTags],
    regions: [], // Could be enhanced with region data
  };
}

/**
 * Generate fallback steps based on category and context
 */
function generateFallbackSteps(
  category: string,
  title: string,
  subtitle: string | null | undefined,
  why: string | null | undefined,
  requiresPurchase: boolean
): string[] {
  const categoryLower = category.toLowerCase();
  const actionContext = subtitle || why || title;

  switch (categoryLower) {
    case 'transport':
      return [
        `Pick the trip you will shift: ${actionContext}`,
        requiresPurchase
          ? 'Book the ticket or reserve the seat and note departure details.'
          : 'Plan the route and timings so the swap feels easy.',
        'Take the trip and reflect on how the change felt.',
      ];
    case 'food':
      return [
        `Choose the meal or moment to try: ${actionContext}`,
        requiresPurchase
          ? 'Shop or prep the ingredients and set them where you will see them.'
          : 'Prep what you already have so the swap is ready to go.',
        'Cook or assemble it and note how it went for next time.',
      ];
    case 'home':
      return [
        `Decide which spot or habit to tackle first: ${actionContext}`,
        requiresPurchase
          ? 'Pick up any supplies or tools you need before you start.'
          : 'Gather the tools you already own and set a start time.',
        'Make the change and do a quick reset afterward.',
      ];
    case 'waste':
      return [
        `Identify where the waste shows up: ${actionContext}`,
        requiresPurchase
          ? 'Collect any containers or gear you need to support the new habit.'
          : 'Set up bins or reminders with what you already have.',
        'Put the new routine into practice and review at week end.',
      ];
    case 'clothing':
    case 'clothes':
      return [
        `Choose the item or purchase you will shift: ${actionContext}`,
        requiresPurchase
          ? 'Line up the resale/borrow options and set alerts or bookmarks.'
          : 'Open your preferred resale or swap source and save a search.',
        'Follow through on your next purchase moment and log the win.',
      ];
    default:
      // Generic fallback steps
      return [
        `Plan when you'll do this: ${actionContext}`,
        requiresPurchase
          ? 'Gather any supplies or tools you need.'
          : 'Use what you already have to get started.',
        'Take action and track your progress.',
      ];
  }
}

function buildRecommendationDetails(
  scored: ScoredItem,
  record: RecommendationRecord | undefined,
  card: Card | undefined
): RecommendationDetails {
  const metadata = (record as any)?.metadata || {};
  const metrics = (record?.metrics as Record<string, number>) || scored.item.metrics || {};
  const effort = (record?.effort as Record<string, number | boolean>) || scored.item.effort || {};
  const tags =
    Array.isArray(record?.tags) && record.tags.length > 0
      ? record.tags
      : card
      ? [...(card.chips || []), ...(card.accessTags || [])]
      : [];
  const regions = Array.isArray(record?.regions) ? record.regions : [];

  const fallbackUtility: Record<string, number | undefined> = {};
  if (typeof metrics.pkrMonth === 'number') fallbackUtility.pkr_month = metrics.pkrMonth;
  if (typeof metrics.minutes === 'number') fallbackUtility.minutes = metrics.minutes;
  if (typeof metrics.kgco2eMonth === 'number')
    fallbackUtility.kgco2e_month = metrics.kgco2eMonth;

  // Get existing how steps or generate fallback
  const existingHow = Array.isArray(metadata?.how) ? metadata.how : [];
  const title = record?.title || card?.action || scored.item.title || scored.item.id;
  const subtitle = record?.subtitle || scored.item.subtitle || (card?.levels?.start ? card.levels.start : card?.why) || null;
  const why = metadata?.why ?? card?.why ?? null;
  const requiresPurchase = typeof effort.requiresPurchase === 'boolean' ? effort.requiresPurchase : false;
  const category = record?.category || scored.item.category;
  
  // Use existing steps if available, otherwise generate fallback
  const howSteps = existingHow.length > 0 
    ? existingHow 
    : generateFallbackSteps(category, title, subtitle, why, requiresPurchase);

  return {
    id: record?.id || scored.item.id,
    category: record?.category || scored.item.category,
    title: record?.title || card?.action || scored.item.title || scored.item.id,
    subtitle:
      record?.subtitle ||
      scored.item.subtitle ||
      (card?.levels?.start ? card.levels.start : card?.why) ||
      null,
    metrics: metrics,
    effort: effort,
    tags,
    regions,
    why: metadata?.why ?? card?.why ?? null,
    how: howSteps,
    context_requirements: Array.isArray(metadata?.contextRequirements)
      ? metadata.contextRequirements
      : [],
    triggers: Array.isArray(metadata?.triggers) ? metadata.triggers : [],
    utility_model:
      metadata?.utilityModel && Object.keys(metadata.utilityModel).length > 0
        ? metadata.utilityModel
        : Object.keys(fallbackUtility).length > 0
        ? fallbackUtility
        : undefined,
    fit_rules: Array.isArray(metadata?.fitRules) ? metadata.fitRules : [],
    verify: Array.isArray(metadata?.verify) ? metadata.verify : [],
    rewards: metadata?.rewards || {},
    messages: metadata?.messages || {},
    empathy_note:
      typeof metadata?.empathyNote === 'string' ? metadata.empathyNote : metadata?.empathyNote ?? null,
    cta: metadata?.cta ?? null,
    story_snippet:
      typeof metadata?.storySnippet === 'string'
        ? metadata.storySnippet
        : metadata?.storySnippet ?? null,
    metadata: metadata || null,
  };
}

/**
 * Get recent action events for a user
 */
async function getRecentEvents(
  userId: string,
  eventType: 'SHOWN' | 'DONE' | 'DISMISS' | 'SNOOZE',
  limit = 60
): Promise<{ actionId: string; ts: number }[]> {
  const events = await UserActionEvent.findAll({
    where: {
      userId,
      eventType,
    },
    order: [['occurredAt', 'DESC']],
    limit,
    attributes: ['recommendationId', 'occurredAt'],
  });

  return events.map((e) => ({
    actionId: e.recommendationId,
    ts: e.occurredAt.getTime(),
  }));
}

/**
 * Get actions done today
 */
async function getDoneTodayIds(userId: string, today: Date): Promise<Set<string>> {
  const todayStart = startOfTodayInKarachi();
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  const { UserAction } = await import('../../models');
  const doneToday = await UserAction.findAll({
    where: {
      userId,
      occurredAt: {
        [Op.gte]: todayStart,
        [Op.lt]: todayEnd,
      },
    },
    attributes: ['recommendationId'],
  });

  return new Set(doneToday.map((a) => a.recommendationId));
}

/**
 * Explain why an action was shown (human-friendly rationale)
 */
function explainWhy(
  comps: { U: number; E: number; F: number; N: number; RC: number; D: number },
  persona: PersonaVec
): string {
  const top = Object.entries({ U: 'impact', F: 'fit', N: 'freshness' })
    .sort((a, b) => (comps as any)[b[0]] - (comps as any)[a[0]])[0][1];

  // Find top persona dimension
  const personaTilt = Object.entries(persona)
    .sort((a, b) => b[1] - a[1])[0][0]
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

  return `Personality: ${personaTilt} • Picked for ${top}`;
}

/**
 * Map scored item to NextAction format
 */
function scoredItemToNextAction(
  scored: ScoredItem,
  type: 'best' | 'quick_win' | 'level_up',
  rules: any,
  persona: PersonaVec,
  personality?: string,
  context?: {
    catalogRecordMap?: Map<string, RecommendationRecord>;
    cardMap?: Map<string, Card>;
  }
): NextAction {
  const record = context?.catalogRecordMap?.get(scored.item.id);
  const card =
    context?.cardMap?.get(scored.item.id) || queryCatalog({}).find((c) => c.id === scored.item.id);
  const weeklyCo2 = (scored.item.metrics.kgco2eMonth || 0) / 4.33;
  const estimatedRupees = Math.round(scored.item.metrics.pkrMonth || 0);

  // Get persona overlay for better messaging
  const overlay = personality && card?.personaOverlays[personality];
  const recordMetadata = (record as any)?.metadata || {};
  const overlaySubtitle = overlay && 'nudge' in overlay ? overlay.nudge : undefined;
  const subtitle =
    record?.subtitle ||
    recordMetadata?.messages?.web_subtitle ||
    overlaySubtitle ||
    scored.item.subtitle ||
    card?.levels?.start;

  const utilitySource =
    recordMetadata?.utilityModel?.source || 'ZERRAH Catalog v1.0';
  const lastUpdated = record?.updatedAt
    ? new Date(record.updatedAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
  const sourceText = `Source: ${utilitySource} • Last updated: ${lastUpdated}`;

  const recommendation = buildRecommendationDetails(scored, record, card);

  const learnSummary =
    recommendation.why ||
    recordMetadata?.why ||
    card?.why ||
    'Learn more about this action';

  return {
    id: scored.item.id,
    title: record?.title || scored.item.title,
    subtitle,
    type,
    category: record?.category || scored.item.category,
    previewImpact: {
      rupees: estimatedRupees,
      co2_kg: Number(weeklyCo2.toFixed(3)),
      label: type === 'best' ? rules.labels.next_rupee_win || 'Next ₹ win' : undefined,
    },
    whyShown: explainWhy(scored.comps, persona),
    source: sourceText,
    learn: {
      summary: learnSummary,
    },
    recommendation,
  };
}

/**
 * Enhanced getNextActions with personality-based scoring
 */
export async function getNextActionsEnhanced(userId: string): Promise<NextActionsResponse> {
  // 1) Load user, personality, recent history
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const userPersonality = await UserPersonality.findOne({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });

  const personality = userPersonality?.newPersonality || userPersonality?.personalityType;

  // Get extended personality data
  const persExtended = await UserPersonalityExtended.findByPk(userId);

  // Get archetype scores (from existing personality or defaults)
  const archetypeScores: Record<string, number> = persExtended?.archetypeScores || {};
  if (Object.keys(archetypeScores).length === 0 && personality) {
    // Initialize with default based on personality
    archetypeScores[personality] = 1.0;
  }

  // 2) Persona vector
  const persona = persExtended?.personaVector || archetypesToPersona(archetypeScores);

  // 3) Context knobs
  const ctx = {
    sprintWeek: isSprintWeek(userId),
    monthEnd: isMonthEnd(),
  };
  const W = persExtended?.weightPrefs
    ? (persExtended.weightPrefs as any)
    : weightsFromPersona(persona, ctx);

  // 4) Load rules
  const rules = await EngagementRuleOverlayService.loadRules();

  // 5) Get recent history (all event types tracked separately)
  const shown = await getRecentEvents(userId, 'SHOWN', 60);
  const done = await getRecentEvents(userId, 'DONE', 60);
  const dismissed = await getRecentEvents(userId, 'DISMISS', 60);
  const snoozed = await getRecentEvents(userId, 'SNOOZE', 60);

  // 6) Candidate catalog (filter out already-done-today)
  const today = startOfTodayInKarachi();
  const suppressed = await getDoneTodayIds(userId, today);

  let candidates = queryCatalog({
    persona: personality,
    maxItems: 50,
  });

  console.log(`[Enhanced Engagement] Initial candidates from catalog: ${candidates.length}`);
  console.log(`[Enhanced Engagement] User personality: ${personality || 'none'}`);

  // Filter by personality fit if available (but don't be too strict)
  if (personality) {
    const personalityFiltered = candidates.filter((card) => {
      const fitWeight = card.fitWeights[personality] ?? 0;
      return fitWeight > 0;
    });
    console.log(`[Enhanced Engagement] After personality filter: ${personalityFiltered.length}`);
    // Only use personality filter if we have results, otherwise use all
    if (personalityFiltered.length > 0) {
      candidates = personalityFiltered;
    } else {
      console.warn(`[Enhanced Engagement] Personality filter removed all candidates, using all candidates`);
    }
  }

  // Filter out done today
  const beforeDoneTodayFilter = candidates.length;
  if (rules.filters.excludeIfDoneToday) {
    candidates = candidates.filter((c) => !suppressed.has(c.id));
    console.log(`[Enhanced Engagement] After done-today filter: ${candidates.length} (removed ${beforeDoneTodayFilter - candidates.length})`);
  }

  // Filter out recently dismissed items (strong cooldown - 30 days)
  const recentlyDismissed = new Set(
    dismissed
      .filter((e) => Date.now() - e.ts < 30 * 24 * 60 * 60 * 1000) // Last 30 days
      .map((e) => e.actionId)
  );
  
  // Filter out very recently snoozed items (7 days cooldown)
  const recentlySnoozed = new Set(
    snoozed
      .filter((e) => Date.now() - e.ts < 7 * 24 * 60 * 60 * 1000) // Last 7 days
      .map((e) => e.actionId)
  );

  // Apply filters but keep track of original count
  const beforeCooldownFilters = candidates.length;
  candidates = candidates.filter((c) => {
    return !recentlyDismissed.has(c.id) && !recentlySnoozed.has(c.id);
  });
  console.log(`[Enhanced Engagement] After cooldown filters: ${candidates.length} (removed ${beforeCooldownFilters - candidates.length})`);

  // If filtering removed all candidates, relax the filters (allow snoozed items)
  if (candidates.length === 0 && beforeCooldownFilters > 0) {
    console.warn(`[Enhanced Engagement] All candidates filtered out. Relaxing snooze filter.`);
    // Re-query and only filter dismissed
    candidates = queryCatalog({
      persona: personality,
      maxItems: 50,
    }).filter((c) => {
      // Only filter dismissed items, allow snoozed
      return !recentlyDismissed.has(c.id) && !suppressed.has(c.id);
    });
    console.log(`[Enhanced Engagement] After relaxing snooze filter: ${candidates.length}`);
  }

  // If still no candidates, remove all cooldown filters (show everything except done today)
  if (candidates.length === 0) {
    console.warn(`[Enhanced Engagement] Still no candidates. Removing all cooldown filters.`);
    candidates = queryCatalog({
      persona: personality,
      maxItems: 50,
    }).filter((c) => !suppressed.has(c.id));
    console.log(`[Enhanced Engagement] After removing all cooldown filters: ${candidates.length}`);
  }

  // If STILL no candidates (maybe all done today), show everything
  if (candidates.length === 0) {
    console.warn(`[Enhanced Engagement] All items done today. Showing all items regardless.`);
    candidates = queryCatalog({
      persona: personality,
      maxItems: 50,
    });
    console.log(`[Enhanced Engagement] Final candidates: ${candidates.length}`);
  }

  // Prepare lookup maps and hydrate catalog items from RecommendationCatalog when available
  const candidateCardMap = new Map(candidates.map((card) => [card.id, card]));

  let catalogRecordMap = new Map<string, RecommendationRecord>();
  if (candidates.length > 0) {
    const candidateIds = candidates.map((card) => card.id);
    const records = await RecommendationCatalog.findAll({
      where: {
        id: {
          [Op.in]: candidateIds,
        },
        active: true,
      },
    });
    catalogRecordMap = new Map(records.map((record) => [record.id, record]));
  }

  // Convert to CatalogItems with preference for RecommendationCatalog data
  const catalogItems = candidates.map((card) =>
    cardToCatalogItem(card, catalogRecordMap.get(card.id))
  );
  console.log(
    `[Enhanced Engagement] Catalog items after all filtering: ${catalogItems.length}`
  );

  if (catalogItems.length === 0) {
    console.error(`[Enhanced Engagement] No catalog items available after all fallbacks!`);
    console.error(`[Enhanced Engagement] Debug info:`, {
      personality,
      suppressedCount: suppressed.size,
      dismissedCount: dismissed.length,
      snoozedCount: snoozed.length,
      totalCatalogSize: queryCatalog({}).length,
    });
    // Return empty state instead of throwing - let frontend handle it
    return {
      primary: null,
      alternatives: [],
    };
  }

  // 7) Score candidates
  const shownByCategory = shown.map((s) => {
    const card = candidateCardMap.get(s.actionId);
    const record = catalogRecordMap.get(s.actionId);
    return {
      actionId: s.actionId,
      category: record?.category || card?.domain || 'unknown',
    };
  });

  const scored = catalogItems
    .map((item) => {
      const res = scoreAction(
        {
          locale: user.city || 'PK',
          claims: {}, // Could be enhanced with user preferences
          shown,
          done,
          dismissed,
          snoozed,
        },
        item,
        W,
        shownByCategory
      );
      return res;
    })
    .sort((a, b) => b.score - a.score);

  console.log(`[Enhanced Engagement] Scored ${scored.length} items. Top 3 scores:`, 
    scored.slice(0, 3).map(s => ({ id: s.item.id, score: s.score.toFixed(3) })));

  // 8) Pick 1 primary + 2 alternates (MMR for diversity)
  const top3 = rankMMR(scored, 3, 0.75);

  console.log(`[Enhanced Engagement] MMR selected ${top3.length} items`);

  if (top3.length === 0) {
    console.error(`[Enhanced Engagement] MMR returned 0 items! Scored items: ${scored.length}`);
    
    // If we have scored items but MMR returned 0, try to use top scored items directly
    if (scored.length > 0) {
      console.warn(`[Enhanced Engagement] MMR failed, using top scored items directly`);
      const topScored = scored.slice(0, 3);
      const primary = topScored[0]
        ? scoredItemToNextAction(topScored[0], 'best', rules, persona, personality, {
            catalogRecordMap,
            cardMap: candidateCardMap,
          })
        : null;
      const alternatives = topScored.slice(1).map((s, i) =>
        scoredItemToNextAction(s, i === 0 ? 'quick_win' : 'level_up', rules, persona, personality, {
          catalogRecordMap,
          cardMap: candidateCardMap,
        })
      );
      
      // Log SHOWN events
      await Promise.all(
        topScored.map((x) =>
          UserActionEvent.create({
            userId,
            recommendationId: x.item.id,
            eventType: 'SHOWN',
            occurredAt: new Date(),
          })
        )
      );
      
      return {
        primary,
        alternatives: alternatives.slice(0, 2),
      };
    }
    
    // If absolutely no scored items, return empty state
    console.error(`[Enhanced Engagement] No scored items available - returning empty state`);
    return {
      primary: null,
      alternatives: [],
    };
  }

  // 9) Label alternates by quick_win / level_up
  const [primaryScored, a1Scored, a2Scored] = top3;

  const quickWin = a1Scored
    ? rules.thresholds.quickWinMaxCo2 >= (a1Scored.item.metrics.kgco2eMonth || 0) / 4.33 &&
      rules.thresholds.quickWinMaxRupees >= (a1Scored.item.metrics.pkrMonth || 0)
    : false;

  const levelUp = a2Scored
    ? (a2Scored.item.metrics.kgco2eMonth || 0) / 4.33 >= rules.thresholds.levelUpMinCo2 ||
      (a2Scored.item.metrics.pkrMonth || 0) >= rules.thresholds.levelUpMinRupees
    : false;

  const alt1 = a1Scored
    ? {
        ...a1Scored,
        type: quickWin ? 'quick_win' : levelUp ? 'level_up' : 'quick_win',
      }
    : null;

  const alt2 = a2Scored
    ? {
        ...a2Scored,
        type: levelUp ? 'level_up' : 'quick_win',
      }
    : null;

  // 10) Log SHOWN events
  await Promise.all(
    top3.map((x) =>
      UserActionEvent.create({
        userId,
        recommendationId: x.item.id,
        eventType: 'SHOWN',
        occurredAt: new Date(),
      })
    )
  );

  // 11) Build API response
  if (!primaryScored) {
    // If no primary, try to use first alternative as primary
    if (a1Scored) {
      const primary = scoredItemToNextAction(
        a1Scored,
        'best',
        rules,
        persona,
        personality,
        {
          catalogRecordMap,
          cardMap: candidateCardMap,
        }
      );
      const alternatives: NextAction[] = [];
      if (a2Scored) {
        // Determine type for a2Scored
        const levelUpForA2 = (a2Scored.item.metrics.kgco2eMonth || 0) / 4.33 >= rules.thresholds.levelUpMinCo2 ||
          (a2Scored.item.metrics.pkrMonth || 0) >= rules.thresholds.levelUpMinRupees;
        const type = levelUpForA2 ? 'level_up' : 'quick_win';
        alternatives.push(
          scoredItemToNextAction(a2Scored, type, rules, persona, personality, {
            catalogRecordMap,
            cardMap: candidateCardMap,
          })
        );
      }
      return {
        primary,
        alternatives: alternatives.slice(0, 2),
      };
    }
    // If absolutely no recommendations, return empty state
    console.error(`[Enhanced Engagement] No recommendations available after scoring - returning empty state`);
    return {
      primary: null,
      alternatives: [],
    };
  }

  const primary = scoredItemToNextAction(
    primaryScored,
    'best',
    rules,
    persona,
    personality,
    {
      catalogRecordMap,
      cardMap: candidateCardMap,
    }
  );
  const alternatives: NextAction[] = [];

  if (alt1) {
    alternatives.push(
      scoredItemToNextAction(alt1, alt1.type as any, rules, persona, personality, {
        catalogRecordMap,
        cardMap: candidateCardMap,
      })
    );
  }
  if (alt2) {
    alternatives.push(
      scoredItemToNextAction(alt2, alt2.type as any, rules, persona, personality, {
        catalogRecordMap,
        cardMap: candidateCardMap,
      })
    );
  }

  return {
    primary,
    alternatives: alternatives.slice(0, 2),
  };
}

