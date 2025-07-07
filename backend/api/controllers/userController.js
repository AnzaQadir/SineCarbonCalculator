"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const emailService_1 = require("../services/emailService");
class UserController {
    /**
     * Handle user signup
     */
    static async signup(req, res) {
        try {
            const userData = req.body;
            // Validate required fields
            if (!userData.email) {
                res.status(400).json({
                    success: false,
                    error: 'Email is required'
                });
                return;
            }
            // Check if user already exists
            const existingUser = await userService_1.UserService.getUserByEmail(userData.email);
            if (existingUser) {
                res.status(409).json({
                    success: false,
                    error: 'User with this email already exists'
                });
                return;
            }
            // Create user
            const user = await userService_1.UserService.createUser(userData);
            // Send welcome email
            const emailSent = await emailService_1.EmailService.sendWelcomeEmail(user);
            // Track email activity
            if (emailSent) {
                await userService_1.UserService.trackEmailSent(user.id, 'WELCOME_EMAIL');
            }
            const response = {
                success: true,
                user,
                waitlistPosition: user.waitlistPosition,
                message: 'User created successfully'
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Error in signup:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Handle community join
     */
    static async joinCommunity(req, res) {
        try {
            const { userId } = req.body;
            if (!userId) {
                res.status(400).json({
                    success: false,
                    error: 'User ID is required'
                });
                return;
            }
            // Get user
            const user = await userService_1.UserService.getUserById(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }
            // Track community join activity
            const activity = await userService_1.UserService.joinCommunity(userId);
            // Send community join email
            const emailSent = await emailService_1.EmailService.sendCommunityJoinEmail(user);
            // Track email activity
            if (emailSent) {
                await userService_1.UserService.trackEmailSent(userId, 'COMMUNITY_JOIN_EMAIL');
            }
            const response = {
                success: true,
                activity,
                message: 'Successfully joined community'
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Error joining community:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Get user by ID
     */
    static async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await userService_1.UserService.getUserById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                user
            });
        }
        catch (error) {
            console.error('Error getting user:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Get user activities
     */
    static async getUserActivities(req, res) {
        try {
            const { userId } = req.params;
            const activities = await userService_1.UserService.getUserActivities(userId);
            res.status(200).json({
                success: true,
                activities
            });
        }
        catch (error) {
            console.error('Error getting user activities:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Get all users (admin only)
     */
    static async getAllUsers(req, res) {
        try {
            const users = await userService_1.UserService.getAllUsers();
            res.status(200).json({
                success: true,
                users,
                count: users.length
            });
        }
        catch (error) {
            console.error('Error getting all users:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Get user count
     */
    static async getUserCount(req, res) {
        try {
            const count = await userService_1.UserService.getUserCount();
            res.status(200).json({
                success: true,
                count
            });
        }
        catch (error) {
            console.error('Error getting user count:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Update user profile
     */
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedUser = await userService_1.UserService.updateUser(id, updates);
            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                user: updatedUser
            });
        }
        catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}
exports.UserController = UserController;
