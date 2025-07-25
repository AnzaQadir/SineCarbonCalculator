import axios from 'axios';

console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface UserResponses {
  // Demographics
  name?: string;
  email?: string;
  age?: string;
  gender?: string;
  profession?: string;
  location?: string;
  country?: string;
  householdSize?: string;
  
  // Home Energy
  homeSize?: '1' | '2' | '3' | '4' | '5' | '6' | '7+' | '';
  homeEfficiency?: 'A' | 'B' | 'C' | '';
  energyManagement?: 'A' | 'B' | 'C' | '';
  electricityKwh?: string;
  naturalGasTherm?: string;
  heatingOilGallons?: string;
  propaneGallons?: string;
  usesRenewableEnergy?: boolean;
  hasEnergyEfficiencyUpgrades?: boolean;
  hasSmartThermostats?: boolean;
  hasEnergyStarAppliances?: boolean;
  
  // Transportation
  primaryTransportMode?: 'A' | 'B' | 'C' | 'D' | '';
  carProfile?: 'A' | 'B' | 'C' | 'D' | 'E' | '';
  weeklyKm?: string;
  costPerMile?: string;
  longDistanceTravel?: 'A' | 'B' | 'C' | '';
  
  // Food & Diet
  dietType?: 'VEGAN' | 'VEGETARIAN' | 'FLEXITARIAN' | 'MEAT_MODERATE' | 'MEAT_HEAVY';
  plateProfile?: 'A' | 'B' | 'C' | '';
  monthlyDiningOut?: 'A' | 'B' | 'C' | 'D' | '';
  plantBasedMealsPerWeek?: string;
  
  // Waste
  waste?: {
    prevention?: 'A' | 'B' | 'C' | 'D' | '';
    smartShopping?: 'A' | 'B' | 'C' | '';
    dailyWaste?: 'A' | 'B' | 'C' | 'D' | '';
    management?: 'A' | 'B' | 'C' | '';
    repairOrReplace?: 'A' | 'B' | 'C' | '';
  };

  // Air Quality
  airQuality?: {
    outdoorAirQuality?: 'A' | 'B' | 'C' | 'D' | 'E' | '';
    aqiMonitoring?: 'A' | 'B' | 'C' | 'D' | '';
    indoorAirQuality?: 'A' | 'B' | 'C' | 'D' | '';
    airQualityCommuting?: 'A' | 'B' | 'C' | 'D' | '';
    airQualityImpact?: 'A' | 'B' | 'C' | 'D' | '';
  };

  // Clothing
  clothing?: {
    wardrobeImpact?: 'A' | 'B' | 'C' | '';
    mindfulUpgrades?: 'A' | 'B' | 'C' | '';
    durability?: 'A' | 'B' | 'C' | '';
    consumptionFrequency?: 'A' | 'B' | 'C' | 'D' | '';
    brandLoyalty?: 'A' | 'B' | 'C' | 'D' | '';
  };

  // Personality Traits (NEW)
  personalityTraits?: {
    relationshipWithChange?: string;
    decisionMaking?: string;
    motivation?: string;
    ecoIdentity?: string;
    opennessToLearning?: string;
    socialInfluence?: string;
    emotionalConnection?: string;
    barriers?: string;
    goalSetting?: string;
    selfEfficacy?: string;
    [key: string]: string | undefined;
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
  personalityTraits?: {
    relationshipWithChange?: string;
    decisionMaking?: string;
    motivation?: string;
    ecoIdentity?: string;
    opennessToLearning?: string;
    socialInfluence?: string;
    emotionalConnection?: string;
    barriers?: string;
    goalSetting?: string;
    selfEfficacy?: string;
    [key: string]: string | undefined;
  };
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

// User signup interface
export interface SignupData {
  email: string;
  firstName?: string;
  age?: string;
  gender?: string;
  profession?: string;
  country?: string;
  city?: string;
  household?: string;
  ctaVariant?: 'A' | 'B';
}

export interface SignupResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    firstName?: string;
    age?: string;
    gender?: string;
    profession?: string;
    country?: string;
    city?: string;
    household?: string;
    waitlistPosition: number;
    ctaVariant: 'A' | 'B';
    createdAt: string;
    updatedAt: string;
  };
  waitlistPosition: number;
  message: string;
}

// User signup
export const signupUser = async (userData: SignupData): Promise<SignupResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;
  }
};

// Join community
export const joinCommunity = async (userId: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/join-community`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error joining community:', error);
    throw error;
  }
}; 