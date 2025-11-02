import { API_BASE_URL } from './api';
import { BestNextAction } from '@/components/engagement/BestNextActionCard';

const ENGAGEMENT_BASE = `${API_BASE_URL}/v1/engagement`;

export interface NextAction {
  id: string;
  title: string;
  category: string;
  type: 'best' | 'quick_win' | 'level_up';
  impact: {
    rupees: number;
    co2_kg: number;
    label?: string;
  };
  whyShown?: string;
}

export interface NextActionsResponse {
  primary: NextAction & { type: 'best' };
  alternatives: Array<NextAction & { type: 'quick_win' | 'level_up' }>;
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

export interface HomeFeed {
  week: {
    start: string;
    end: string;
  };
  bestNextAction: BestNextAction;
  sections: Array<{
    title: string;
    cards: Array<{
      id: string;
      title: string;
      domain: string;
      actFirst: boolean;
      learn: { summary: string };
    }>;
  }>;
}

/**
 * Get multiple next actions (primary + alternatives)
 */
export const getNextActions = async (): Promise<NextActionsResponse | null> => {
  try {
    const response = await fetch(`${ENGAGEMENT_BASE}/next-actions`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No actions available
      }
      throw new Error('Failed to fetch next actions');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching next actions:', error);
    return null;
  }
};

/**
 * Get the best next action for the user (legacy single action)
 */
export const getBestNextAction = async (): Promise<BestNextAction | null> => {
  try {
    const response = await fetch(`${ENGAGEMENT_BASE}/best-next-action`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No actions available
      }
      throw new Error('Failed to fetch best next action');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching best next action:', error);
    return null;
  }
};

/**
 * Record an action as done
 */
export const recordActionDone = async (
  recommendationId: string,
  context?: { surface?: string; variant?: string }
): Promise<ActionDoneResponse | null> => {
  try {
    const response = await fetch(`${ENGAGEMENT_BASE}/action-done`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recommendationId,
        context,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record action');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error recording action:', error);
    return null;
  }
};

/**
 * Get the home feed with sections
 */
export const getHomeFeed = async (): Promise<HomeFeed | null> => {
  try {
    const response = await fetch(`${ENGAGEMENT_BASE}/home-feed`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch home feed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching home feed:', error);
    return null;
  }
};

/**
 * Get weekly recap data
 */
export const getWeeklyRecap = async (): Promise<WeeklyRecap | null> => {
  try {
    const response = await fetch(`${ENGAGEMENT_BASE}/weekly-recap`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No recap available
      }
      throw new Error('Failed to fetch weekly recap');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weekly recap:', error);
    return null;
  }
};
