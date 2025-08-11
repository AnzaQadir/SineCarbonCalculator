import UserPersonality from '../models/UserPersonality';
import User from '../models/User';
import sequelize from '../db';
import { Request } from 'express';
import { Op } from 'sequelize';

export interface SaveUserPersonalityParams {
  userId: string;
  sessionId?: string;
  catalogVersion?: string;
  personalityType?: string;
  newPersonality?: string;
  response: Record<string, any>;
  metadata?: Record<string, any>;
  request?: Request;
  calculationTimeMs?: number;
  status?: 'success' | 'failed';
  errorMessage?: string;
}

export interface UserPersonalityFilters {
  userId?: string;
  sessionId?: string;
  personalityType?: string;
  newPersonality?: string;
  catalogVersion?: string;
  status?: 'success' | 'failed';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export class UserPersonalityService {
  /**
   * Save user personality calculation response with comprehensive logging
   */
  async saveUserPersonality(params: {
    userId?: string; // Keep for backward compatibility
    email?: string; // New parameter to fetch userId from users table
    sessionId?: string;
    catalogVersion?: string;
    personalityType?: string;
    newPersonality?: string;
    response: any;
    metadata?: any;
    request?: any;
    calculationTimeMs?: number;
    status?: string;
    errorMessage?: string;
  }): Promise<UserPersonality | null> {
    const { 
      userId: directUserId, // Rename to avoid confusion
      email, 
      sessionId, 
      catalogVersion, 
      personalityType, 
      newPersonality, 
      response, 
      metadata, 
      request, 
      calculationTimeMs, 
      status = 'success', 
      errorMessage 
    } = params;

    let userId: string | undefined;

    // Priority 1: If email is provided, fetch userId from users table
    if (email) {
      try {
        const user = await User.findOne({ 
          where: { 
            email: email 
          } 
        });
        
        if (user) {
          userId = user.id;
          console.log(`[UserPersonality] Found user with email '${email}', userId: ${userId}`);
        } else {
          console.warn(`[UserPersonality] User with email '${email}' not found, skipping database logging`);
          return null; // Don't log if user doesn't exist
        }
      } catch (error) {
        console.error(`[UserPersonality] Error fetching user with email '${email}':`, error);
        return null; // Don't log if fetch fails
      }
    }
    // Priority 2: If no email but direct userId provided, validate it exists
    else if (directUserId) {
      try {
        const user = await User.findByPk(directUserId);
        if (user) {
          userId = directUserId;
          console.log(`[UserPersonality] Validated direct userId: ${userId}`);
        } else {
          console.warn(`[UserPersonality] Direct userId '${directUserId}' not found in users table, skipping database logging`);
          return null; // Don't log if user doesn't exist
        }
      } catch (error) {
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
    const userPersonality = await UserPersonality.create({
      userId: userId!, // TypeScript assertion since we've validated userId exists
      sessionId,
      catalogVersion,
      personalityType: extractedPersonalityType,
      newPersonality: extractedNewPersonality,
      response,
      metadata,
      ipAddress,
      userAgent,
      calculationTimeMs,
      status: status as 'success' | 'failed', // Type assertion to match expected type
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
  async getUserPersonalities(filters: UserPersonalityFilters = {}): Promise<{
    data: UserPersonality[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const {
      userId,
      sessionId,
      personalityType,
      newPersonality,
      catalogVersion,
      status,
      startDate,
      endDate,
      limit = 10,
      offset = 0,
    } = filters;

    // Build where clause
    const whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (sessionId) whereClause.sessionId = sessionId;
    if (personalityType) whereClause.personalityType = personalityType;
    if (newPersonality) whereClause.newPersonality = newPersonality;
    if (catalogVersion) whereClause.catalogVersion = catalogVersion;
    if (status) whereClause.status = status;

    // Add date range filtering
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = startDate;
      if (endDate) whereClause.createdAt[Op.lte] = endDate;
    }

    // Get total count
    const total = await UserPersonality.count({ where: whereClause });

    // Get paginated results
    const data = await UserPersonality.findAll({
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
  async getLatestPersonality(userId: string): Promise<UserPersonality | null> {
    const personality = await UserPersonality.findOne({
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
  async getPersonalityById(id: string): Promise<UserPersonality | null> {
    const personality = await UserPersonality.findByPk(id);

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
  async getPersonalityStats(filters: Omit<UserPersonalityFilters, 'limit' | 'offset'> = {}) {
    const { userId, startDate, endDate } = filters;

    const whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = startDate;
      if (endDate) whereClause.createdAt[Op.lte] = endDate;
    }

    // Get personality type distribution
    const personalityTypeStats = await UserPersonality.findAll({
      where: whereClause,
      attributes: [
        'personalityType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['personalityType'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    });

    // Get new personality archetype distribution
    const newPersonalityStats = await UserPersonality.findAll({
      where: whereClause,
      attributes: [
        'newPersonality',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['newPersonality'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    });

    // Get catalog version distribution
    const catalogVersionStats = await UserPersonality.findAll({
      where: whereClause,
      attributes: [
        'catalogVersion',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['catalogVersion'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    });

    // Get status distribution
    const statusStats = await UserPersonality.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    });

    // Get average calculation time
    const avgCalculationTime = await UserPersonality.findOne({
      where: { ...whereClause, calculationTimeMs: { [Op.ne]: null } },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('calculationTimeMs')), 'avgCalculationTime'],
        [sequelize.fn('MIN', sequelize.col('calculationTimeMs')), 'minCalculationTime'],
        [sequelize.fn('MAX', sequelize.col('calculationTimeMs')), 'maxCalculationTime'],
      ],
    });

    const stats = {
      personalityTypeStats,
      newPersonalityStats,
      catalogVersionStats,
      statusStats,
      avgCalculationTime: Number((avgCalculationTime as any)?.avgCalculationTime) || 0,
      minCalculationTime: Number((avgCalculationTime as any)?.minCalculationTime) || 0,
      maxCalculationTime: Number((avgCalculationTime as any)?.maxCalculationTime) || 0,
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
  async cleanupOldRecords(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deletedCount = await UserPersonality.destroy({
      where: {
        createdAt: {
          [Op.lt]: cutoffDate,
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
  async getPerformanceMetrics(filters: Omit<UserPersonalityFilters, 'limit' | 'offset'> = {}) {
    const { userId, startDate, endDate } = filters;

    const whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = startDate;
      if (endDate) whereClause.createdAt[Op.lte] = endDate;
    }

    // Get performance metrics
    const metrics = await UserPersonality.findOne({
      where: { ...whereClause, calculationTimeMs: { [Op.ne]: null } },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalCalculations'],
        [sequelize.fn('AVG', sequelize.col('calculationTimeMs')), 'avgCalculationTime'],
        [sequelize.fn('MIN', sequelize.col('calculationTimeMs')), 'minCalculationTime'],
        [sequelize.fn('MAX', sequelize.col('calculationTimeMs')), 'maxCalculationTime'],
        [sequelize.fn('STDDEV', sequelize.col('calculationTimeMs')), 'stdDevCalculationTime'],
      ],
    });

    // Get slow calculations (>1 second)
    const slowCalculations = await UserPersonality.count({
      where: { ...whereClause, calculationTimeMs: { [Op.gt]: 1000 } },
    });

    // Get failed calculations
    const failedCalculations = await UserPersonality.count({
      where: { ...whereClause, status: 'failed' },
    });

    const totalCalculations = Number((metrics as any)?.totalCalculations) || 0;
    const performanceMetrics = {
      totalCalculations,
      avgCalculationTime: Number((metrics as any)?.avgCalculationTime) || 0,
      minCalculationTime: Number((metrics as any)?.minCalculationTime) || 0,
      maxCalculationTime: Number((metrics as any)?.maxCalculationTime) || 0,
      stdDevCalculationTime: Number((metrics as any)?.stdDevCalculationTime) || 0,
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

export default UserPersonalityService;
