"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngagementService = void 0;
const recommendationCatalogService_1 = require("./recommendationCatalogService");
const UserAction_1 = __importDefault(require("../models/UserAction"));
const UserStreak_1 = __importDefault(require("../models/UserStreak"));
const models_1 = require("../models");
const engagementRules_json_1 = __importDefault(require("../config/engagementRules.json"));
class EngagementService {
    // Get multiple next actions (primary + alternatives)
    static async getNextActions(userId) {
        try {
            // Get user's personality
            const user = await models_1.User.findByPk(userId, {
                include: [
                    {
                        model: (await Promise.resolve().then(() => __importStar(require('../models')))).UserPersonality,
                        as: 'personalities',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                ],
            });
            if (!user) {
                return null;
            }
            const userWithPersonalities = user;
            const latestPersonality = userWithPersonalities.personalities?.[0];
            const personality = latestPersonality?.newPersonality || latestPersonality?.personalityType || 'default';
            // Get all catalog cards
            const allCards = (0, recommendationCatalogService_1.queryCatalog)({});
            // Filter out actions already done today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const doneToday = await UserAction_1.default.findAll({
                where: {
                    userId,
                    occurredAt: {
                        [require('sequelize').Op.gte]: today,
                    },
                },
            });
            const doneRecoIds = new Set(doneToday.map((a) => a.recommendationId));
            // Get priority order for this personality
            const priorityRule = engagementRules_json_1.default.priorities.find((p) => p.ifPersonality === personality) || engagementRules_json_1.default.priorities.find((p) => p.default === true);
            // Rank cards
            const scoredCards = allCards
                .filter((card) => !doneRecoIds.has(card.id))
                .map((card) => ({
                card,
                score: this.scoreCardForPersonality(card, priorityRule?.order || []),
            }))
                .sort((a, b) => b.score - a.score);
            if (scoredCards.length === 0) {
                return null;
            }
            // Get top 3 cards
            const top3 = scoredCards.slice(0, 3);
            const primaryCard = top3[0].card;
            const alternatives = top3.slice(1);
            const convertCard = (card) => {
                const rupees = Math.round(card.estImpactKgPerYear * 20);
                const co2_kg = card.estImpactKgPerYear / 365;
                return {
                    rupees,
                    co2_kg: parseFloat(co2_kg.toFixed(3)),
                };
            };
            // Determine types for alternatives
            const quickWinThreshold = typeof engagementRules_json_1.default.quickWinsThreshold === 'number'
                ? engagementRules_json_1.default.quickWinsThreshold
                : (engagementRules_json_1.default.quickWinsThreshold?.rupees || 150);
            const levelUpThreshold = typeof engagementRules_json_1.default.levelUpThreshold === 'number'
                ? engagementRules_json_1.default.levelUpThreshold
                : (engagementRules_json_1.default.levelUpThreshold?.rupees || 500);
            return {
                primary: {
                    id: primaryCard.id,
                    title: primaryCard.action,
                    category: primaryCard.domain,
                    type: 'best',
                    impact: {
                        ...convertCard(primaryCard),
                        label: engagementRules_json_1.default.labels.next_rupee_win,
                    },
                    whyShown: `Personality: ${personality} • Priority match`,
                },
                alternatives: alternatives.map((item, idx) => {
                    const card = item.card;
                    const impact = convertCard(card);
                    const type = impact.rupees < quickWinThreshold ? 'quick_win' : 'level_up';
                    return {
                        id: card.id,
                        title: card.action,
                        category: card.domain,
                        type: type,
                        impact,
                        whyShown: type === 'quick_win' ? 'Quick & easy win' : 'Level up challenge',
                    };
                }),
            };
        }
        catch (error) {
            console.error('Error getting next actions:', error);
            return null;
        }
    }
    // Get best next action for a user based on personality and rules
    static async getBestNextAction(userId) {
        try {
            // Get user's personality
            const user = await models_1.User.findByPk(userId, {
                include: [
                    {
                        model: (await Promise.resolve().then(() => __importStar(require('../models')))).UserPersonality,
                        as: 'personalities',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                    },
                ],
            });
            if (!user) {
                return null;
            }
            const userWithPersonalities = user;
            const latestPersonality = userWithPersonalities.personalities?.[0];
            const personality = latestPersonality?.newPersonality || latestPersonality?.personalityType || 'default';
            // Get all catalog cards
            const allCards = (0, recommendationCatalogService_1.queryCatalog)({});
            // Filter out actions already done today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const doneToday = await UserAction_1.default.findAll({
                where: {
                    userId,
                    occurredAt: {
                        [require('sequelize').Op.gte]: today,
                    },
                },
            });
            const doneRecoIds = new Set(doneToday.map((a) => a.recommendationId));
            // Get priority order for this personality
            const priorityRule = engagementRules_json_1.default.priorities.find((p) => p.ifPersonality === personality) || engagementRules_json_1.default.priorities.find((p) => p.default === true);
            // Rank cards
            const scoredCards = allCards
                .filter((card) => !doneRecoIds.has(card.id))
                .map((card) => ({
                card,
                score: this.scoreCardForPersonality(card, priorityRule?.order || []),
            }))
                .sort((a, b) => b.score - a.score);
            if (scoredCards.length === 0) {
                return null;
            }
            const topCard = scoredCards[0].card;
            // Calculate preview impact
            const rupees = Math.round(topCard.estImpactKgPerYear * 20); // rough conversion
            const co2_kg = topCard.estImpactKgPerYear / 365; // daily estimate
            return {
                id: topCard.id,
                title: topCard.action,
                category: topCard.domain,
                cta: 'Mark Done',
                previewImpact: {
                    rupees,
                    co2_kg: parseFloat(co2_kg.toFixed(3)),
                    label: engagementRules_json_1.default.labels.next_rupee_win,
                },
                whyShown: `Personality: ${personality} • Priority match`,
                source: `Source: WRAP 2023 • Last updated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
                learnMore: {
                    summary: topCard.why,
                },
            };
        }
        catch (error) {
            console.error('Error getting best next action:', error);
            return null;
        }
    }
    // Score a card based on personality priorities
    static scoreCardForPersonality(card, priorityOrder) {
        let score = 0;
        // Check if card matches priority categories
        const categoryOrder = priorityOrder.findIndex((cat) => card.domain.includes(cat) ||
            card.action.toLowerCase().includes(cat.toLowerCase()));
        if (categoryOrder >= 0) {
            score += (priorityOrder.length - categoryOrder) * 100;
        }
        // Boost by priority and impact
        score += card.priority * 10;
        score += Math.min(5, Math.round(card.estImpactKgPerYear / 100));
        return score;
    }
    // Record action done
    static async recordActionDone(userId, recommendationId, context) {
        try {
            // Get card to extract impact
            const allCards = (0, recommendationCatalogService_1.queryCatalog)({});
            const card = allCards.find((c) => c.id === recommendationId);
            if (!card) {
                throw new Error('Recommendation not found');
            }
            // Check if already done today (idempotent)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const existing = await UserAction_1.default.findOne({
                where: {
                    userId,
                    recommendationId,
                    occurredAt: {
                        [require('sequelize').Op.gte]: today,
                    },
                },
            });
            if (existing) {
                // Return existing response
                const streak = await this.getUserStreak(userId);
                return {
                    ok: true,
                    verifiedImpact: {
                        rupees: parseFloat(existing.impactRupees.toString()),
                        co2_kg: parseFloat(existing.impactCo2Kg.toString()),
                    },
                    streak,
                };
            }
            // Calculate impact
            const rupees = Math.round(card.estImpactKgPerYear * 20);
            const co2_kg = card.estImpactKgPerYear / 365;
            // Create action record
            await UserAction_1.default.create({
                userId,
                recommendationId,
                impactRupees: rupees,
                impactCo2Kg: co2_kg,
                source: 'catalog:v1',
            });
            // Update streak
            const streak = await this.updateUserStreak(userId);
            // Check for bonus (15% chance)
            let bonus;
            if (Math.random() < 0.15) {
                const hour = new Date().getHours();
                const timeBonus = hour >= 5 && hour < 10; // 5am-10am
                bonus = {
                    awarded: true,
                    xp: timeBonus ? 20 : 10,
                    label: timeBonus ? 'Early Bird Bonus' : 'Bamboo Bonus',
                };
            }
            return {
                ok: true,
                verifiedImpact: {
                    rupees,
                    co2_kg: parseFloat(co2_kg.toFixed(3)),
                },
                streak,
                bonus,
            };
        }
        catch (error) {
            console.error('Error recording action:', error);
            throw error;
        }
    }
    // Get or create user streak
    static async getUserStreak(userId) {
        const streak = await UserStreak_1.default.findByPk(userId);
        return {
            current: streak?.currentStreakDays || 0,
            longest: streak?.longestStreakDays || 0,
        };
    }
    // Update user streak
    static async updateUserStreak(userId) {
        const today = new Date().toISOString().split('T')[0];
        let streak = await UserStreak_1.default.findByPk(userId);
        if (!streak) {
            streak = await UserStreak_1.default.create({
                userId,
                currentStreakDays: 1,
                longestStreakDays: 1,
                lastActionDate: today,
            });
            return {
                current: 1,
                longest: 1,
            };
        }
        const lastAction = streak.lastActionDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const lastActionStr = lastAction ? new Date(lastAction).toISOString().split('T')[0] : null;
        if (lastActionStr === yesterdayStr) {
            // Continuing streak
            streak.currentStreakDays += 1;
            streak.longestStreakDays = Math.max(streak.currentStreakDays, streak.longestStreakDays);
        }
        else if (lastActionStr !== today) {
            // Broken streak
            streak.currentStreakDays = 1;
        }
        streak.lastActionDate = today;
        await streak.save();
        return {
            current: streak.currentStreakDays,
            longest: streak.longestStreakDays,
        };
    }
    // Get weekly recap
    static async getWeeklyRecap(userId) {
        try {
            const user = await models_1.User.findByPk(userId);
            if (!user) {
                return null;
            }
            // Calculate week start (Monday)
            const now = new Date();
            const dayOfWeek = now.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() + diff);
            weekStart.setHours(0, 0, 0, 0);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            // Get actions for this week
            const actions = await UserAction_1.default.findAll({
                where: {
                    userId,
                    occurredAt: {
                        [require('sequelize').Op.between]: [weekStart, weekEnd],
                    },
                },
            });
            const rupeesSaved = actions.reduce((sum, a) => sum + parseFloat(a.impactRupees.toString()), 0);
            const co2SavedKg = actions.reduce((sum, a) => sum + parseFloat(a.impactCo2Kg.toString()), 0);
            // Calculate city community stats
            const cityActions = await UserAction_1.default.findAll({
                where: {
                    occurredAt: {
                        [require('sequelize').Op.between]: [weekStart, weekEnd],
                    },
                },
                include: [
                    {
                        model: models_1.User,
                        as: 'user',
                        where: user.city ? { city: user.city } : undefined,
                        attributes: [],
                    },
                ],
            });
            const cityCo2 = cityActions.reduce((sum, a) => sum + parseFloat(a.impactCo2Kg.toString()), 0);
            const cityText = user.city
                ? `${user.city} saved ${(cityCo2 / 1000).toFixed(1)} tons CO₂`
                : undefined;
            return {
                rupeesSaved: parseFloat(rupeesSaved.toFixed(2)),
                co2SavedKg: parseFloat(co2SavedKg.toFixed(3)),
                actionsCount: actions.length,
                cityCommunity: cityText,
                storyText: `You → ${user.city || 'Your City'} → Community`,
                shareImage: {
                    templateId: 'recap-v1',
                    fields: {
                        rupees: rupeesSaved,
                        co2: co2SavedKg,
                    },
                },
            };
        }
        catch (error) {
            console.error('Error getting weekly recap:', error);
            return null;
        }
    }
}
exports.EngagementService = EngagementService;
