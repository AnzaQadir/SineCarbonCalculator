"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStaticRecommendationsHandler = exports.generateRecommendationsHandler = void 0;
const personalityRecommendationService_1 = require("../services/personalityRecommendationService");
const generateRecommendationsHandler = async (req, res) => {
    try {
        const { personalityType, preferences } = req.body;
        if (!personalityType) {
            return res.status(400).json({ error: 'Personality type is required' });
        }
        // Get personalized recommendations
        const recommendations = personalityRecommendationService_1.PersonalityRecommendationService.getPersonalizedRecommendations(personalityType, preferences);
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
    }
    catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
};
exports.generateRecommendationsHandler = generateRecommendationsHandler;
const generateStaticRecommendationsHandler = async (req, res) => {
    try {
        const { personalityType } = req.body;
        if (!personalityType) {
            return res.status(400).json({ error: 'Personality type is required' });
        }
        // Get recommendations for the personality type
        const recommendations = personalityRecommendationService_1.PersonalityRecommendationService.getRecommendationsForPersonality(personalityType);
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
    }
    catch (error) {
        console.error('Error generating static recommendations:', error);
        res.status(500).json({ error: 'Failed to generate static recommendations' });
    }
};
exports.generateStaticRecommendationsHandler = generateStaticRecommendationsHandler;
