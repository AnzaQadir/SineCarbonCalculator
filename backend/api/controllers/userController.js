"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const emailService_1 = require("../services/emailService");
const UserPersonality_1 = __importDefault(require("../models/UserPersonality"));
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
            // Get session ID from headers
            const sessionId = req.headers['x-session-id'];
            // Create user
            const user = await userService_1.UserService.createUser(userData, sessionId);
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
    /**
     * Check if user exists by name or email
     */
    static async checkUserExists(req, res) {
        try {
            const { identifier } = req.query;
            if (!identifier || typeof identifier !== 'string') {
                res.status(400).json({
                    success: false,
                    error: 'Identifier is required'
                });
                return;
            }
            // Check by email first, then by firstName
            const userByEmail = await userService_1.UserService.getUserByEmail(identifier);
            if (userByEmail) {
                res.status(200).json({
                    success: true,
                    exists: true,
                    user: userByEmail,
                    matchType: 'email'
                });
                return;
            }
            // If not found by email, check by firstName
            const userByName = await userService_1.UserService.getUserByFirstName(identifier);
            if (userByName) {
                res.status(200).json({
                    success: true,
                    exists: true,
                    user: userByName,
                    matchType: 'name'
                });
                return;
            }
            res.status(200).json({
                success: true,
                exists: false,
                user: null,
                matchType: null
            });
        }
        catch (error) {
            console.error('Error checking user existence:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    /**
     * Check if user has completed the quiz (has entry in user_personalities table)
     */
    static async checkQuiz(req, res) {
        try {
            const userEmail = req.userEmail;
            if (!userEmail) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized - user session required'
                });
                return;
            }
            // Get user by email to get userId
            const user = await userService_1.UserService.getUserByEmail(userEmail);
            if (!user || !user.id) {
                res.status(200).json({
                    success: true,
                    completed: false,
                    message: 'User not found'
                });
                return;
            }
            // Check if user has completed quiz (has entry in user_personalities table)
            const personality = await UserPersonality_1.default.findOne({
                where: { userId: user.id },
                order: [['createdAt', 'DESC']],
            });
            const completed = !!personality;
            res.status(200).json({
                success: true,
                completed: completed,
                message: completed ? 'Quiz already completed' : 'Quiz not completed yet'
            });
        }
        catch (error) {
            console.error('Error checking quiz status:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}
exports.UserController = UserController;
