export type PersonalityType = 
  | 'Sustainability Slayer'
  | "Planet's Main Character"
  | 'Sustainability Soft Launch'
  | 'Kind of Conscious, Kind of Confused'
  | 'Eco in Progress'
  | 'Doing Nothing for the Planet'
  | 'Certified Climate Snoozer';

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
  dominantCategory?: string;
  emoji?: string;
  badge?: string;
  story?: string;
  nextAction?: string;
} 