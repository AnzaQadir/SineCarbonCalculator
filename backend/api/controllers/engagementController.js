"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngagementController = void 0;
const engagementService_1 = require("../services/engagementService");
const models_1 = require("../models");
class EngagementController {
    // Helper to get userId from email or direct userId
    static async getUserId(req) {
        if (req.userId) {
            return req.userId;
        }
        if (req.userEmail) {
            const user = await models_1.User.findOne({ where: { email: req.userEmail } });
            return user?.id || null;
        }
        return null;
    }
    // GET /v1/engagement/next-actions (returns multiple cards)
    static async getNextActions(req, res) {
        try {
            const userId = await EngagementController.getUserId(req);
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const actions = await engagementService_1.EngagementService.getNextActions(userId);
            if (!actions) {
                return res.status(404).json({ error: 'No actions available' });
            }
            res.json(actions);
        }
        catch (error) {
            console.error('Error getting next actions:', error);
            res.status(500).json({ error: 'Failed to get next actions' });
        }
    }
    // GET /v1/engagement/best-next-action (legacy single action)
    static async getBestNextAction(req, res) {
        try {
            const userId = await EngagementController.getUserId(req);
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const action = await engagementService_1.EngagementService.getBestNextAction(userId);
            if (!action) {
                return res.status(404).json({ error: 'No actions available' });
            }
            res.json(action);
        }
        catch (error) {
            console.error('Error getting best next action:', error);
            res.status(500).json({ error: 'Failed to get best next action' });
        }
    }
    // POST /v1/engagement/action-done
    static async actionDone(req, res) {
        try {
            const userId = await EngagementController.getUserId(req);
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const { recommendationId, context } = req.body;
            if (!recommendationId) {
                return res.status(400).json({ error: 'Recommendation ID is required' });
            }
            const result = await engagementService_1.EngagementService.recordActionDone(userId, recommendationId, context);
            res.json(result);
        }
        catch (error) {
            console.error('Error recording action:', error);
            res.status(500).json({ error: 'Failed to record action' });
        }
    }
    // GET /v1/engagement/home-feed
    static async getHomeFeed(req, res) {
        try {
            const userId = await EngagementController.getUserId(req);
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            // Get best next action
            const bestNextAction = await engagementService_1.EngagementService.getBestNextAction(userId);
            // Get all catalog cards (simplified for now)
            const { queryCatalog } = require('../services/recommendationCatalogService');
            const allCards = queryCatalog({});
            // Group by domain
            const sections = [
                {
                    title: 'Quick Wins',
                    cards: allCards.slice(0, 3).map((card) => ({
                        id: card.id,
                        title: card.action,
                        domain: card.domain,
                        actFirst: true,
                        learn: { summary: card.why },
                    })),
                },
                {
                    title: 'Money Savers',
                    cards: allCards.slice(3, 6).map((card) => ({
                        id: card.id,
                        title: card.action,
                        domain: card.domain,
                        actFirst: true,
                        learn: { summary: card.why },
                    })),
                },
            ];
            // Calculate week dates
            const now = new Date();
            const dayOfWeek = now.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() + diff);
            res.json({
                week: {
                    start: weekStart.toISOString().split('T')[0],
                    end: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                },
                bestNextAction,
                sections,
            });
        }
        catch (error) {
            console.error('Error getting home feed:', error);
            res.status(500).json({ error: 'Failed to get home feed' });
        }
    }
    // GET /v1/engagement/weekly-recap
    static async getWeeklyRecap(req, res) {
        try {
            const userId = await EngagementController.getUserId(req);
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const recap = await engagementService_1.EngagementService.getWeeklyRecap(userId);
            if (!recap) {
                return res.status(404).json({ error: 'No recap available' });
            }
            res.json(recap);
        }
        catch (error) {
            console.error('Error getting weekly recap:', error);
            res.status(500).json({ error: 'Failed to get weekly recap' });
        }
    }
}
exports.EngagementController = EngagementController;
