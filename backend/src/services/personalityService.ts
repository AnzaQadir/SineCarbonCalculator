import { EcoPersonalityType, EcoPersonalityTypes, personalityMappings, personalityHierarchy } from '../types/ecoPersonality';

interface UserResponses {
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
    consumptionFrequency?: 'A' | 'B' | 'C' | 'D';
    brandLoyalty?: 'A' | 'B' | 'C' | 'D';
  };
}

interface CategoryScore {
  score: number;
  weight: number;
  subScores: Record<string, number>;
  totalQuestions: number;
  percentage: number;
  maxPossibleScore: number;
}

interface PersonalityScore {
  type: string;
  score: number;
  confidence: number;
  traits: string[];
}

type CategoryKey = 'homeEnergy' | 'transport' | 'food' | 'waste' | 'clothing';

type CategoryWeights = {
  [K in CategoryKey]: number;
};

type PersonalityMappings = {
  [category: string]: {
    [metric: string]: {
      [value: string]: string[];
    };
  };
};

export class PersonalityService {
  private readonly CATEGORY_WEIGHTS: CategoryWeights = {
    homeEnergy: 0.2, // 20%
    transport: 0.2,  // 20%
    food: 0.2,       // 20%
    waste: 0.2,      // 20%
    clothing: 0.2    // 20%
  };

  private readonly QUESTION_OPTIONS = {
    A: 10,
    B: 6.66,
    C: 3.33,
    D: 0,
    E: 0
  };

  private readonly DIET_SCORES = {
    PLANT_BASED: 10,
    VEGETARIAN: 6.66,
    FLEXITARIAN: 3.33,
    MODERATE_MEAT: 0
  };

  private readonly FOOD_SOURCE_SCORES = {
    LOCAL_SEASONAL: 10,
    MIXED: 6.66,
    CONVENTIONAL: 3.33
  };

  private calculateQuestionScore(value: string, totalOptions: number): number {
    if (!value) return 0;

    // Handle special cases for diet and food source
    if (value in this.DIET_SCORES) {
      return this.DIET_SCORES[value as keyof typeof this.DIET_SCORES];
    }
    if (value in this.FOOD_SOURCE_SCORES) {
      return this.FOOD_SOURCE_SCORES[value as keyof typeof this.FOOD_SOURCE_SCORES];
    }

    // Handle standard A, B, C, D options
    const optionIndex = Object.keys(this.QUESTION_OPTIONS).indexOf(value);
    if (optionIndex === -1) return 0;

    return this.QUESTION_OPTIONS[value as keyof typeof this.QUESTION_OPTIONS];
  }

  private calculateCategoryScore(category: CategoryKey, responses: any): CategoryScore {
    const subScores: Record<string, number> = {};
    let totalScore = 0;
    const questions = Object.keys(responses).filter(key => responses[key] !== undefined);
    const totalQuestions = questions.length;

    // Calculate sub-scores for each metric in the category
    questions.forEach(metric => {
      const value = responses[metric];
      if (!value) return;

      const score = this.calculateQuestionScore(value, 4); // Assuming 4 options as default
      subScores[metric] = score;
      totalScore += score;
    });

    // Calculate maximum possible score (all A options)
    const maxPossibleScore = totalQuestions * 10; // Each question can score up to 10 points
    const percentage = (totalScore / maxPossibleScore) * 100;

    // Calculate weighted percentage for the category
    const weightedScore = percentage * this.CATEGORY_WEIGHTS[category];

    return {
      score: weightedScore,
      weight: this.CATEGORY_WEIGHTS[category],
      subScores,
      totalQuestions,
      percentage,
      maxPossibleScore
    };
  }

  private determinePersonalityType(finalScore: number): string {
    if (finalScore >= 85) return 'Sustainability Slayer';
    if (finalScore >= 70) return "Planet's Main Character";
    if (finalScore >= 55) return 'Sustainability Soft Launch';
    if (finalScore >= 40) return 'Kind of Conscious, Kind of Confused';
    if (finalScore >= 25) return 'Eco in Progress';
    if (finalScore >= 10) return 'Doing Nothing for the Planet';
    return 'Certified Climate Snoozer';
  }

