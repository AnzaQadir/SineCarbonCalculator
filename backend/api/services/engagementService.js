"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextActions = getNextActions;
exports.markActionDone = markActionDone;
const models_1 = require("../models");
const engagementRuleOverlayService_1 = require("./engagementRuleOverlayService");
const recommendationCatalogService_1 = require("./recommendationCatalogService");
const sequelize_1 = require("sequelize");
// Helper to estimate rupees savings from CO2 (rough conversion: 1 kg CO2 ≈ 50-100 rupees depending on source)
const ESTIMATE_RUPEES_PER_CO2_KG = 75;
/**
 * Convert catalog Card to NextAction format
 */
function cardToNextAction(card, type, rules, personality) {
    // Estimate rupees from CO2 impact (annual divided by 52 weeks for weekly estimate, then scaled)
    const weeklyCo2 = card.estImpactKgPerYear / 52;
    const estimatedRupees = Math.round(weeklyCo2 * ESTIMATE_RUPEES_PER_CO2_KG);
    // Get persona overlay for better messaging
    const overlay = personality && card.personaOverlays[personality];
    const subtitle = (overlay && 'nudge' in overlay ? overlay.nudge : undefined) || card.levels.start;
    // Build source text (simplified - in real app would come from card metadata)
    const sourceText = `Source: ZERRAH Catalog v1.0 • Last updated: ${new Date().toISOString().split('T')[0]}`;
    // Build why shown text
    let whyShown = '';
    if (personality) {
        whyShown = `Personality: ${personality}`;
    }
    if (type === 'quick_win') {
        whyShown += ' • Quick win';
    }
    else if (type === 'level_up') {
        whyShown += ' • Bigger impact';
    }
    return {
        id: card.id,
        title: card.action,
        subtitle,
        type,
        category: card.domain,
        previewImpact: {
            rupees: estimatedRupees,
            co2_kg: Number(weeklyCo2.toFixed(3)),
            label: type === 'best' ? rules.labels.next_rupee_win || 'Next ₹ win' : undefined,
        },
        whyShown,
        source: sourceText,
        learn: {
            summary: card.why,
            // In a real app, this might link to a detailed article
        },
    };
}
/**
 * Get next actions for a user
 */
