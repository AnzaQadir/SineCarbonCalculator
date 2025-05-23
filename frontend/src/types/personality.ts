export interface PersonalityResponse {
  personality: string;
  description: string;
  strengths: string[];
  nextSteps: string[];
  categoryScores: {
    [key: string]: {
      score: number;
      weight: number;
      subScores: Record<string, number>;
      totalQuestions: number;
      percentage: number;
      maxPossibleScore: number;
    };
  };
  impactMetrics: {
    treesPlanted: number;
    carbonReduced: string;
    communityImpact: number;
  };
  finalScore: number;
  dominantCategory: string;
  emoji: string;
  badge: string;
  story: string;
  nextAction: string;
  powerMoves: string[];
}

export type PersonalityType =
  | 'Sustainability Slayer'
  | "Planet's Main Character"
  | 'Sustainability Soft Launch'
  | 'Kind of Conscious, Kind of Confused'
  | 'Eco in Progress'
  | 'Doing Nothing for the Planet'
  | 'Certified Climate Snoozer'; 