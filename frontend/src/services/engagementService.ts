import { API_BASE_URL } from './api';

export type Impact = {
  rupees: number;
  co2_kg: number;
};

export type RecommendationDetails = {
  id: string;
  category: string;
  title: string;
  subtitle?: string | null;
  metrics?: {
    pkrMonth?: number;
    minutes?: number;
    kgco2eMonth?: number;
  };
  effort?: {
    steps?: number;
    requiresPurchase?: boolean;
    avgMinutesToDo?: number;
  };
  tags?: string[];
  regions?: string[];
  why?: string | null;
  how?: string[];
  context_requirements?: string[];
  triggers?: Array<Record<string, any>>;
  utility_model?: Record<string, any>;
  fit_rules?: Array<Record<string, any>>;
  verify?: string[];
  rewards?: Record<string, any>;
  messages?: Record<string, any>;
  empathy_note?: string | null;
  cta?: Record<string, any> | null;
  story_snippet?: string | null;
  metadata?: Record<string, any> | null;
};

export type NextAction = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'best' | 'quick_win' | 'level_up';
  category: string;
  previewImpact: Impact & { label?: string };
  whyShown: string;
  source: string;
  learn?: {
    summary: string;
    url?: string;
  };
  recommendation?: RecommendationDetails;
};

export type NextActionsResponse = {
  primary: NextAction | null;
  alternatives: NextAction[];
};

export type ActionDoneResponse = {
  ok: true;
  verifiedImpact: Impact;
  streak: {
    current: number;
    longest: number;
  };
  bonus?: {
    awarded: boolean;
    xp?: number;
    label?: string;
  };
};

export type WeeklyRecap = {
  rupeesSaved: number;
  co2SavedKg: number;
  actionsCount: number;
  cityCommunity?: string;
  storyText: string;
  shareImage: {
    templateId: string;
    fields: Record<string, string | number>;
  };
};

export type BucketListItem = {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  previewImpact: {
    rupees: number;
    co2_kg: number;
  };
  status: 'done' | 'snoozed';
  addedAt: string;
  lastUpdatedAt: string;
  recommendation?: RecommendationDetails;
};

export type BucketListResponse = {
  items: BucketListItem[];
  total: number;
  doneCount: number;
  snoozedCount: number;
};

/**
 * Get next actions for the authenticated user
 */
export async function getNextActions(): Promise<NextActionsResponse> {
  const url = `${API_BASE_URL}/v1/engagement/next-actions`;
  
  console.log('[Engagement Service] Calling getNextActions:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[Engagement Service] getNextActions response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to get next actions: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // If not JSON, use the text
        if (errorText) errorMessage = errorText;
      }
      
      // Handle 401 Unauthorized - user not logged in
      if (response.status === 401) {
        console.warn('[Engagement Service] Unauthorized - user may not be logged in');
        // Return empty state instead of throwing
        return { primary: null, alternatives: [] };
      }
      
      // Don't throw for 404 or empty states - return null gracefully
      if (response.status === 404 || response.status === 204) {
        console.warn('[Engagement Service] No actions available (404/204)');
        return { primary: null, alternatives: [] };
      }
      
      // Only throw for actual server errors
      if (response.status >= 500) {
        throw new Error(errorMessage);
      }
      
      // For client errors, return empty state gracefully
      console.warn('[Engagement Service] Client error, returning empty state:', errorMessage);
      return { primary: null, alternatives: [] };
    }

    const result = await response.json();
    console.log('[Engagement Service] getNextActions success:', {
      hasPrimary: !!result.primary,
      alternativesCount: result.alternatives?.length || 0,
    });
    return result;
  } catch (error) {
    console.error('[Engagement Service] getNextActions failed:', error);
    // Return empty state on network errors too
    return { primary: null, alternatives: [] };
  }
}

/**
 * Record "intended" event (user clicked "Do it now" - micro-commitment)
 */
export async function recordIntendedAction(
  recommendationId: string,
  context?: { device?: string; time_of_day?: string; archetype?: string; location?: string }
): Promise<void> {
  const url = `${API_BASE_URL}/v1/engagement/action-done`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recommendationId,
        outcome: 'intended',
        context: context || { device: 'web' },
      }),
    });

    if (!response.ok) {
      console.warn('[Engagement Service] Failed to record intended action');
    }
  } catch (error) {
    console.error('[Engagement Service] recordIntendedAction failed:', error);
  }
}

/**
 * Mark an action with an outcome (done, snooze, dismiss)
 */
export async function markActionDone(
  recommendationId: string,
  outcome: 'done' | 'snooze' | 'dismiss' = 'done',
  reason?: string,
  context?: { surface?: string; variant?: string; time_of_day?: string; session_energy?: string }
): Promise<ActionDoneResponse> {
  const url = `${API_BASE_URL}/v1/engagement/action-done`;
  
  console.log('[Engagement Service] Calling markActionDone:', {
    url,
    recommendationId,
    outcome,
    reason,
    context,
  });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recommendationId,
        outcome,
        reason,
        context: context || { surface: 'web' },
      }),
    });

    console.log('[Engagement Service] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to mark action done: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        console.error('[Engagement Service] Authentication failed - user may not be logged in');
        errorMessage = 'Please log in to save your actions. Your session may have expired.';
      }
      
      console.error('[Engagement Service] API error:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('[Engagement Service] API success:', result);
    return result;
  } catch (error) {
    console.error('[Engagement Service] markActionDone failed:', error);
    throw error;
  }
}

/**
 * Get weekly recap
 */
export async function getWeeklyRecap(): Promise<WeeklyRecap> {
  const url = `${API_BASE_URL}/v1/engagement/weekly-recap`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Weekly recap is optional - don't throw errors, just return null
    if (response.status === 404 || response.status === 204) {
      console.log('[Engagement Service] No weekly recap available yet (expected for new users)');
      return null;
    }
    
    const errorText = await response.text();
    let errorMessage = `Failed to get weekly recap: ${response.status} ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    
    // For server errors, log but don't throw - weekly recap is optional
    if (response.status >= 500) {
      console.error('[Engagement Service] Server error getting weekly recap:', errorMessage);
    } else {
      console.warn('[Engagement Service] Client error getting weekly recap:', errorMessage);
    }
    
    // Return null instead of throwing - weekly recap is optional
    return null;
  }

  return response.json();
}

/**
 * Get home feed
 */
export async function getHomeFeed() {
  const url = `${API_BASE_URL}/v1/engagement/home-feed`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to get home feed: ${response.status} ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Get bucket list (all DONE and SNOOZE items)
 */
export async function getBucketList(): Promise<BucketListResponse> {
  const url = `${API_BASE_URL}/v1/engagement/bucket-list`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to get bucket list: ${response.status} ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

