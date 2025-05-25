import { Request, Response } from 'express';
import { generateRecommendations } from '../services/recommendationService';
import { getStaticRecommendations } from '../services/staticRecommendationService';

export const generateRecommendationsHandler = async (req: Request, res: Response) => {
  try {
    const userProfile = req.body;
    const result = await generateRecommendations(userProfile);
    res.json(result);
  } catch (err) {
    console.error('Error generating recommendations:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

export const generateStaticRecommendationsHandler = (req: Request, res: Response) => {
  try {
    const userProfile = req.body;
    const result = getStaticRecommendations(userProfile);
    res.json(result);
  } catch (err) {
    console.error('Error generating static recommendations:', err);
    res.status(500).json({ error: 'Failed to generate static recommendations' });
  }
}; 