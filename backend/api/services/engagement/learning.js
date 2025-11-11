"use strict";
/**
 * Learning and evolution logic from user actions
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWeights = getUserWeights;
exports.saveUserWeights = saveUserWeights;
exports.markDoneAndLearn = markDoneAndLearn;
const models_1 = require("../../models");
const sequelize_1 = require("sequelize");
const timezone_1 = require("../../utils/timezone");
/**
 * Infer the top utility dimension from a recommendation
 */
async function inferTopUtilityDimension(recommendationId) {
    // This would ideally query the catalog to get metrics
    // For now, return a default - can be enhanced
    return 'co2';
}
/**
 * Clamp weights to reasonable bounds
 */
function clampWeights(w) {
    const clamp = (x) => Math.max(0.5, Math.min(2.0, x));
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
async function getUserWeights(userId) {
    const pers = await models_1.UserPersonalityExtended.findByPk(userId);
    if (pers && pers.weightPrefs) {
        return pers.weightPrefs;
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
async function saveUserWeights(userId, weights) {
    await models_1.UserPersonalityExtended.upsert({
        userId,
        weightPrefs: weights,
        updatedAt: new Date(),
    });
}
/**
 * Mark action done and learn from outcome
 */
async function markDoneAndLearn(userId, recId, outcome, ctx) {
    // 1) Idempotency check (today) - only for "done" outcomes
    if (outcome === 'done') {
        const todayStart = (0, timezone_1.startOfTodayInKarachi)();
        const todayEnd = new Date(todayStart);
        todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);
        const { UserAction } = await Promise.resolve().then(() => __importStar(require('../../models')));
        const existing = await UserAction.findOne({
            where: {
                userId,
                recommendationId: recId,
                occurredAt: {
                    [sequelize_1.Op.gte]: todayStart,
                    [sequelize_1.Op.lt]: todayEnd,
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
    const { queryCatalog } = await Promise.resolve().then(() => __importStar(require('../recommendationCatalogService')));
    const candidates = queryCatalog({});
    const card = candidates.find((c) => c.id === recId);
    if (!card) {
        throw new Error('Recommendation not found');
    }
    const weeklyCo2 = card.estImpactKgPerYear / 52;
    const estimatedRupees = Math.round(weeklyCo2 * 75); // Rough conversion
    // 3) Persist event with correct type (for learning)
    const { outcomeToEventType } = await Promise.resolve().then(() => __importStar(require('./eventTypes')));
    const eventType = outcomeToEventType(outcome);
    await models_1.UserActionEvent.create({
        userId,
        recommendationId: recId,
        eventType,
        occurredAt: new Date(),
    });
    // 3b) Also persist to UserAction if done (for existing streak/impact tracking)
    if (outcome === 'done') {
        const { UserAction } = await Promise.resolve().then(() => __importStar(require('../../models')));
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
    }
    else if (outcome === 'dismiss') {
        W.fit -= 0.03;
        W.novelty -= 0.02;
        W.recency += 0.05;
    }
    else if (outcome === 'snooze') {
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
        const { updateStreak } = await Promise.resolve().then(() => __importStar(require('../engagementService')));
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
    }
    else {
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
async function getStreak(userId) {
    const { UserStreak } = await Promise.resolve().then(() => __importStar(require('../../models')));
    const streak = await UserStreak.findByPk(userId);
    if (!streak) {
        return { current: 0, longest: 0 };
    }
    return {
        current: streak.currentStreakDays,
        longest: streak.longestStreakDays,
    };
}
