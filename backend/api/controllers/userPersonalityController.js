"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPersonalityController = void 0;
const userPersonalityService_1 = __importDefault(require("../services/userPersonalityService"));
class UserPersonalityController {
    constructor() {
        /**
         * Get user personalities with filtering and pagination
         */
        this.getUserPersonalities = async (req, res) => {
            try {
                const { userId, sessionId, personalityType, newPersonality, catalogVersion, startDate, endDate, limit = '10', offset = '0', } = req.query;
                // Parse and validate parameters
                const parsedLimit = Math.min(parseInt(limit) || 10, 100);
                const parsedOffset = parseInt(offset) || 0;
                const filters = {
                    userId: userId,
                    sessionId: sessionId,
                    personalityType: personalityType,
                    newPersonality: newPersonality,
                    catalogVersion: catalogVersion,
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                    limit: parsedLimit,
                    offset: parsedOffset,
                };
                const result = await this.userPersonalityService.getUserPersonalities(filters);
                console.log(`[UserPersonality] Retrieved ${result.data.length} personalities for filters:`, filters);
                res.json({
                    success: true,
                    data: result.data,
                    pagination: {
                        total: result.total,
                        limit: result.limit,
                        offset: result.offset,
                        hasMore: result.offset + result.limit < result.total,
                    },
                });
            }
            catch (error) {
                console.error('Error retrieving user personalities:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve user personalities',
                    details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
                });
            }
        };
        /**
         * Get latest personality for a user
         */
        this.getLatestPersonality = async (req, res) => {
            try {
                const { userId } = req.params;
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        error: 'User ID is required'
                    });
                }
                const personality = await this.userPersonalityService.getLatestPersonality(userId);
                if (!personality) {
                    return res.status(404).json({
                        success: false,
                        error: 'No personality found for this user'
                    });
                }
                console.log(`[UserPersonality] Retrieved latest personality for user ${userId}`);
                res.json({
                    success: true,
                    data: personality,
                });
            }
            catch (error) {
                console.error('Error retrieving latest personality:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve latest personality',
                    details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
                });
            }
        };
        /**
         * Get personality by ID
         */
        this.getPersonalityById = async (req, res) => {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({
                        success: false,
                        error: 'Personality ID is required'
                    });
                }
                const personality = await this.userPersonalityService.getPersonalityById(id);
                if (!personality) {
                    return res.status(404).json({
                        success: false,
                        error: 'Personality not found'
                    });
                }
                console.log(`[UserPersonality] Retrieved personality by ID: ${id}`);
                res.json({
                    success: true,
                    data: personality,
                });
            }
            catch (error) {
                console.error('Error retrieving personality by ID:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve personality',
                    details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
                });
            }
        };
        /**
         * Get personality statistics for analytics
         */
        this.getPersonalityStats = async (req, res) => {
            try {
                const { userId, startDate, endDate, } = req.query;
                const filters = {
                    userId: userId,
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                };
                const stats = await this.userPersonalityService.getPersonalityStats(filters);
                console.log(`[UserPersonality] Retrieved personality stats for filters:`, filters);
                res.json({
                    success: true,
                    data: stats,
                });
            }
            catch (error) {
                console.error('Error retrieving personality stats:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve personality statistics',
                    details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
                });
            }
        };
        /**
         * Cleanup old personality records
         */
        this.cleanupOldRecords = async (req, res) => {
            try {
                const { daysToKeep = '90' } = req.query;
                const parsedDaysToKeep = parseInt(daysToKeep) || 90;
                // Ensure minimum cleanup period
                if (parsedDaysToKeep < 30) {
                    return res.status(400).json({
                        success: false,
                        error: 'Minimum cleanup period is 30 days'
                    });
                }
                const deletedCount = await this.userPersonalityService.cleanupOldRecords(parsedDaysToKeep);
                console.log(`[UserPersonality] Cleanup completed: ${deletedCount} records deleted`);
                res.json({
                    success: true,
                    data: {
                        deletedCount,
                        daysToKeep: parsedDaysToKeep,
                        message: `Successfully deleted ${deletedCount} old personality records`,
                    },
                });
            }
            catch (error) {
                console.error('Error during cleanup:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to cleanup old records',
                    details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
                });
            }
        };
        this.userPersonalityService = new userPersonalityService_1.default();
    }
}
exports.UserPersonalityController = UserPersonalityController;
exports.default = UserPersonalityController;
