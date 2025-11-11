"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextActionsHandler = getNextActionsHandler;
exports.actionDoneHandler = actionDoneHandler;
exports.getBucketListHandler = getBucketListHandler;
exports.getHomeFeedHandler = getHomeFeedHandler;
exports.getWeeklyRecapHandler = getWeeklyRecapHandler;
const models_1 = require("../models");
const engagementService_1 = require("../services/engagementService");
const enhancedEngagementService_1 = require("../services/engagement/enhancedEngagementService");
const learning_1 = require("../services/engagement/learning");
const bucketListService_1 = require("../services/engagement/bucketListService");
const models_2 = require("../models");
const sequelize_1 = require("sequelize");
/**
 * Get user ID from email (helper for authenticated requests)
 */
async function getUserIdFromEmail(email) {
    const user = await models_1.User.findOne({ where: { email } });
    return user?.id || null;
}
/**
 * GET /v1/engagement/next-actions
 * Returns 1 primary and 2 alternatives ranked via Rule Overlay
 */
async function getNextActionsHandler(req, res) {
    try {
        const userEmail = req.userEmail;
        if (!userEmail) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const userId = await getUserIdFromEmail(userEmail);
        if (!userId) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Feature flag: use enhanced scoring if available
        // For now, default to enhanced. Can be controlled via environment variable or config
        const useEnhanced = process.env.USE_ENHANCED_SCORING !== 'false';
        const result = useEnhanced
            ? await (0, enhancedEngagementService_1.getNextActionsEnhanced)(userId)
            : await (0, engagementService_1.getNextActions)(userId);
        return res.json(result);
    }
    catch (error) {
        console.error('Error getting next actions:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });
        return res.status(500).json({
            success: false,
            message: 'Failed to get next actions',
            error: errorMessage,
        });
    }
}
/**
 * POST /v1/engagement/action-done
 * Marks a recommendation done idempotently (per day)
 */
async function actionDoneHandler(req, res) {
    try {
        const userEmail = req.userEmail;
        if (!userEmail) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const userId = await getUserIdFromEmail(userEmail);
        if (!userId) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const { recommendationId, context, outcome } = req.body;
        if (!recommendationId) {
            return res.status(400).json({
                success: false,
                message: 'recommendationId is required',
            });
        }
        // Validate outcome if provided
        const validOutcome = outcome && ['done', 'snooze', 'dismiss'].includes(outcome)
            ? outcome
            : 'done'; // Default to 'done' for backward compatibility
        // Support enhanced learning if outcome is provided or enabled
        const useEnhancedLearning = process.env.USE_ENHANCED_LEARNING !== 'false';
        const result = useEnhancedLearning
            ? await (0, learning_1.markDoneAndLearn)(userId, recommendationId, validOutcome, context || {})
            : await (0, engagementService_1.markActionDone)(userId, recommendationId, context || {});
        return res.json({
            ok: true,
            ...result,
        });
    }
    catch (error) {
        console.error('Error marking action done:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to mark action done',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
/**
 * GET /v1/engagement/home-feed
 * Returns a unified feed for "Your Week" sections
 */
/**
 * GET /v1/engagement/bucket-list
 * Returns all recommendations user has marked as DONE or SNOOZE
 */
async function getBucketListHandler(req, res) {
    try {
        const userEmail = req.userEmail;
        if (!userEmail) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const userId = await getUserIdFromEmail(userEmail);
        if (!userId) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const result = await (0, bucketListService_1.getBucketList)(userId);
        return res.json(result);
    }
    catch (error) {
        console.error('Error getting bucket list:', error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to get bucket list',
        });
    }
}
async function getHomeFeedHandler(req, res) {
    try {
        const userEmail = req.userEmail;
        if (!userEmail) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const userId = await getUserIdFromEmail(userEmail);
        if (!userId) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Get actions from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const actions = await models_2.UserAction.findAll({
            where: {
                userId,
                occurredAt: {
                    [sequelize_1.Op.gte]: sevenDaysAgo,
                },
            },
            order: [['occurredAt', 'DESC']],
        });
        // Group by category/domain (simplified - in real app would map to recommendation domains)
        const feed = {
            quickWins: actions.filter((a) => Number(a.impactCo2Kg) <= 0.25).slice(0, 5),
            moneySavers: actions.filter((a) => Number(a.impactRupees) >= 200).slice(0, 5),
            habitBuilders: actions.slice(0, 10), // All actions can be habit builders
            commute: actions.filter((a) => a.metadata?.category === 'transport').slice(0, 5),
        };
        return res.json({
            success: true,
            feed,
        });
    }
    catch (error) {
        console.error('Error getting home feed:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get home feed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
/**
 * GET /v1/engagement/weekly-recap
 * Returns recap numbers + share template fields
 */
async function getWeeklyRecapHandler(req, res) {
    try {
        const userEmail = req.userEmail;
        if (!userEmail) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const userId = await getUserIdFromEmail(userEmail);
        if (!userId) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Get user for city
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Calculate last week (Monday to Sunday, Asia/Karachi timezone)
        const now = new Date();
        const lastMonday = new Date(now);
        lastMonday.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7) - 7); // Go back to last Monday
        lastMonday.setUTCHours(0, 0, 0, 0);
        lastMonday.setUTCHours(lastMonday.getUTCHours() - 5); // PKT timezone
        const lastSunday = new Date(lastMonday);
        lastSunday.setUTCDate(lastSunday.getUTCDate() + 6);
        lastSunday.setUTCHours(23, 59, 59, 999);
        // Get or compute weekly summary
        // Convert to date string for comparison (database stores as DATEONLY)
        const weekStartStr = lastMonday.toISOString().split('T')[0];
        let summary = await models_2.WeeklySummary.findOne({
            where: {
                userId,
                weekStart: weekStartStr,
            },
        });
        if (!summary) {
            // Compute from actions
            const actions = await models_2.UserAction.findAll({
                where: {
                    userId,
                    occurredAt: {
                        [sequelize_1.Op.gte]: lastMonday,
                        [sequelize_1.Op.lte]: lastSunday,
                    },
                },
            });
            const rupeesSaved = actions.reduce((sum, a) => sum + Number(a.impactRupees), 0);
            const co2SavedKg = actions.reduce((sum, a) => sum + Number(a.impactCo2Kg), 0);
            // Use ISO date string for DATEONLY column to avoid driver inconsistencies
            summary = await models_2.WeeklySummary.create({
                userId,
                weekStart: weekStartStr, // DATEONLY accepts string format
                rupeesSaved,
                co2SavedKg,
                actionsCount: actions.length,
                cityText: user.city ? `${user.city} saved 17 tons CO₂` : null,
            });
        }
        const storyText = user.city
            ? `You → ${user.city} → Community`
            : 'You → Community';
        return res.json({
            rupeesSaved: Number(summary.rupeesSaved),
            co2SavedKg: Number(summary.co2SavedKg),
            actionsCount: summary.actionsCount,
            cityCommunity: summary.cityText || undefined,
            storyText,
            shareImage: {
                templateId: 'recap-v1',
                fields: {
                    rupees: Number(summary.rupeesSaved),
                    co2: Number(summary.co2SavedKg),
                    city: user.city || 'Community',
                },
            },
        });
    }
    catch (error) {
        console.error('Error getting weekly recap:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get weekly recap',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
