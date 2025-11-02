import { queryCatalog, getCatalogMeta } from './recommendationCatalogService';
import UserAction from '../models/UserAction';
import UserStreak from '../models/UserStreak';
import WeeklySummary from '../models/WeeklySummary';
import { User } from '../models';
import engagementRules from '../config/engagementRules.json';
import { Card } from '../types/recommendationCatalog';

export interface BestNextAction {
  id: string;
  title: string;
  category: string;
  cta: string;
  previewImpact: {
    rupees: number;
    co2_kg: number;
    label?: string;
  };
  whyShown: string;
  source: string;
  learnMore?: {
    summary: string;
    url?: string;
  };
}

export interface NextActionsResponse {
  primary: {
    id: string;
    title: string;
    category: string;
    type: 'best';
    impact: {
      rupees: number;
      co2_kg: number;
      label?: string;
    };
    whyShown: string;
  };
  alternatives: Array<{
    id: string;
    title: string;
    category: string;
    type: 'quick_win' | 'level_up';
    impact: {
      rupees: number;
      co2_kg: number;
    };
    whyShown?: string;
  }>;
}

export interface ActionDoneResponse {
  ok: true;
  verifiedImpact: {
    rupees: number;
    co2_kg: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  bonus?: {
    awarded: boolean;
    xp?: number;
    label?: string;
  };
}

export interface WeeklyRecap {
  rupeesSaved: number;
  co2SavedKg: number;
  actionsCount: number;
  cityCommunity?: string;
  storyText: string;
  shareImage: {
    templateId: string;
    fields: Record<string, string | number>;
  };
}

export class EngagementService {
  // Get multiple next actions (primary + alternatives)
  static async getNextActions(userId: string): Promise<NextActionsResponse | null> {
    try {
      // Get user's personality
      const user = await User.findByPk(userId, {
        include: [
          {
            model: (await import('../models')).UserPersonality,
            as: 'personalities',
            limit: 1,
            order: [['createdAt', 'DESC']],
          },
        ],
      });

      if (!user) {
        return null;
      }

      const userWithPersonalities = user as any;
      const latestPersonality = userWithPersonalities.personalities?.[0];
      const personality = latestPersonality?.newPersonality || latestPersonality?.personalityType || 'default';

      // Get all catalog cards
      const allCards = queryCatalog({});

      // Filter out actions already done today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const doneToday = await UserAction.findAll({
        where: {
          userId,
          occurredAt: {
            [require('sequelize').Op.gte]: today,
          },
        },
      });

      const doneRecoIds = new Set(doneToday.map((a) => a.recommendationId));

      // Get priority order for this personality
      const priorityRule = engagementRules.priorities.find(
        (p) => p.ifPersonality === personality
      ) || engagementRules.priorities.find((p) => p.default === true);

      // Rank cards
      const scoredCards = allCards
        .filter((card) => !doneRecoIds.has(card.id))
        .map((card) => ({
          card,
          score: this.scoreCardForPersonality(card, priorityRule?.order || []),
        }))
        .sort((a, b) => b.score - a.score);

      if (scoredCards.length === 0) {
        return null;
      }

      // Get top 3 cards
      const top3 = scoredCards.slice(0, 3);
      const primaryCard = top3[0].card;
      const alternatives = top3.slice(1);

      const convertCard = (card: Card) => {
        const rupees = Math.round(card.estImpactKgPerYear * 20);
        const co2_kg = card.estImpactKgPerYear / 365;
        return {
          rupees,
          co2_kg: parseFloat(co2_kg.toFixed(3)),
        };
      };

      // Determine types for alternatives
      const quickWinThreshold = typeof engagementRules.quickWinsThreshold === 'number' 
        ? engagementRules.quickWinsThreshold 
        : (engagementRules.quickWinsThreshold?.rupees || 150);
      const levelUpThreshold = typeof engagementRules.levelUpThreshold === 'number'
        ? engagementRules.levelUpThreshold
        : (engagementRules.levelUpThreshold?.rupees || 500);

