import { API_BASE_URL } from './api';

export type Impact = {
  rupees: number;
  co2_kg: number;
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
};

export type NextActionsResponse = {
  primary: NextAction;
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

/**
 * Get next actions for the authenticated user
 */
export async function getNextActions(): Promise<NextActionsResponse> {
  const url = `${API_BASE_URL}/v1/engagement/next-actions`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Mark an action as done
 */
export async function markActionDone(
  recommendationId: string,
  context?: { surface?: string; variant?: string }
): Promise<ActionDoneResponse> {
  const url = `${API_BASE_URL}/v1/engagement/action-done`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recommendationId,
      context: context || { surface: 'web' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to mark action done: ${response.status} ${response.statusText}`;
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
    const errorText = await response.text();
    let errorMessage = `Failed to get weekly recap: ${response.status} ${response.statusText}`;
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

