"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPersonalityService = void 0;
const UserPersonality_1 = __importDefault(require("../models/UserPersonality"));
const User_1 = __importDefault(require("../models/User"));
const db_1 = __importDefault(require("../db"));
const sequelize_1 = require("sequelize");
class UserPersonalityService {
    /**
     * Save user personality calculation response with comprehensive logging
     */
    async saveUserPersonality(params) {
        const { userId: directUserId, // Rename to avoid confusion
        email, sessionId, catalogVersion, personalityType, newPersonality, response, metadata, request, calculationTimeMs, status = 'success', errorMessage } = params;
        let userId;
        // Priority 1: If email is provided, fetch userId from users table
        if (email) {
            try {
                const user = await User_1.default.findOne({
                    where: {
                        email: email
                    }
                });
                if (user) {
                    userId = user.id;
                    console.log(`[UserPersonality] Found user with email '${email}', userId: ${userId}`);
                }
                else {
                    console.warn(`[UserPersonality] User with email '${email}' not found, skipping database logging`);
                    return null; // Don't log if user doesn't exist
                }
            }
            catch (error) {
                console.error(`[UserPersonality] Error fetching user with email '${email}':`, error);
                return null; // Don't log if fetch fails
            }
        }
        // Priority 2: If no email but direct userId provided, validate it exists
        else if (directUserId) {
            try {
                const user = await User_1.default.findByPk(directUserId);
                if (user) {
                    userId = directUserId;
                    console.log(`[UserPersonality] Validated direct userId: ${userId}`);
                }
                else {
                    console.warn(`[UserPersonality] Direct userId '${directUserId}' not found in users table, skipping database logging`);
                    return null; // Don't log if user doesn't exist
                }
            }
            catch (error) {
                console.error(`[UserPersonality] Error validating direct userId '${directUserId}':`, error);
                return null; // Don't log if validation fails
            }
        }
        // If no valid userId available, don't create record
        if (!userId) {
            console.log(`[UserPersonality] No valid userId available, skipping database logging`);
            return null;
        }
        // Extract additional logging information from request if available
        const ipAddress = request?.ip || request?.connection?.remoteAddress;
        const userAgent = request?.get?.('User-Agent');
        // Extract personality information from response
        const extractedPersonalityType = personalityType || response?.personalityType;
        const extractedNewPersonality = newPersonality ||
            response?.newPersonality ||
            response?.comprehensivePowerMoves?.personality?.archetype;
        // Create the record - now userId is guaranteed to be defined
        const userPersonality = await UserPersonality_1.default.create({
            userId: userId, // TypeScript assertion since we've validated userId exists
            sessionId,
            catalogVersion,
            personalityType: extractedPersonalityType,
            newPersonality: extractedNewPersonality,
            response,
            metadata,
            ipAddress,
            userAgent,
            calculationTimeMs,
            status: status, // Type assertion to match expected type
            errorMessage,
        });
        // Comprehensive logging
        console.log(`[UserPersonality] Saved personality calculation for user ${email || directUserId || 'anonymous'}:`, {
            timestamp: new Date().toISOString(),
            userId,
            personalityType: extractedPersonalityType,
            newPersonality: extractedNewPersonality,
            catalogVersion,
            calculationTimeMs,
            status,
            ipAddress,
            userAgent: userAgent ? userAgent.substring(0, 100) + '...' : undefined,
            sessionId,
            responseSize: JSON.stringify(response).length,
            hasMetadata: !!metadata,
        });
        return userPersonality;
    }
    /**
     * Get user personalities with filtering and pagination
     */
    async getUserPersonalities(filters = {}) {
        const { userId, sessionId, personalityType, newPersonality, catalogVersion, status, startDate, endDate, limit = 10, offset = 0, } = filters;
        // Build where clause
        const whereClause = {};
        if (userId)
            whereClause.userId = userId;
        if (sessionId)
            whereClause.sessionId = sessionId;
        if (personalityType)
            whereClause.personalityType = personalityType;
        if (newPersonality)
            whereClause.newPersonality = newPersonality;
        if (catalogVersion)
            whereClause.catalogVersion = catalogVersion;
        if (status)
            whereClause.status = status;
        // Add date range filtering
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate)
                whereClause.createdAt[sequelize_1.Op.gte] = startDate;
            if (endDate)
                whereClause.createdAt[sequelize_1.Op.lte] = endDate;
        }
        // Get total count
        const total = await UserPersonality_1.default.count({ where: whereClause });
        // Get paginated results
        const data = await UserPersonality_1.default.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        console.log(`[UserPersonality] Retrieved ${data.length} personalities for filters:`, {
            timestamp: new Date().toISOString(),
            filters,
            total,
            limit,
            offset,
        });
        return {
            data,
            total,
            limit,
            offset,
        };
    }
    /**
     * Get latest personality for a user
     */
    async getLatestPersonality(userId) {
        const personality = await UserPersonality_1.default.findOne({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
        console.log(`[UserPersonality] Retrieved latest personality for user ${userId}:`, {
            timestamp: new Date().toISOString(),
            found: !!personality,
            personalityType: personality?.personalityType,
            newPersonality: personality?.newPersonality,
            status: personality?.status,
            createdAt: personality?.createdAt,
        });
        return personality;
    }
    /**
     * Get personality by ID
     */
    async getPersonalityById(id) {
        const personality = await UserPersonality_1.default.findByPk(id);
        console.log(`[UserPersonality] Retrieved personality by ID ${id}:`, {
            timestamp: new Date().toISOString(),
            found: !!personality,
            userId: personality?.userId,
            status: personality?.status,
        });
        return personality;
    }
    /**
     * Get personality statistics for analytics
     */
    async getPersonalityStats(filters = {}) {
        const { userId, startDate, endDate } = filters;
        const whereClause = {};
        if (userId)
            whereClause.userId = userId;
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate)
                whereClause.createdAt[sequelize_1.Op.gte] = startDate;
            if (endDate)
                whereClause.createdAt[sequelize_1.Op.lte] = endDate;
        }
        // Get personality type distribution
        const personalityTypeStats = await UserPersonality_1.default.findAll({
            where: whereClause,
            attributes: [
                'personalityType',
                [db_1.default.fn('COUNT', db_1.default.col('id')), 'count'],
            ],
            group: ['personalityType'],
            order: [[db_1.default.fn('COUNT', db_1.default.col('id')), 'DESC']],
        });
        // Get new personality archetype distribution
        const newPersonalityStats = await UserPersonality_1.default.findAll({
            where: whereClause,
            attributes: [
                'newPersonality',
                [db_1.default.fn('COUNT', db_1.default.col('id')), 'count'],
            ],
            group: ['newPersonality'],
            order: [[db_1.default.fn('COUNT', db_1.default.col('id')), 'DESC']],
        });
        // Get catalog version distribution
        const catalogVersionStats = await UserPersonality_1.default.findAll({
            where: whereClause,
            attributes: [
                'catalogVersion',
                [db_1.default.fn('COUNT', db_1.default.col('id')), 'count'],
            ],
            group: ['catalogVersion'],
            order: [[db_1.default.fn('COUNT', db_1.default.col('id')), 'DESC']],
        });
        // Get status distribution
        const statusStats = await UserPersonality_1.default.findAll({
            where: whereClause,
            attributes: [
                'status',
                [db_1.default.fn('COUNT', db_1.default.col('id')), 'count'],
            ],
            group: ['status'],
            order: [[db_1.default.fn('COUNT', db_1.default.col('id')), 'DESC']],
        });
        // Get average calculation time
        const avgCalculationTime = await UserPersonality_1.default.findOne({
            where: { ...whereClause, calculationTimeMs: { [sequelize_1.Op.ne]: null } },
            attributes: [
                [db_1.default.fn('AVG', db_1.default.col('calculationTimeMs')), 'avgCalculationTime'],
                [db_1.default.fn('MIN', db_1.default.col('calculationTimeMs')), 'minCalculationTime'],
                [db_1.default.fn('MAX', db_1.default.col('calculationTimeMs')), 'maxCalculationTime'],
            ],
        });
        const stats = {
            personalityTypeStats,
            newPersonalityStats,
            catalogVersionStats,
            statusStats,
            avgCalculationTime: Number(avgCalculationTime?.avgCalculationTime) || 0,
            minCalculationTime: Number(avgCalculationTime?.minCalculationTime) || 0,
            maxCalculationTime: Number(avgCalculationTime?.maxCalculationTime) || 0,
        };
        console.log(`[UserPersonality] Retrieved personality stats:`, {
            timestamp: new Date().toISOString(),
            filters,
            statsSummary: {
                totalPersonalityTypes: personalityTypeStats.length,
                totalNewPersonalities: newPersonalityStats.length,
                totalCatalogVersions: catalogVersionStats.length,
                totalStatuses: statusStats.length,
                avgCalculationTime: stats.avgCalculationTime,
            },
        });
        return stats;
    }
    /**
     * Delete old personality records (cleanup)
     */
    async cleanupOldRecords(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const deletedCount = await UserPersonality_1.default.destroy({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: cutoffDate,
                },
            },
        });
        console.log(`[UserPersonality] Cleanup completed: ${deletedCount} records deleted`, {
            timestamp: new Date().toISOString(),
            daysToKeep,
            cutoffDate,
            deletedCount,
        });
        return deletedCount;
    }
    /**
     * Get calculation performance metrics
     */
    async getPerformanceMetrics(filters = {}) {
        const { userId, startDate, endDate } = filters;
        const whereClause = {};
        if (userId)
            whereClause.userId = userId;
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate)
                whereClause.createdAt[sequelize_1.Op.gte] = startDate;
            if (endDate)
                whereClause.createdAt[sequelize_1.Op.lte] = endDate;
        }
        // Get performance metrics
        const metrics = await UserPersonality_1.default.findOne({
            where: { ...whereClause, calculationTimeMs: { [sequelize_1.Op.ne]: null } },
            attributes: [
                [db_1.default.fn('COUNT', db_1.default.col('id')), 'totalCalculations'],
                [db_1.default.fn('AVG', db_1.default.col('calculationTimeMs')), 'avgCalculationTime'],
                [db_1.default.fn('MIN', db_1.default.col('calculationTimeMs')), 'minCalculationTime'],
                [db_1.default.fn('MAX', db_1.default.col('calculationTimeMs')), 'maxCalculationTime'],
                [db_1.default.fn('STDDEV', db_1.default.col('calculationTimeMs')), 'stdDevCalculationTime'],
            ],
        });
        // Get slow calculations (>1 second)
        const slowCalculations = await UserPersonality_1.default.count({
            where: { ...whereClause, calculationTimeMs: { [sequelize_1.Op.gt]: 1000 } },
        });
        // Get failed calculations
        const failedCalculations = await UserPersonality_1.default.count({
            where: { ...whereClause, status: 'failed' },
        });
        const totalCalculations = Number(metrics?.totalCalculations) || 0;
        const performanceMetrics = {
            totalCalculations,
            avgCalculationTime: Number(metrics?.avgCalculationTime) || 0,
            minCalculationTime: Number(metrics?.minCalculationTime) || 0,
            maxCalculationTime: Number(metrics?.maxCalculationTime) || 0,
            stdDevCalculationTime: Number(metrics?.stdDevCalculationTime) || 0,
            slowCalculations,
            failedCalculations,
            successRate: totalCalculations ? ((totalCalculations - failedCalculations) / totalCalculations) * 100 : 0,
        };
        console.log(`[UserPersonality] Retrieved performance metrics:`, {
            timestamp: new Date().toISOString(),
            filters,
            performanceMetrics,
        });
        return performanceMetrics;
    }
}
exports.UserPersonalityService = UserPersonalityService;
exports.default = UserPersonalityService;