      return {
        primary: {
          id: primaryCard.id,
          title: primaryCard.action,
          category: primaryCard.domain,
          type: 'best' as const,
          impact: {
            ...convertCard(primaryCard),
            label: engagementRules.labels.next_rupee_win,
          },
          whyShown: `Personality: ${personality} • Priority match`,
        },
        alternatives: alternatives.map((item, idx) => {
          const card = item.card;
          const impact = convertCard(card);
          const type = impact.rupees < quickWinThreshold ? 'quick_win' : 'level_up';
          return {
            id: card.id,
            title: card.action,
            category: card.domain,
            type: type as 'quick_win' | 'level_up',
            impact,
            whyShown: type === 'quick_win' ? 'Quick & easy win' : 'Level up challenge',
          };
        }),
      };
    } catch (error) {
      console.error('Error getting next actions:', error);
      return null;
    }
  }

  // Get best next action for a user based on personality and rules
  static async getBestNextAction(userId: string): Promise<BestNextAction | null> {
    try {
      // Get user's personality
      const user = await User.findByPk(userId, {
        include: [
          {
            model: (await import('../models')).UserPersonality,
            as: 'personalities',
            limit: 1,
            order: [['createdAt', 'DESC']],
          },
        ],
      });

      if (!user) {
        return null;
      }

      const userWithPersonalities = user as any;
      const latestPersonality = userWithPersonalities.personalities?.[0];
      const personality = latestPersonality?.newPersonality || latestPersonality?.personalityType || 'default';

      // Get all catalog cards
      const allCards = queryCatalog({});

      // Filter out actions already done today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const doneToday = await UserAction.findAll({
        where: {
          userId,
          occurredAt: {
            [require('sequelize').Op.gte]: today,
          },
        },
      });

      const doneRecoIds = new Set(doneToday.map((a) => a.recommendationId));

      // Get priority order for this personality
      const priorityRule = engagementRules.priorities.find(
        (p) => p.ifPersonality === personality
      ) || engagementRules.priorities.find((p) => p.default === true);

      // Rank cards
      const scoredCards = allCards
        .filter((card) => !doneRecoIds.has(card.id))
        .map((card) => ({
          card,
          score: this.scoreCardForPersonality(card, priorityRule?.order || []),
        }))
        .sort((a, b) => b.score - a.score);

      if (scoredCards.length === 0) {
        return null;
      }

      const topCard = scoredCards[0].card;

      // Calculate preview impact
      const rupees = Math.round(topCard.estImpactKgPerYear * 20); // rough conversion
      const co2_kg = topCard.estImpactKgPerYear / 365; // daily estimate

      return {
        id: topCard.id,
        title: topCard.action,
        category: topCard.domain,
        cta: 'Mark Done',
        previewImpact: {
          rupees,
          co2_kg: parseFloat(co2_kg.toFixed(3)),
          label: engagementRules.labels.next_rupee_win,
        },
        whyShown: `Personality: ${personality} • Priority match`,
        source: `Source: WRAP 2023 • Last updated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        learnMore: {
          summary: topCard.why,
        },
      };
    } catch (error) {
      console.error('Error getting best next action:', error);
      return null;
    }
  }

  // Score a card based on personality priorities
  private static scoreCardForPersonality(card: Card, priorityOrder: string[]): number {
    let score = 0;
    
    // Check if card matches priority categories
    const categoryOrder = priorityOrder.findIndex((cat) => 
      card.domain.includes(cat) || 
      card.action.toLowerCase().includes(cat.toLowerCase())
    );
    
    if (categoryOrder >= 0) {
      score += (priorityOrder.length - categoryOrder) * 100;
    }
    
    // Boost by priority and impact
    score += card.priority * 10;
    score += Math.min(5, Math.round(card.estImpactKgPerYear / 100));
    
    return score;
  }

  // Record action done
  static async recordActionDone(
    userId: string,
    recommendationId: string,
    context?: { surface?: string; variant?: string }
  ): Promise<ActionDoneResponse> {
    try {
      // Get card to extract impact
      const allCards = queryCatalog({});
      const card = allCards.find((c) => c.id === recommendationId);
      
      if (!card) {
        throw new Error('Recommendation not found');
      }

      // Check if already done today (idempotent)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existing = await UserAction.findOne({
        where: {
          userId,
          recommendationId,
          occurredAt: {
            [require('sequelize').Op.gte]: today,
          },
        },
      });

      if (existing) {
        // Return existing response
        const streak = await this.getUserStreak(userId);
        return {
          ok: true,
          verifiedImpact: {
            rupees: parseFloat(existing.impactRupees.toString()),
            co2_kg: parseFloat(existing.impactCo2Kg.toString()),
          },
          streak,
        };
      }

      // Calculate impact
      const rupees = Math.round(card.estImpactKgPerYear * 20);
      const co2_kg = card.estImpactKgPerYear / 365;

      // Create action record
      await UserAction.create({
        userId,
        recommendationId,
        impactRupees: rupees,
        impactCo2Kg: co2_kg,
        source: 'catalog:v1',
      });

      // Update streak
      const streak = await this.updateUserStreak(userId);

      // Check for bonus (15% chance)
      let bonus;
      if (Math.random() < 0.15) {
        const hour = new Date().getHours();
        const timeBonus = hour >= 5 && hour < 10; // 5am-10am
        bonus = {
          awarded: true,
          xp: timeBonus ? 20 : 10,
          label: timeBonus ? 'Early Bird Bonus' : 'Bamboo Bonus',
        };
      }

      return {
        ok: true,
        verifiedImpact: {
          rupees,
          co2_kg: parseFloat(co2_kg.toFixed(3)),
        },
        streak,
        bonus,
      };
    } catch (error) {
      console.error('Error recording action:', error);
      throw error;
    }
  }

  // Get or create user streak
  private static async getUserStreak(userId: string): Promise<{ current: number; longest: number }> {
    const streak = await UserStreak.findByPk(userId);
    return {
      current: streak?.currentStreakDays || 0,
      longest: streak?.longestStreakDays || 0,
    };
  }

  // Update user streak
  private static async updateUserStreak(userId: string): Promise<{ current: number; longest: number }> {
    const today = new Date().toISOString().split('T')[0];
    let streak = await UserStreak.findByPk(userId);

    if (!streak) {
      streak = await UserStreak.create({
        userId,
        currentStreakDays: 1,
        longestStreakDays: 1,
        lastActionDate: today as any,
      });
      return {
        current: 1,
        longest: 1,
      };
    }

    const lastAction = streak.lastActionDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const lastActionStr = lastAction ? new Date(lastAction).toISOString().split('T')[0] : null;

    if (lastActionStr === yesterdayStr) {
      // Continuing streak
      streak.currentStreakDays += 1;
      streak.longestStreakDays = Math.max(streak.currentStreakDays, streak.longestStreakDays);
    } else if (lastActionStr !== today) {
      // Broken streak
      streak.currentStreakDays = 1;
    }

    streak.lastActionDate = today as any;
    await streak.save();

    return {
      current: streak.currentStreakDays,
      longest: streak.longestStreakDays,
    };
  }

  // Get weekly recap
  static async getWeeklyRecap(userId: string): Promise<WeeklyRecap | null> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return null;
      }

      // Calculate week start (Monday)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() + diff);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      // Get actions for this week
      const actions = await UserAction.findAll({
        where: {
          userId,
          occurredAt: {
            [require('sequelize').Op.between]: [weekStart, weekEnd],
          },
        },
      });

      const rupeesSaved = actions.reduce((sum, a) => sum + parseFloat(a.impactRupees.toString()), 0);
      const co2SavedKg = actions.reduce((sum, a) => sum + parseFloat(a.impactCo2Kg.toString()), 0);

      // Calculate city community stats
      const cityActions = await UserAction.findAll({
        where: {
          occurredAt: {
            [require('sequelize').Op.between]: [weekStart, weekEnd],
          },
        },
        include: [
          {
            model: User,
            as: 'user',
            where: user.city ? { city: user.city } : undefined,
            attributes: [],
          },
        ],
      });

      const cityCo2 = cityActions.reduce((sum, a) => sum + parseFloat(a.impactCo2Kg.toString()), 0);
      const cityText = user.city 
        ? `${user.city} saved ${(cityCo2 / 1000).toFixed(1)} tons CO₂`
        : undefined;

      return {
        rupeesSaved: parseFloat(rupeesSaved.toFixed(2)),
        co2SavedKg: parseFloat(co2SavedKg.toFixed(3)),
        actionsCount: actions.length,
        cityCommunity: cityText,
        storyText: `You → ${user.city || 'Your City'} → Community`,
        shareImage: {
          templateId: 'recap-v1',
          fields: {
            rupees: rupeesSaved,
            co2: co2SavedKg,
          },
        },
      };
    } catch (error) {
      console.error('Error getting weekly recap:', error);
      return null;
    }
  }
}
