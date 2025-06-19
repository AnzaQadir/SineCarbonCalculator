import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export interface UserResponses {
  homeEnergy?: {
    efficiency?: 'A' | 'B' | 'C' | '';
    management?: 'A' | 'B' | 'C' | '';
    homeScale?: '1' | '2' | '3' | '4' | '5' | '6' | '7+';
  };
  transport?: {
    primary?: 'A' | 'B' | 'C' | 'D' | '';
    carProfile?: 'A' | 'B' | 'C' | 'D' | 'E' | '';
    longDistance?: 'A' | 'B' | 'C' | 'D' | 'E';
  };
  food?: {
    dietType?: 'PLANT_BASED' | 'VEGETARIAN' | 'FLEXITARIAN' | 'MODERATE_MEAT';
    foodSource?: 'LOCAL_SEASONAL' | 'MIXED' | 'CONVENTIONAL';
    diningStyle?: 'HOME_COOKED' | 'BALANCED' | 'FREQUENT_DINE_OUT';
    buysLocalFood?: boolean;
    followsSustainableDiet?: boolean;
    growsOwnFood?: boolean;
    compostsFood?: boolean;
    usesMealPlanning?: boolean;
    plantBasedMealsPerWeek?: number;
  };
  waste?: {
    prevention?: 'A' | 'B' | 'C' | 'D' | '';
    management?: 'A' | 'B' | 'C' | '';
    smartShopping?: 'A' | 'B' | 'C';
    dailyWaste?: 'A' | 'B' | 'C' | 'D';
    wastePrevention?: 'A' | 'B' | 'C' | 'D';
    repairOrReplace?: boolean;
  };
  airQuality?: {
    monitoring?: 'A' | 'B' | 'C' | 'D' | '';
    impact?: 'A' | 'B' | 'C' | 'D' | '';
  };
  clothing?: {
    wardrobeImpact?: 'A' | 'B' | 'C' | '';
    mindfulUpgrades?: 'A' | 'B' | 'C' | '';
    durability?: 'A' | 'B' | 'C' | '';
    consumptionFrequency?: 'A' | 'B' | 'C' | 'D';
    brandLoyalty?: 'A' | 'B' | 'C' | 'D';
  };
}

export interface PersonalityResponse {
  personalityType: string;
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
  powerMoves: string[];
}

export const calculatePersonality = async (responses: UserResponses): Promise<PersonalityResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/personality/calculate`, responses);
    return response.data;
  } catch (error) {
    console.error('Error calculating personality:', error);
    throw error;
  }
}; 