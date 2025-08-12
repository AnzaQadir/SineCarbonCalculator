export type PersonalityType = 
  | 'Sustainability Slayer'
  | "Planet's Main Character"
  | 'Sustainability Soft Launch'
  | 'Kind of Conscious, Kind of Confused'
  | 'Eco in Progress'
  | 'Doing Nothing for the Planet'
  | 'Certified Climate Snoozer'
  // New archetypes from comprehensivePowerMoves
  | 'Strategist'
  | 'Trailblazer'
  | 'Coordinator'
  | 'Visionary'
  | 'Explorer'
  | 'Catalyst'
  | 'Builder'
  | 'Networker'
  | 'Steward'
  | 'The Seed';

export interface ComprehensivePowerMoves {
  personality: {
    archetype: string;
    decision: string;
    action: string;
    description: string;
    hookLine: string;
  };
  powerMoves: {
    powerHabit: string;
    powerMove: string;
    stretchCTA: string;
  };
  tone: string;
}

export interface Highlight {
  id: string;
  title: string;
  icon: string;
  category: string;
  summary: string;
  subtext: string;
  cta?: string;
}

export interface PersonalityInsights {
  decisionStyle: string;
  actionStyle: string;
  spark: string;
}

export interface Highlights {
  highlights: Highlight[];
  personalityInsights: PersonalityInsights;
}

export interface PersonalityResponse {
  personalityType: PersonalityType;
  description: string;
  strengths: string[];
  nextSteps: string[];
  categoryScores: Record<string, {
    score: number;
    percentage: number;
    maxPossible?: number;
    maxPossibleScore?: number;
  }>;
  impactMetrics: {
    carbonReduced?: string;
    treesPlanted?: number;
    communityImpact?: number;
  };
  // User identification
  userId?: string;
  userEmail?: string;
  // New Impact Metric and Equivalence system
  impactMetricAndEquivalence?: {
    emissionsKg: {
      home: number;
      transport: number;
      food: number;
      clothing: number;
      waste: number;
      total: number;
      perPerson: number;
    };
    equivalences: {
      impact: {
        home: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
        };
        transport: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
        };
        food: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
        };
        clothing: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
        };
        waste: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
        };
        total: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
        };
      };
      avoided: {
        home: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
          treeYears: number;
        };
        transport: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
          treeYears: number;
        };
        food: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
          treeYears: number;
        };
        clothing: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
          treeYears: number;
        };
        waste: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
          treeYears: number;
        };
        total: {
          km: number;
          tshirts: number;
          coffeeCups: number;
          burgers: number;
          flights: number;
          treeYears: number;
        };
      };
    };
  };
  finalScore: number;
  powerMoves: string[];
  comprehensivePowerMoves?: ComprehensivePowerMoves;
  highlights?: Highlights;
  dominantCategory?: string;
  emoji?: string;
  badge?: string;
  story?: string;
  nextAction?: string;
  quizAnswers?: any; // Include quiz answers for recommendations
  newPersonality?: string; // New personality type from API
  newPersonalityDescription?: string; // New personality description from API
} 