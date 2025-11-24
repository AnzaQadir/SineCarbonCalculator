import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { User } from '../models';
import { getNextActions, markActionDone } from '../services/engagementService';
import { getNextActionsEnhanced } from '../services/engagement/enhancedEngagementService';
import { markDoneAndLearn, recordIntendedAction, recordSnoozedAction, recordNotUsefulAction } from '../services/engagement/learning';
import type { NotUsefulReason, SnoozeTime } from '../services/engagement/eventTypes';
import { getBucketList } from '../services/engagement/bucketListService';
import { WeeklySummary, UserAction } from '../models';
import { Op } from 'sequelize';

/**
 * Get user ID from email (helper for authenticated requests)
 */
async function getUserIdFromEmail(email: string): Promise<string | null> {
  const user = await User.findOne({ where: { email } });
  return user?.id || null;
}

/**
 * GET /v1/engagement/next-actions
 * Returns 1 primary and 2 alternatives ranked via Rule Overlay
 */
export async function getNextActionsHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userEmail = req.userEmail;
    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = await getUserIdFromEmail(userEmail);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Feature flag: use enhanced scoring if available
    // For now, default to enhanced. Can be controlled via environment variable or config
    const useEnhanced = process.env.USE_ENHANCED_SCORING !== 'false';
    
    const result = useEnhanced
      ? await getNextActionsEnhanced(userId)
      : await getNextActions(userId);
    
    return res.json(result);
  } catch (error) {
    console.error('Error getting next actions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return res.status(500).json({
      success: false,
      message: 'Failed to get next actions',
      error: errorMessage,
    });
  }
}

/**
 * POST /v1/engagement/action-done
 * Marks a recommendation done idempotently (per day)
 */
export async function actionDoneHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userEmail = req.userEmail;
    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = await getUserIdFromEmail(userEmail);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { recommendationId, context, outcome, reason } = req.body;

    if (!recommendationId) {
      return res.status(400).json({
        success: false,
        message: 'recommendationId is required',
      });
    }

    // Validate outcome if provided
    const validOutcome = outcome && ['done', 'snooze', 'dismiss', 'intended'].includes(outcome) 
      ? outcome as 'done' | 'snooze' | 'dismiss' | 'intended'
      : 'done'; // Default to 'done' for backward compatibility

    // Handle "intended" event (user clicked "Do it now" - micro-commitment)
    if (validOutcome === 'intended') {
      await recordIntendedAction(userId, recommendationId, {
        device: context?.device || 'web',
        time_of_day: context?.time_of_day,
        archetype: context?.archetype,
        location: context?.location,
      });
      return res.json({
        ok: true,
        message: 'Intended action recorded',
      });
    }

    // Handle "snooze" with optional time context
    if (validOutcome === 'snooze') {
      const timeContext = reason as SnoozeTime | undefined;
      const result = await recordSnoozedAction(userId, recommendationId, timeContext, {
        time_of_day: context?.time_of_day,
        session_energy: context?.session_energy,
      });
      return res.json({
        ok: true,
        ...result,
      });
    }

    // Handle "not useful" with reason
    if (validOutcome === 'dismiss' && reason) {
      const notUsefulReason = reason as NotUsefulReason;
      const result = await recordNotUsefulAction(userId, recommendationId, notUsefulReason, context);
      return res.json({
        ok: true,
        ...result,
      });
    }

    // Support enhanced learning if outcome is provided or enabled
    const useEnhancedLearning = process.env.USE_ENHANCED_LEARNING !== 'false';
    
    const result = useEnhancedLearning
      ? await markDoneAndLearn(userId, recommendationId, validOutcome, context || {})
      : await markActionDone(userId, recommendationId, context || {});

    return res.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error('Error marking action done:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark action done',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /v1/engagement/home-feed
 * Returns a unified feed for "Your Week" sections
 */
/**
 * GET /v1/engagement/bucket-list
 * Returns all recommendations user has marked as DONE or SNOOZE
 */
export async function getBucketListHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userEmail = req.userEmail;
    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = await getUserIdFromEmail(userEmail);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const result = await getBucketList(userId);
    return res.json(result);
  } catch (error) {
    console.error('Error getting bucket list:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get bucket list',
    });
  }
}

export async function getHomeFeedHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userEmail = req.userEmail;
    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = await getUserIdFromEmail(userEmail);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get actions from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const actions = await UserAction.findAll({
      where: {
        userId,
        occurredAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      order: [['occurredAt', 'DESC']],
    });

    // Group by category/domain (simplified - in real app would map to recommendation domains)
    const feed = {
      quickWins: actions.filter((a) => Number(a.impactCo2Kg) <= 0.25).slice(0, 5),
      moneySavers: actions.filter((a) => Number(a.impactRupees) >= 200).slice(0, 5),
      habitBuilders: actions.slice(0, 10), // All actions can be habit builders
      commute: actions.filter((a) => a.metadata?.category === 'transport').slice(0, 5),
    };

    return res.json({
      success: true,
      feed,
    });
  } catch (error) {
    console.error('Error getting home feed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get home feed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /v1/engagement/weekly-recap
 * Returns recap numbers + share template fields
 */
export async function getWeeklyRecapHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userEmail = req.userEmail;
    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = await getUserIdFromEmail(userEmail);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user for city
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate last week (Monday to Sunday, Asia/Karachi timezone)
    const now = new Date();
    const lastMonday = new Date(now);
    lastMonday.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7) - 7); // Go back to last Monday
    lastMonday.setUTCHours(0, 0, 0, 0);
    lastMonday.setUTCHours(lastMonday.getUTCHours() - 5); // PKT timezone

    const lastSunday = new Date(lastMonday);
    lastSunday.setUTCDate(lastSunday.getUTCDate() + 6);
    lastSunday.setUTCHours(23, 59, 59, 999);

    // Get or compute weekly summary
    // Convert to date string for comparison (database stores as DATEONLY)
    const weekStartStr = lastMonday.toISOString().split('T')[0];
    let summary = await WeeklySummary.findOne({
      where: {
        userId,
        weekStart: weekStartStr,
      },
    });

    if (!summary) {
      // Compute from actions
      const actions = await UserAction.findAll({
        where: {
          userId,
          occurredAt: {
            [Op.gte]: lastMonday,
            [Op.lte]: lastSunday,
          },
        },
      });

      const rupeesSaved = actions.reduce((sum, a) => sum + Number(a.impactRupees), 0);
      const co2SavedKg = actions.reduce((sum, a) => sum + Number(a.impactCo2Kg), 0);

      // Use ISO date string for DATEONLY column to avoid driver inconsistencies
      summary = await WeeklySummary.create({
        userId,
        weekStart: weekStartStr as any, // DATEONLY accepts string format
        rupeesSaved,
        co2SavedKg,
        actionsCount: actions.length,
        cityText: user.city ? `${user.city} saved 17 tons CO₂` : null,
      });
    }

    const storyText = user.city
      ? `You → ${user.city} → Community`
      : 'You → Community';

    return res.json({
      rupeesSaved: Number(summary.rupeesSaved),
      co2SavedKg: Number(summary.co2SavedKg),
      actionsCount: summary.actionsCount,
      cityCommunity: summary.cityText || undefined,
      storyText,
      shareImage: {
        templateId: 'recap-v1',
        fields: {
          rupees: Number(summary.rupeesSaved),
          co2: Number(summary.co2SavedKg),
          city: user.city || 'Community',
        },
      },
    });
  } catch (error) {
    console.error('Error getting weekly recap:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get weekly recap',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}


