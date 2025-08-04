"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const models_1 = require("../models");
const sessionService_1 = require("./sessionService");
class UserService {
    /**
     * Helper function to convert UserModel to User interface
     */
    static convertUserModelToUser(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            age: user.age,
            gender: user.gender,
            profession: user.profession,
            country: user.country,
            city: user.city,
            household: user.household,
            waitlistPosition: user.waitlistPosition,
            ctaVariant: (user.ctaVariant || 'A'),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    /**
     * Helper function to convert UserActivityModel to UserActivity interface
     */
    static convertActivityModelToActivity(activity) {
        return {
            id: activity.id,
            userId: activity.userId,
            activityType: activity.activityType,
            metadata: activity.metadata,
            createdAt: activity.createdAt,
        };
    }
    /**
     * Create a new user and track signup activity
     */
    static async createUser(userData, sessionId) {
        // Get current user count for waitlist position
        const userCount = await models_1.User.count();
        const waitlistPosition = userCount + 1;
        // Create user in database
        const user = await models_1.User.create({
            email: userData.email.toLowerCase(),
            firstName: userData.firstName,
            age: userData.age,
            gender: userData.gender,
            profession: userData.profession,
            country: userData.country,
            city: userData.city,
            household: userData.household,
            waitlistPosition,
            ctaVariant: (userData.ctaVariant || 'A'),
        });
        // Track signup activity
        await this.trackUserActivity(user.id, 'SIGNUP', {
            waitlistPosition,
            ctaVariant: user.ctaVariant,
            userData: {
                age: user.age,
                gender: user.gender,
                profession: user.profession,
                country: user.country,
                city: user.city,
                household: user.household,
            }
        });
        // Link session to user if sessionId provided
        if (sessionId) {
            await sessionService_1.SessionService.linkSessionToUser(sessionId, user.id);
        }
        // Convert to User interface
        return this.convertUserModelToUser(user);
    }
    /**
     * Track user activity
     */
    static async trackUserActivity(userId, activityType, metadata) {
        const activity = await models_1.UserActivity.create({
            userId,
            activityType,
            metadata,
        });
        return {
            id: activity.id,
            userId: activity.userId,
            activityType: activity.activityType,
            metadata: activity.metadata,
            createdAt: activity.createdAt,
        };
    }
    /**
     * Get user by email
     */
    static async getUserByEmail(email) {
        const user = await models_1.User.findOne({ where: { email: email.toLowerCase() } });
        if (!user)
            return null;
        return this.convertUserModelToUser(user);
    }
    /**
     * Get user by first name
     */
    static async getUserByFirstName(firstName) {
        const user = await models_1.User.findOne({
            where: {
                firstName: firstName
            }
        });
        if (!user)
            return null;
        return this.convertUserModelToUser(user);
    }
    /**
     * Get user by ID
     */
    static async getUserById(id) {
        const user = await models_1.User.findByPk(id);
        if (!user)
            return null;
        return this.convertUserModelToUser(user);
    }
    /**
     * Get all users (for admin purposes)
     */
    static async getAllUsers() {
        const users = await models_1.User.findAll({
            order: [['createdAt', 'DESC']],
        });
        return users.map(user => this.convertUserModelToUser(user));
    }
    /**
     * Get user activities
     */
    static async getUserActivities(userId) {
        const activities = await models_1.UserActivity.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
        return activities.map(activity => this.convertActivityModelToActivity(activity));
    }
    /**
     * Get total user count
     */
    static async getUserCount() {
        return await models_1.User.count();
    }
    /**
     * Update user profile
     */
    static async updateUser(id, updates) {
        const user = await models_1.User.findByPk(id);
        if (!user)
            return null;
        await user.update(updates);
        // Track profile update activity
        await this.trackUserActivity(id, 'PROFILE_UPDATED', { updates });
        return this.convertUserModelToUser(user);
    }
    /**
     * Join community (track community join activity)
     */
    static async joinCommunity(userId) {
        return await this.trackUserActivity(userId, 'COMMUNITY_JOINED', {
            joinedAt: new Date().toISOString(),
        });
    }
    /**
     * Track email sent activity
     */
    static async trackEmailSent(userId, emailType) {
        return await this.trackUserActivity(userId, 'EMAIL_SENT', {
            emailType,
            sentAt: new Date().toISOString(),
        });
    }
}
exports.UserService = UserService;
