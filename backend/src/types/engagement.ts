export type Impact = {
  rupees: number;
  co2_kg: number;
};

export type RecommendationDetails = {
  id: string;
  category: string;
  title: string;
  subtitle?: string | null;
  metrics: {
    pkrMonth?: number;
    minutes?: number;
    kgco2eMonth?: number;
  };
  effort: {
    steps?: number;
    requiresPurchase?: boolean;
    avgMinutesToDo?: number;
  };
  tags: string[];
  regions: string[];
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
  source: string; // "Source: … • Last updated: …"
  learn?: {
    summary: string;
    url?: string;
  };
  recommendation: RecommendationDetails;
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

