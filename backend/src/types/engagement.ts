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
  source: string; // "Source: … • Last updated: …"
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

export type EngagementRules = {
  version: string;
  priorities: Array<{
    ifPersonality?: string;
    default?: boolean;
    order: string[];
  }>;
  labels: {
    primary: string;
    quick_win: string;
    level_up: string;
    next_rupee_win?: string;
  };
  filters: {
    excludeIfDoneToday: boolean;
    excludeIfCategoryMuted: boolean;
  };
  rotation: {
    cadence: string;
    dayOfWeek: string;
  };
  thresholds: {
    quickWinMaxCo2: number;
    quickWinMaxRupees: number;
    levelUpMinCo2: number;
    levelUpMinRupees: number;
  };
  tone: {
    eco_guilt: string;
  };
};