async function getNextActions(userId) {
    // Get user
    const user = await models_1.User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Get user personality
    const userPersonality = await models_1.UserPersonality.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']],
    });
    const personality = userPersonality?.newPersonality || userPersonality?.personalityType;
    // Load engagement rules
    const rules = await engagementRuleOverlayService_1.EngagementRuleOverlayService.loadRules();
    // Get priority order for this personality
    const priorityOrder = engagementRuleOverlayService_1.EngagementRuleOverlayService.getPriorityOrder(rules, personality);
    // Query catalog (filtered by personality fitWeights)
    let candidates = (0, recommendationCatalogService_1.queryCatalog)({
        persona: personality,
        maxItems: 50, // Get more candidates to filter from
    });
    // Filter by personality fit (if personality exists, prefer cards with fitWeights > 0)
    // But fallback to all cards if filtering removes everything
    if (personality) {
        const personalityFiltered = candidates.filter((card) => {
            const fitWeight = card.fitWeights[personality] ?? 0;
            return fitWeight > 0;
        });
        // Only use personality filter if it returns results, otherwise use all candidates
        if (personalityFiltered.length > 0) {
            candidates = personalityFiltered;
        }
        // If personalityFiltered is empty, keep all candidates (better than showing nothing)
    }
    // Get actions done today (Asia/Karachi timezone)
    const today = new Date();
    // Set to Asia/Karachi timezone (UTC+5)
    const todayStart = new Date(today);
    todayStart.setUTCHours(0, 0, 0, 0);
    todayStart.setUTCHours(todayStart.getUTCHours() - 5); // PKT is UTC+5
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);
    const doneToday = await models_1.UserAction.findAll({
        where: {
            userId,
            occurredAt: {
                [sequelize_1.Op.gte]: todayStart,
                [sequelize_1.Op.lt]: todayEnd,
            },
        },
        attributes: ['recommendationId'],
    });
    const doneTodayIds = new Set(doneToday.map((a) => a.recommendationId));
    // Filter out done today and muted categories (if rules specify)
    if (rules.filters.excludeIfDoneToday) {
        candidates = candidates.filter((c) => !doneTodayIds.has(c.id));
    }
    // TODO: Filter muted categories when user.mutedCategories is available
    // if (rules.filters.excludeIfCategoryMuted && user.mutedCategories) {
    //   candidates = candidates.filter((c) => !user.mutedCategories.includes(c.domain));
    // }
    // Sort by priority order (map domain to priority index)
    candidates.sort((a, b) => {
        const aIndex = priorityOrder.findIndex((p) => a.domain.includes(p) || p.includes(a.domain));
        const bIndex = priorityOrder.findIndex((p) => b.domain.includes(p) || p.includes(b.domain));
        if (aIndex === -1 && bIndex === -1)
            return 0;
        if (aIndex === -1)
            return 1;
        if (bIndex === -1)
            return -1;
        return aIndex - bIndex;
    });
    // Pick primary (first candidate)
    // If still no candidates after all filtering, get defaults without filters
    if (candidates.length === 0) {
        console.warn(`No candidates after filtering for user ${userId}, personality: ${personality}. Using default recommendations.`);
        candidates = (0, recommendationCatalogService_1.queryCatalog)({
            maxItems: 20, // Get default recommendations
        });
        if (candidates.length === 0) {
            throw new Error('No recommendations available in catalog');
        }
    }
    const primaryCard = candidates[0];
    const primary = cardToNextAction(primaryCard, 'best', rules, personality);
    // Find Quick Win (co2 <= threshold, rupees <= threshold)
    const quickWinCard = candidates.find((c) => {
        if (c.id === primaryCard.id)
            return false;
        const weeklyCo2 = c.estImpactKgPerYear / 52;
        const estimatedRupees = Math.round(weeklyCo2 * ESTIMATE_RUPEES_PER_CO2_KG);
        return (weeklyCo2 <= rules.thresholds.quickWinMaxCo2 &&
            estimatedRupees <= rules.thresholds.quickWinMaxRupees);
    });
    // Find Level Up (co2 >= threshold OR rupees >= threshold)
    const levelUpCard = candidates.find((c) => {
        if (c.id === primaryCard.id || c.id === quickWinCard?.id)
            return false;
        const weeklyCo2 = c.estImpactKgPerYear / 52;
        const estimatedRupees = Math.round(weeklyCo2 * ESTIMATE_RUPEES_PER_CO2_KG);
        return (weeklyCo2 >= rules.thresholds.levelUpMinCo2 || estimatedRupees >= rules.thresholds.levelUpMinRupees);
    });
    const alternatives = [];
    if (quickWinCard) {
        alternatives.push(cardToNextAction(quickWinCard, 'quick_win', rules, personality));
    }
    if (levelUpCard) {
        alternatives.push(cardToNextAction(levelUpCard, 'level_up', rules, personality));
    }
    // If no alternatives found, backfill with next best candidates
    while (alternatives.length < 2 && candidates.length > alternatives.length + 1) {
        const nextCard = candidates[alternatives.length + 1];
        if (nextCard && nextCard.id !== primaryCard.id) {
            const type = alternatives.length === 0 ? 'quick_win' : 'level_up';
            alternatives.push(cardToNextAction(nextCard, type, rules, personality));
        }
        else {
            break;
        }
    }
    return {
        primary,
        alternatives: alternatives.slice(0, 2),
    };
}
/**
 * Mark an action as done (idempotent per day)
 */
