"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCatalogByDomainHandler = exports.getCatalogHandler = exports.generateStaticRecommendationsHandler = exports.generateRecommendationsHandler = void 0;
const personalityRecommendationService_1 = require("../services/personalityRecommendationService");
const recommendationCatalogService_1 = require("../services/recommendationCatalogService");
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
const getCatalogHandler = async (req, res) => {
    try {
        const persona = req.query.persona || undefined;
        const domain = req.query.domain || undefined;
        const maxItems = req.query.maxItems ? parseInt(req.query.maxItems, 10) : undefined;
        const cards = (0, recommendationCatalogService_1.queryCatalog)({ domain, persona, maxItems });
        return res.json({
            catalogVersion: 'v1.0',
            domains: ['transport', 'food', 'home', 'clothing', 'waste'],
            cards,
            meta: (0, recommendationCatalogService_1.getCatalogMeta)(),
        });
    }
    catch (error) {
        console.error('Error fetching catalog recommendations:', error);
        res.status(500).json({ error: 'Failed to fetch catalog recommendations' });
    }
};
exports.getCatalogHandler = getCatalogHandler;
const getCatalogByDomainHandler = async (req, res) => {
    try {
        const persona = req.query.persona || undefined;
        const domain = req.params.domain;
        const maxItems = req.query.maxItems ? parseInt(req.query.maxItems, 10) : undefined;
        const cards = (0, recommendationCatalogService_1.queryCatalog)({ domain, persona, maxItems });
        return res.json({
            catalogVersion: 'v1.0',
            domains: ['transport', 'food', 'home', 'clothing', 'waste'],
            cards,
            meta: (0, recommendationCatalogService_1.getCatalogMeta)(),
        });
    }
    catch (error) {
        console.error('Error fetching catalog recommendations by domain:', error);
        res.status(500).json({ error: 'Failed to fetch catalog recommendations by domain' });
    }
};
exports.getCatalogByDomainHandler = getCatalogByDomainHandler;