  private calculatePersonalityScores(responses: UserResponses): PersonalityScore[] {
    const personalityScores: Record<string, PersonalityScore> = {};
    let finalScore = 0;
    
    // Initialize personality scores
    personalityHierarchy.forEach(type => {
      personalityScores[type] = {
        type,
        score: 0,
        confidence: 0,
        traits: []
      };
    });

    // Process each category's impact on personality types
    Object.entries(responses).forEach(([category, categoryResponses]) => {
      if (!categoryResponses) return;

      const categoryScore = this.calculateCategoryScore(category as CategoryKey, categoryResponses);
      finalScore += categoryScore.score;
      
      // Map category scores to personality traits
      const categoryMappings = (personalityMappings as PersonalityMappings)[category];
      if (categoryMappings) {
        Object.entries(categoryMappings).forEach(([metric, mappings]) => {
          const value = categoryResponses[metric];
          if (!value || !mappings[value]) return;

          mappings[value].forEach(personalityType => {
            const score = personalityScores[personalityType];
            if (score) {
              score.score += categoryScore.score;
              score.confidence += 1;
              score.traits.push(`${category}_${metric}`);
            }
          });
        });
      }
    });

    // Determine final personality type
    const personalityType = this.determinePersonalityType(finalScore);
    
    // Update scores based on final personality
    return Object.values(personalityScores)
      .map(score => ({
        ...score,
        score: score.type === personalityType ? finalScore : 0,
        confidence: score.confidence / Object.keys(responses).length
      }))
      .sort((a, b) => b.score - a.score);
  }

  private calculateImpactMetrics(responses: UserResponses) {
    const baseEmissions = 16;
    let totalScore = 0;
    let maxPossibleScore = 0;

    // Calculate actual and potential impact for each category
    Object.entries(responses).forEach(([category, categoryResponses]) => {
      if (!categoryResponses) return;

      const categoryScore = this.calculateCategoryScore(category as CategoryKey, categoryResponses);
      totalScore += categoryScore.score;
      maxPossibleScore += 20; // Each category can contribute up to 20%
    });

    const impactPercentage = (totalScore / maxPossibleScore) * 100;
    const carbonReduced = (impactPercentage / 100) * baseEmissions;
    const treesPlanted = Math.round(carbonReduced * 10);
    const communityImpact = Math.round(impactPercentage);

    return {
      treesPlanted,
      carbonReduced,
      communityImpact,
      potentialImpact: 100
    };
  }

  public calculatePersonality(responses: UserResponses) {
    // Calculate personality scores
    const personalityScores = this.calculatePersonalityScores(responses);
    const topPersonality = personalityScores[0];

    // Calculate category scores
    const categoryScores = Object.entries(responses).reduce((acc, [category, categoryResponses]) => {
      if (!categoryResponses) return acc;
      acc[category] = this.calculateCategoryScore(category as CategoryKey, categoryResponses);
      return acc;
    }, {} as Record<string, CategoryScore>);

    // Determine dominant category
    const dominantCategory = Object.entries(categoryScores)
      .reduce((a, b) => (a[1].score > b[1].score) ? a : b)[0];

    // Calculate impact metrics
    const impactMetrics = this.calculateImpactMetrics(responses);

    // Generate personality insights
    const insights = {
      strengths: topPersonality.traits.slice(0, 3),
      opportunities: Object.entries(categoryScores)
        .filter(([_, score]) => score.score < 40) // Below 40% is considered an opportunity
        .map(([category]) => category),
      confidence: Math.round(topPersonality.confidence * 100)
    };

    return {
      personality: topPersonality.type,
      dominantCategory,
      subCategory: this.calculateSubCategory(dominantCategory, categoryScores),
      tally: personalityScores.reduce((acc, score) => {
        acc[score.type] = Math.round(score.score);
        return acc;
      }, {} as Record<string, number>),
      categoryScores: Object.entries(categoryScores).reduce((acc, [category, score]) => {
        acc[category] = {
          score: Math.round(score.score),
          percentage: Math.round(score.percentage),
          maxPossibleScore: score.maxPossibleScore
        };
        return acc;
      }, {} as Record<string, { score: number; percentage: number; maxPossibleScore: number }>),
      impactMetrics,
      insights,
      ...EcoPersonalityTypes[topPersonality.type as keyof typeof EcoPersonalityTypes]
    };
  }

  private calculateSubCategory(dominantCategory: string, categoryScores: Record<string, CategoryScore>): string {
    const score = categoryScores[dominantCategory]?.score || 0;
    
    switch (dominantCategory) {
      case 'homeEnergy':
        return score >= 70 ? 'Energy Efficiency Expert' : 'Eco Homebody';
      case 'transport':
        return score >= 70 ? 'Green Mobility Champion' : 'Green Traveler';
      case 'food':
        return score >= 70 ? 'Sustainable Food Pioneer' : 'Conscious Consumer';
      case 'waste':
        return score >= 70 ? 'Zero Waste Champion' : 'Zero Waste Warrior';
      default:
        return 'Eco Explorer';
    }
  }
} 