async function markActionDone(userId, recommendationId, context = {}) {
    // Get the card to get impact values
    const candidates = (0, recommendationCatalogService_1.queryCatalog)({});
    const card = candidates.find((c) => c.id === recommendationId);
    if (!card) {
        throw new Error('Recommendation not found');
    }
    // Calculate impact (weekly estimate)
    const weeklyCo2 = card.estImpactKgPerYear / 52;
    const estimatedRupees = Math.round(weeklyCo2 * ESTIMATE_RUPEES_PER_CO2_KG);
    // Get today's date in Asia/Karachi timezone
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setUTCHours(0, 0, 0, 0);
    todayStart.setUTCHours(todayStart.getUTCHours() - 5);
    // Check if already done today (idempotent)
    const existing = await models_1.UserAction.findOne({
        where: {
            userId,
            recommendationId,
            occurredAt: {
                [sequelize_1.Op.gte]: todayStart,
                [sequelize_1.Op.lt]: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000),
            },
        },
    });
    if (existing) {
        // Return existing impact
        return {
            verifiedImpact: {
                rupees: Number(existing.impactRupees),
                co2_kg: Number(existing.impactCo2Kg),
            },
            streak: await getStreak(userId),
        };
    }
    // Create new action
    await models_1.UserAction.create({
        userId,
        recommendationId,
        occurredAt: new Date(),
        impactRupees: estimatedRupees,
        impactCo2Kg: weeklyCo2,
        surface: context.surface || 'web',
        metadata: context,
        source: 'catalog:v1',
    });
    // Update streak
    const streak = await updateStreak(userId);
    // 15% chance for bamboo bonus
    const bonusAwarded = Math.random() < 0.15;
    const bonus = bonusAwarded
        ? {
            awarded: true,
            xp: 10,
            label: 'Bamboo Bonus',
        }
        : undefined;
    return {
        verifiedImpact: {
            rupees: estimatedRupees,
            co2_kg: Number(weeklyCo2.toFixed(3)),
        },
        streak,
        bonus,
    };
}
/**
 * Get or create user streak
 */
async function getStreak(userId) {
    const streak = await models_1.UserStreak.findByPk(userId);
    if (!streak) {
        return { current: 0, longest: 0 };
    }
    return {
        current: streak.currentStreakDays,
        longest: streak.longestStreakDays,
    };
}
/**
 * Update user streak based on last action date
 */
async function updateStreak(userId) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    today.setUTCHours(today.getUTCHours() - 5); // PKT timezone
    const todayDate = new Date(today.toISOString().split('T')[0]);
    let streak = await models_1.UserStreak.findByPk(userId);
    if (!streak) {
        streak = await models_1.UserStreak.create({
            userId,
            currentStreakDays: 1,
            longestStreakDays: 1,
            lastActionDate: todayDate,
        });
        return {
            current: 1,
            longest: 1,
        };
    }
    const lastDate = streak.lastActionDate ? new Date(streak.lastActionDate).toISOString().split('T')[0] : null;
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];
    const todayDateStr = todayDate.toISOString().split('T')[0];
    if (lastDate === todayDateStr) {
        // Already updated today, no change
        return {
            current: streak.currentStreakDays,
            longest: streak.longestStreakDays,
        };
    }
    else if (lastDate === yesterdayDate) {
        // Continue streak
        const newCurrent = streak.currentStreakDays + 1;
        const newLongest = Math.max(newCurrent, streak.longestStreakDays);
        await streak.update({
            currentStreakDays: newCurrent,
            longestStreakDays: newLongest,
            lastActionDate: todayDate,
        }); // Type assertion needed for DATEONLY
        return {
            current: newCurrent,
            longest: newLongest,
        };
    }
    else {
        // Reset streak
        await streak.update({
            currentStreakDays: 1,
            lastActionDate: todayDate,
        }); // Type assertion needed for DATEONLY
        return {
            current: 1,
            longest: streak.longestStreakDays,
        };
    }
}
