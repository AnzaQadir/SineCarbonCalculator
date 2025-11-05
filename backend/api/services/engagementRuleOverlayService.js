"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngagementRuleOverlayService = void 0;
const models_1 = require("../models");
const DEFAULT_RULES = {
    version: 'overlay-v1.0',
    priorities: [
        { ifPersonality: 'Guardian', order: ['repair_reuse', 'energy_saver', 'buy_less'] },
        { ifPersonality: 'Catalyst', order: ['share_story', 'group_action', 'community_event'] },
        { ifPersonality: 'Navigator', order: ['commute_switch', 'route_optimize', 'bundle_errands'] },
        { default: true, order: ['quick_wins', 'money_savers', 'habit_formers'] },
    ],
    labels: {
        primary: 'Your Best Next Action',
        quick_win: 'Quick Win',
        level_up: 'Level Up',
        next_rupee_win: 'Next ₹ win',
    },
    filters: {
        excludeIfDoneToday: true,
        excludeIfCategoryMuted: true,
    },
    rotation: {
        cadence: 'weekly',
        dayOfWeek: 'Mon',
    },
    thresholds: {
        quickWinMaxCo2: 0.25,
        quickWinMaxRupees: 200,
        levelUpMinCo2: 0.8,
        levelUpMinRupees: 400,
    },
    tone: {
        eco_guilt: 'affirming',
    },
};
let cachedRules = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60000; // 60 seconds
class EngagementRuleOverlayService {
    /**
     * Load rules from database or use defaults
     */
    static async loadRules() {
        const now = Date.now();
        // Return cached rules if still fresh
        if (cachedRules && now - lastFetchTime < CACHE_TTL_MS) {
            return cachedRules;
        }
        try {
            const config = await models_1.AppConfig.findByPk('engagement_rules_v1');
            if (config && config.value) {
                cachedRules = config.value;
                lastFetchTime = now;
                return cachedRules;
            }
        }
        catch (error) {
            console.error('Error loading engagement rules from database:', error);
        }
        // Fallback to defaults
        if (!cachedRules) {
            cachedRules = DEFAULT_RULES;
            lastFetchTime = now;
        }
        return cachedRules;
    }
    /**
     * Update rules in database (hot-swap)
     */
    static async updateRules(rules) {
        try {
            await models_1.AppConfig.upsert({
                key: 'engagement_rules_v1',
                value: rules,
                updatedAt: new Date(),
            });
            // Invalidate cache
            cachedRules = null;
            lastFetchTime = 0;
        }
        catch (error) {
            console.error('Error updating engagement rules:', error);
            throw error;
        }
    }
    /**
     * Get priority order for a personality
     */
    static getPriorityOrder(rules, personality) {
        if (personality) {
            const personalityRule = rules.priorities.find((p) => p.ifPersonality === personality);
            if (personalityRule) {
                return personalityRule.order;
            }
        }
        const defaultRule = rules.priorities.find((p) => p.default === true);
        return defaultRule?.order || [];
    }
    /**
     * Initialize default rules in database if not present
     */
    static async initializeDefaults() {
        try {
            const existing = await models_1.AppConfig.findByPk('engagement_rules_v1');
            if (!existing) {
                await models_1.AppConfig.create({
                    key: 'engagement_rules_v1',
                    value: DEFAULT_RULES,
                });
                console.log('Initialized default engagement rules');
            }
        }
        catch (error) {
            console.error('Error initializing default rules:', error);
        }
    }
}
exports.EngagementRuleOverlayService = EngagementRuleOverlayService;
// Start polling for rule updates (in production, this could be a separate worker)
if (typeof setInterval !== 'undefined') {
    setInterval(async () => {
        try {
            await EngagementRuleOverlayService.loadRules();
        }
        catch (error) {
            console.error('Error polling engagement rules:', error);
        }
    }, CACHE_TTL_MS);
}
