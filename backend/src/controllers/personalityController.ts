import { Request, Response } from 'express';
import { PersonalityService } from '../services/personalityService';
import UserPersonalityService from '../services/userPersonalityService';
import { UserService } from '../services/userService';

export class PersonalityController {
  private personalityService: PersonalityService;
  private userPersonalityService: UserPersonalityService;

  constructor() {
    this.personalityService = new PersonalityService();
    this.userPersonalityService = new UserPersonalityService();
  }

  public calculatePersonality = async (req: Request, res: Response) => {
    const startTime = Date.now();
    
    try {
      const responses = req.body;
      let userId = req.body.userId || req.headers['x-user-id'] as string;
      const sessionId = req.headers['x-session-id'] as string;
      
      console.log(`[Personality] Starting personality calculation for user: ${userId || 'anonymous'}`);
      
      // If we have user data but no userId, try to find or create user
      if (!userId && responses.email) {
        try {
          // First try to find existing user by email
          let user = await UserService.getUserByEmail(responses.email);
          
          if (!user) {
            // Create new user if doesn't exist
            console.log(`[Personality] Creating new user for email: ${responses.email}`);
            user = await UserService.createUser({
              email: responses.email,
              firstName: responses.name,
              age: responses.age,
              gender: responses.gender,
              profession: responses.profession,
              country: responses.country,
              city: responses.location,
              household: responses.householdSize,
            }, sessionId);
            
            console.log(`[Personality] Created new user with ID: ${user.id}`);
          } else {
            console.log(`[Personality] Found existing user with ID: ${user.id}`);
          }
          
          userId = user.id;
        } catch (userError) {
          console.error('[Personality] Error handling user creation/fetching:', userError);
          // Continue without user ID if there's an error
        }
      }
      
      // Calculate personality
      const result = await this.personalityService.calculatePersonality(responses);
      
      const calculationTimeMs = Date.now() - startTime;
      
      console.log(`[Personality] Calculation completed in ${calculationTimeMs}ms for user: ${userId || 'anonymous'}`);
      
      // If we have a userId, save the personality response for logging
      if (userId) {
        try {
          await this.userPersonalityService.saveUserPersonality({
            userId,
            sessionId,
            catalogVersion: 'v1', // You can make this dynamic based on your catalog version
            response: result,
            metadata: {
              quizResponses: responses,
              calculationTimeMs,
              userAgent: req.get('User-Agent'),
              ipAddress: req.ip || req.connection?.remoteAddress,
            },
            request: req,
            calculationTimeMs,
            status: 'success',
          });
          
          console.log(`[Personality] Successfully logged personality calculation for user: ${userId}`);
        } catch (loggingError) {
          // Don't fail the main request if logging fails
          console.error('[Personality] Failed to log personality calculation:', loggingError);
        }
      }
      
      // Add calculation metadata to response
      const responseWithMetadata = {
        ...result,
        _metadata: {
          calculationTimeMs,
          logged: !!userId,
          timestamp: new Date().toISOString(),
          userId: userId || null,
        },
      };
      
      res.json(responseWithMetadata);
    } catch (error) {
      const calculationTimeMs = Date.now() - startTime;
      
      console.error(`[Personality] Error calculating personality after ${calculationTimeMs}ms:`, error);
      
      // Log failed calculation if we have a userId
      const userId = req.body.userId || req.headers['x-user-id'] as string;
      if (userId) {
        try {
          await this.userPersonalityService.saveUserPersonality({
            userId,
            sessionId: req.headers['x-session-id'] as string,
            catalogVersion: 'v1',
            response: {
              error: error instanceof Error ? error.message : 'Unknown error',
              status: 'failed',
            },
            metadata: {
              quizResponses: req.body,
              calculationTimeMs,
              error: error instanceof Error ? error.message : 'Unknown error',
              userAgent: req.get('User-Agent'),
              ipAddress: req.ip || req.connection?.remoteAddress,
            },
            request: req,
            calculationTimeMs,
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          });
          
          console.log(`[Personality] Logged failed personality calculation for user: ${userId}`);
        } catch (loggingError) {
          console.error('[Personality] Failed to log failed personality calculation:', loggingError);
        }
      }
      
      res.status(500).json({ 
        error: 'Failed to calculate personality',
        calculationTimeMs,
        timestamp: new Date().toISOString(),
      });
    }
  };
} 