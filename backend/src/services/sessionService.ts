import { v4 as uuidv4 } from 'uuid';
import { UserSession, EventLog, User } from '../models';

export interface SessionData {
  sessionId: string;
  userId?: string;
  userData?: {
    email?: string;
    firstName?: string;
    age?: string;
    gender?: string;
    profession?: string;
    country?: string;
    city?: string;
    household?: string;
  };
  lastSeen: Date;
  metadata?: Record<string, any>;
}

export interface EventData {
  eventType: string;
  payload?: Record<string, any>;
  timestamp?: Date;
}

export class SessionService {
  /**
   * Create a new session or update existing session
   */
  static async createSessionIfNotExists(sessionId: string, metadata?: Record<string, any>): Promise<SessionData> {
    try {
      // Check if session exists
      let session = await UserSession.findOne({
        where: { sessionId }
      });

      if (!session) {
        // Create new session
        session = await UserSession.create({
          sessionId,
          lastSeen: new Date(),
          metadata,
        });
      } else {
        // Update last seen
        await session.update({
          lastSeen: new Date(),
          metadata: metadata ? { ...session.metadata, ...metadata } : session.metadata,
        });
      }

      return this.convertSessionModelToSession(session);
    } catch (error) {
      console.error('Error creating/updating session:', error);
      throw error;
    }
  }

  /**
   * Log an event for a session
   */
  static async logEvent(sessionId: string, eventType: string, payload?: Record<string, any>): Promise<EventData> {
    try {
      // Verify session exists
      const session = await UserSession.findOne({
        where: { sessionId }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Create event log
      const eventLog = await EventLog.create({
        eventId: uuidv4(),
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
    } catch (error) {
      console.error('Error logging event:', error);
      throw error;
    }
  }

  /**
   * Link session to user upon signup
   */
  static async linkSessionToUser(sessionId: string, userId: string): Promise<SessionData> {
    try {
      const session = await UserSession.findOne({
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
    } catch (error) {
      console.error('Error linking session to user:', error);
      throw error;
    }
  }

  /**
   * Get user data by session ID
   */
  static async getUserBySession(sessionId: string): Promise<SessionData | null> {
    try {
      const session = await UserSession.findOne({
        where: { sessionId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'firstName', 'age', 'gender', 'profession', 'country', 'city', 'household'],
          }
        ]
      });

      if (!session) {
        return null;
      }

      return this.convertSessionModelToSession(session);
    } catch (error) {
      console.error('Error getting user by session:', error);
      throw error;
    }
  }

  /**
   * Get session events
   */
  static async getSessionEvents(sessionId: string, limit: number = 50): Promise<EventData[]> {
    try {
      const events = await EventLog.findAll({
        where: { sessionId },
        order: [['timestamp', 'DESC']],
        limit,
      });

      return events.map(event => ({
        eventType: event.eventType,
        payload: event.payload,
        timestamp: event.timestamp,
      }));
    } catch (error) {
      console.error('Error getting session events:', error);
      throw error;
    }
  }

  /**
   * Helper function to convert UserSession model to SessionData interface
   */
  private static convertSessionModelToSession(session: any): SessionData {
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