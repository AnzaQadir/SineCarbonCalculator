import { Request, Response } from 'express';
import { PersonalityService } from '../services/personalityService';

export class PersonalityController {
  private personalityService: PersonalityService;

  constructor() {
    this.personalityService = new PersonalityService();
  }

  public calculatePersonality = async (req: Request, res: Response) => {
    try {
      const responses = req.body;
      const result = await this.personalityService.calculatePersonality(responses);
      res.json(result);
    } catch (error) {
      console.error('Error calculating personality:', error);
      res.status(500).json({ error: 'Failed to calculate personality' });
    }
  };
} 