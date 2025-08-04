"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const sessionService_1 = require("../services/sessionService");
class SessionController {
    /**
     * Create or refresh session
     */
    static async createSession(req, res) {
        try {
            const sessionId = req.headers['x-session-id'];
            if (!sessionId) {
                res.status(400).json({
                    success: false,
                    error: 'Session ID is required'
                });
                return;
            }
            const metadata = req.body.metadata;
            const session = await sessionService_1.SessionService.createSessionIfNotExists(sessionId, metadata);
            res.status(200).json({
                success: true,
                session,
                message: 'Session created/updated successfully'
            });
        }
        catch (error) {
            console.error('Error creating session:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Log an event
     */
    static async logEvent(req, res) {
        try {
            const sessionId = req.headers['x-session-id'];
            if (!sessionId) {
                res.status(400).json({
                    success: false,
                    error: 'Session ID is required'
                });
                return;
            }
            const { eventType, payload } = req.body;
            if (!eventType) {
                res.status(400).json({
                    success: false,
                    error: 'Event type is required'
                });
                return;
            }
            const event = await sessionService_1.SessionService.logEvent(sessionId, eventType, payload);
            res.status(200).json({
                success: true,
                event,
                message: 'Event logged successfully'
            });
        }
        catch (error) {
            console.error('Error logging event:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Get user data by session ID
     */
    static async getUserBySession(req, res) {
        try {
            const { sessionId } = req.params;
            if (!sessionId) {
                res.status(400).json({
                    success: false,
                    error: 'Session ID is required'
                });
                return;
            }
            const session = await sessionService_1.SessionService.getUserBySession(sessionId);
            if (!session) {
                res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                session,
                message: 'Session data retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error getting user by session:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Get session events
     */
    static async getSessionEvents(req, res) {
        try {
            const { sessionId } = req.params;
            const limit = parseInt(req.query.limit) || 50;
            if (!sessionId) {
                res.status(400).json({
                    success: false,
                    error: 'Session ID is required'
                });
                return;
            }
            const events = await sessionService_1.SessionService.getSessionEvents(sessionId, limit);
            res.status(200).json({
                success: true,
                events,
                message: 'Session events retrieved successfully'
            });
        }
        catch (error) {
            console.error('Error getting session events:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}
exports.SessionController = SessionController;
