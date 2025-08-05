"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const uuid_1 = require("uuid");
const models_1 = require("../models");
class SessionService {
    /**
     * Create a new session or update existing session
     */
    static async createSessionIfNotExists(sessionId, metadata) {
        try {
            // Check if session exists
            let session = await models_1.UserSession.findOne({
                where: { sessionId }
            });
            if (!session) {
                // Create new session
                session = await models_1.UserSession.create({
                    sessionId,
                    lastSeen: new Date(),
                    metadata,
                });
            }
            else {
                // Update last seen
                await session.update({
                    lastSeen: new Date(),
                    metadata: metadata ? { ...session.metadata, ...metadata } : session.metadata,
                });
            }
            return this.convertSessionModelToSession(session);
        }
        catch (error) {
            console.error('Error creating/updating session:', error);
            // If on Vercel and database is unavailable, return a mock session
            if (process.env.VERCEL === '1') {
                console.log('Database unavailable on Vercel, returning mock session');
                return {
                    sessionId,
                    lastSeen: new Date(),
                    metadata,
                };
            }
            throw error;
        }
    }
    /**
     * Log an event for a session
     */
    static async logEvent(sessionId, eventType, payload) {
        try {
            // Verify session exists
            const session = await models_1.UserSession.findOne({
                where: { sessionId }
            });
            if (!session) {
                throw new Error('Session not found');
            }
            // Create event log
            const eventLog = await models_1.EventLog.create({
                eventId: (0, uuid_1.v4)(),
                sessionId,
                eventType,
                payload,
                timestamp: new Date(),
            });
            // Update session last seen
            await session.update({
                lastSeen: new Date(),
            });
            return {
                eventType: eventLog.eventType,
                payload: eventLog.payload,
                timestamp: eventLog.timestamp,
            };
        }
        catch (error) {
            console.error('Error logging event:', error);
            // If on Vercel and database is unavailable, return a mock event
            if (process.env.VERCEL === '1') {
                console.log('Database unavailable on Vercel, returning mock event');
                return {
                    eventType,
                    payload,
                    timestamp: new Date(),
                };
            }
            throw error;
        }
    }
    /**
     * Link session to user upon signup
     */
    static async linkSessionToUser(sessionId, userId) {
        try {
            const session = await models_1.UserSession.findOne({
                where: { sessionId }
            });
            if (!session) {
                throw new Error('Session not found');
            }
            // Update session with user ID
            await session.update({
                userId,
                lastSeen: new Date(),
            });
            return this.convertSessionModelToSession(session);
        }
        catch (error) {
            console.error('Error linking session to user:', error);
            throw error;
        }
    }
    /**
     * Get user data by session ID
     */
    static async getUserBySession(sessionId) {
        try {
            const session = await models_1.UserSession.findOne({
                where: { sessionId },
                include: [
                    {
                        model: models_1.User,
                        as: 'user',
                        attributes: ['id', 'email', 'firstName', 'age', 'gender', 'profession', 'country', 'city', 'household'],
                    }
                ]
            });
            if (!session) {
                return null;
            }
            return this.convertSessionModelToSession(session);
        }
        catch (error) {
            console.error('Error getting user by session:', error);
            // If on Vercel and database is unavailable, return null
            if (process.env.VERCEL === '1') {
                console.log('Database unavailable on Vercel, returning null for user session');
                return null;
            }
            throw error;
        }
    }
    /**
     * Get session events
     */
    static async getSessionEvents(sessionId, limit = 50) {
        try {
            const events = await models_1.EventLog.findAll({
                where: { sessionId },
                order: [['timestamp', 'DESC']],
                limit,
            });
            return events.map(event => ({
                eventType: event.eventType,
                payload: event.payload,
                timestamp: event.timestamp,
            }));
        }
        catch (error) {
            console.error('Error getting session events:', error);
            throw error;
        }
    }
    /**
     * Helper function to convert UserSession model to SessionData interface
     */
    static convertSessionModelToSession(session) {
        return {
            sessionId: session.sessionId,
            userId: session.userId,
            userData: session.user ? {
                email: session.user.email,
                firstName: session.user.firstName,
                age: session.user.age,
                gender: session.user.gender,
                profession: session.user.profession,
                country: session.user.country,
                city: session.user.city,
                household: session.user.household,
            } : undefined,
            lastSeen: session.lastSeen,
            metadata: session.metadata,
        };
    }
}
exports.SessionService = SessionService;
