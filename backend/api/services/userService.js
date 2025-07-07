"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// In-memory storage for demo purposes
// In production, this would be replaced with a real database
const users = [];
const userActivities = [];
class UserService {
    /**
     * Create a new user and track signup activity
     */
    static async createUser(userData) {
        // Generate waitlist position based on current user count
        const waitlistPosition = users.length + 1;
        // Create user object
        const user = {
            id: this.generateUserId(),
            email: userData.email.toLowerCase(),
            firstName: userData.firstName,
            age: userData.age,
            gender: userData.gender,
            profession: userData.profession,
            country: userData.country,
            city: userData.city,
            household: userData.household,
            waitlistPosition,
            ctaVariant: userData.ctaVariant || 'A',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // Store user
        users.push(user);
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
        return user;
    }
    /**
     * Track user activity
     */
    static async trackUserActivity(userId, activityType, metadata) {
        const activity = {
            id: this.generateActivityId(),
            userId,
            activityType,
            metadata,
            createdAt: new Date(),
        };
        userActivities.push(activity);
        return activity;
    }
    /**
     * Get user by email
     */
    static async getUserByEmail(email) {
        return users.find(user => user.email === email.toLowerCase()) || null;
    }
    /**
     * Get user by ID
     */
    static async getUserById(id) {
        return users.find(user => user.id === id) || null;
    }
    /**
     * Get all users (for admin purposes)
     */
    static async getAllUsers() {
        return [...users];
    }
    /**
     * Get user activities
     */
    static async getUserActivities(userId) {
        return userActivities.filter(activity => activity.userId === userId);
    }
    /**
     * Get total user count
     */
    static async getUserCount() {
        return users.length;
    }
    /**
     * Update user profile
     */
    static async updateUser(id, updates) {
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1)
            return null;
        users[userIndex] = {
            ...users[userIndex],
            ...updates,
            updatedAt: new Date(),
        };
        // Track profile update activity
        await this.trackUserActivity(id, 'PROFILE_UPDATED', { updates });
        return users[userIndex];
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
    /**
     * Generate unique user ID
     */
    static generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Generate unique activity ID
     */
    static generateActivityId() {
        return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.UserService = UserService;
