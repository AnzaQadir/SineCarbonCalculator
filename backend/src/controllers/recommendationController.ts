import { Request, Response } from 'express';
import { PersonalityRecommendationService } from '../services/personalityRecommendationService';
import { PersonalityType } from '../types/personality';

interface RecommendationRequest {
  personalityType: PersonalityType;
  preferences?: {
    effortLevel?: 'low' | 'medium' | 'high';
    category?: string;
    lifestyle?: string;
  };
}

export const generateRecommendationsHandler = async (req: Request, res: Response) => {
  try {
    const { personalityType, preferences } = req.body as RecommendationRequest;

    if (!personalityType) {
      return res.status(400).json({ error: 'Personality type is required' });
    }

    // Get personalized recommendations
    const recommendations = PersonalityRecommendationService.getPersonalizedRecommendations(
      personalityType,
      preferences
    );

    // Group recommendations by week
    const weeklyRecommendations = {
      week1: {
        theme: "Getting Started",
        actions: recommendations.slice(0, 3)
      },
      week2: {
        theme: "Building Momentum",
        actions: recommendations.slice(3, 6)
      },
      week3: {
        theme: "Making an Impact",
        actions: recommendations.slice(6, 9)
      }
    };

    res.json(weeklyRecommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

export const generateStaticRecommendationsHandler = async (req: Request, res: Response) => {
  try {
    const { personalityType } = req.body as RecommendationRequest;

    if (!personalityType) {
      return res.status(400).json({ error: 'Personality type is required' });
    }

    // Get recommendations for the personality type
    const recommendations = PersonalityRecommendationService.getRecommendationsForPersonality(personalityType);

    // Group recommendations by week
    const weeklyRecommendations = {
      week1: {
        theme: "Getting Started",
        actions: recommendations.slice(0, 3)
      },
      week2: {
        theme: "Building Momentum",
        actions: recommendations.slice(3, 6)
      },
      week3: {
        theme: "Making an Impact",
        actions: recommendations.slice(6, 9)
      }
    };

    res.json(weeklyRecommendations);
  } catch (error) {
    console.error('Error generating static recommendations:', error);
    res.status(500).json({ error: 'Failed to generate static recommendations' });
  }
}; 