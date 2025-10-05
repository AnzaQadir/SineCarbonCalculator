import { Request, Response } from 'express';
import { SessionService } from '../services/sessionService';

export class SessionController {
  /**
   * Create or refresh session
   */
  static async createSession(req: Request, res: Response): Promise<void> {
    try {
      const sessionIdHeader = req.headers['x-session-id'] as string;
      const sessionIdCookie = (req as any).sessionId || (req as any).cookies?.[process.env.SESSION_COOKIE_NAME || 'zerrah_session_id'];
      const sessionId = sessionIdHeader || sessionIdCookie;
      
      if (!sessionId) {
        res.status(400).json({
          success: false,
          error: 'Session ID is required'
        });
        return;
      }

      const metadata = req.body.metadata;
      const session = await SessionService.createSessionIfNotExists(sessionId, metadata);

      res.status(200).json({
        success: true,
        session,
        message: 'Session created/updated successfully'
      });

    } catch (error) {
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
  static async logEvent(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      
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

      const event = await SessionService.logEvent(sessionId, eventType, payload);

      res.status(200).json({
        success: true,
        event,
        message: 'Event logged successfully'
      });

    } catch (error) {
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
  static async getUserBySession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        res.status(400).json({
          success: false,
          error: 'Session ID is required'
        });
        return;
      }

      const session = await SessionService.getUserBySession(sessionId);

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

    } catch (error) {
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
  static async getSessionEvents(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!sessionId) {
        res.status(400).json({
          success: false,
          error: 'Session ID is required'
        });
        return;
      }

      const events = await SessionService.getSessionEvents(sessionId, limit);

      res.status(200).json({
        success: true,
        events,
        message: 'Session events retrieved successfully'
      });

    } catch (error) {
      console.error('Error getting session events:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 