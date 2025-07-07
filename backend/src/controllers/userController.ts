import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { EmailService } from '../services/emailService';
import { SignupUserData, SignupResponse, UserActivityResponse } from '../types/user';

export class UserController {
  /**
   * Handle user signup
   */
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const userData: SignupUserData = req.body;

      // Validate required fields
      if (!userData.email) {
        res.status(400).json({
          success: false,
          error: 'Email is required'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await UserService.getUserByEmail(userData.email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
        return;
      }

      // Create user
      const user = await UserService.createUser(userData);

      // Send welcome email
      const emailSent = await EmailService.sendWelcomeEmail(user);
      
      // Track email activity
      if (emailSent) {
        await UserService.trackEmailSent(user.id, 'WELCOME_EMAIL');
      }

      const response: SignupResponse = {
        success: true,
        user,
        waitlistPosition: user.waitlistPosition,
        message: 'User created successfully'
      };

      res.status(201).json(response);

    } catch (error) {
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
  static async joinCommunity(req: Request, res: Response): Promise<void> {
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
      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Track community join activity
      const activity = await UserService.joinCommunity(userId);

      // Send community join email
      const emailSent = await EmailService.sendCommunityJoinEmail(user);
      
      // Track email activity
      if (emailSent) {
        await UserService.trackEmailSent(userId, 'COMMUNITY_JOIN_EMAIL');
      }

      const response: UserActivityResponse = {
        success: true,
        activity,
        message: 'Successfully joined community'
      };

      res.status(200).json(response);

    } catch (error) {
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
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await UserService.getUserById(id);
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

    } catch (error) {
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
  static async getUserActivities(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const activities = await UserService.getUserActivities(userId);

      res.status(200).json({
        success: true,
        activities
      });

    } catch (error) {
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
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({
        success: true,
        users,
        count: users.length
      });

    } catch (error) {
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
  static async getUserCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await UserService.getUserCount();

      res.status(200).json({
        success: true,
        count
      });

    } catch (error) {
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
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedUser = await UserService.updateUser(id, updates);
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

    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 