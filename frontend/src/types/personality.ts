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
  | 'Steward';

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
  finalScore: number;
  powerMoves: string[];
  comprehensivePowerMoves?: ComprehensivePowerMoves;
  dominantCategory?: string;
  emoji?: string;
  badge?: string;
  story?: string;
  nextAction?: string;
  quizAnswers?: any; // Include quiz answers for recommendations
  newPersonality?: string; // New personality type from API
  newPersonalityDescription?: string; // New personality description from API
} 