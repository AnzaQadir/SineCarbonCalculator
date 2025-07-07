import { SignupUserData, User, UserActivity } from '../types/user';
import { User as UserModel, UserActivity as UserActivityModel } from '../models';

export class UserService {
  /**
   * Helper function to convert UserModel to User interface
   */
  private static convertUserModelToUser(user: any): User {
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
      ctaVariant: (user.ctaVariant || 'A') as 'A' | 'B',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Helper function to convert UserActivityModel to UserActivity interface
   */
  private static convertActivityModelToActivity(activity: any): UserActivity {
    return {
      id: activity.id,
      userId: activity.userId,
      activityType: activity.activityType as 'SIGNUP' | 'EMAIL_SENT' | 'COMMUNITY_JOINED' | 'PROFILE_UPDATED',
      metadata: activity.metadata,
      createdAt: activity.createdAt,
    };
  }
  /**
   * Create a new user and track signup activity
   */
  static async createUser(userData: SignupUserData): Promise<User> {
    // Get current user count for waitlist position
    const userCount = await UserModel.count();
    const waitlistPosition = userCount + 1;
    
    // Create user in database
    const user = await UserModel.create({
      email: userData.email.toLowerCase(),
      firstName: userData.firstName,
      age: userData.age,
      gender: userData.gender,
      profession: userData.profession,
      country: userData.country,
      city: userData.city,
      household: userData.household,
      waitlistPosition,
      ctaVariant: (userData.ctaVariant || 'A') as 'A' | 'B',
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

    // Convert to User interface
    return this.convertUserModelToUser(user);
  }

  /**
   * Track user activity
   */
  static async trackUserActivity(
    userId: string, 
    activityType: 'SIGNUP' | 'EMAIL_SENT' | 'COMMUNITY_JOINED' | 'PROFILE_UPDATED', 
    metadata?: Record<string, any>
  ): Promise<UserActivity> {
    const activity = await UserActivityModel.create({
      userId,
      activityType,
      metadata,
    });

    return {
      id: activity.id,
      userId: activity.userId,
      activityType: activity.activityType as 'SIGNUP' | 'EMAIL_SENT' | 'COMMUNITY_JOINED' | 'PROFILE_UPDATED',
      metadata: activity.metadata,
      createdAt: activity.createdAt,
    };
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return null;

    return this.convertUserModelToUser(user);
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    return this.convertUserModelToUser(user);
  }

  /**
   * Get all users (for admin purposes)
   */
  static async getAllUsers(): Promise<User[]> {
    const users = await UserModel.findAll({
      order: [['createdAt', 'DESC']],
    });

    return users.map(user => this.convertUserModelToUser(user));
  }

  /**
   * Get user activities
   */
  static async getUserActivities(userId: string): Promise<UserActivity[]> {
    const activities = await UserActivityModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return activities.map(activity => this.convertActivityModelToActivity(activity));
  }

  /**
   * Get total user count
   */
  static async getUserCount(): Promise<number> {
    return await UserModel.count();
  }

  /**
   * Update user profile
   */
  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    await user.update(updates);

    // Track profile update activity
    await this.trackUserActivity(id, 'PROFILE_UPDATED', { updates });

    return this.convertUserModelToUser(user);
  }

  /**
   * Join community (track community join activity)
   */
  static async joinCommunity(userId: string): Promise<UserActivity> {
    return await this.trackUserActivity(userId, 'COMMUNITY_JOINED', {
      joinedAt: new Date().toISOString(),
    });
  }

  /**
   * Track email sent activity
   */
  static async trackEmailSent(userId: string, emailType: string): Promise<UserActivity> {
    return await this.trackUserActivity(userId, 'EMAIL_SENT', {
      emailType,
      sentAt: new Date().toISOString(),
    });
  }
} 