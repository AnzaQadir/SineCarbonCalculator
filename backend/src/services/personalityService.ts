import { EcoPersonalityTypes, EcoPersonalityType, personalityMappings, personalityHierarchy } from '../types/ecoPersonality';
import { PowerMovesService, PersonalizedPowerMovesResponse } from './powerMovesService';
import { HighlightsService, HighlightsResponse } from './highlightsService';
import { UserResponses } from '../types/userResponses';
import { ImpactMetricAndEquivalenceService } from './impactMetricAndEquivalenceService';
import { ImpactMetricAndEquivalenceResponse } from '../types/impactMetricAndEquivalence';

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

type CategoryKey = 'homeEnergy' | 'transport' | 'food' | 'waste' | 'clothing' | 'airQuality';

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

interface ImpactMetrics {
  treesPlanted: number;
  carbonReduced: string;
  communityImpact: number;
}

interface PersonalityResponse {
  personalityType: EcoPersonalityType;
  description: string;
  strengths: string[];
  nextSteps: string[];
  categoryScores: Record<string, CategoryScore>;
  impactMetrics: ImpactMetrics;
  impactMetricAndEquivalence?: ImpactMetricAndEquivalenceResponse;
  finalScore: number;
  powerMoves: string[];
  comprehensivePowerMoves?: PowerMovesResponse;
  personalizedPowerMoves?: PersonalizedPowerMovesResponse;
  highlights?: HighlightsResponse;
  newPersonality?: string;
  newPersonalityDescription?: string;
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

interface PowerMovesResponse {
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
  gender?: 'boy' | 'girl';
}

export class PersonalityService {
  private readonly impactMetricAndEquivalenceService = new ImpactMetricAndEquivalenceService();
  
  private readonly CATEGORY_WEIGHTS: CategoryWeights = {
    homeEnergy: 0.167, // 16.67%
    transport: 0.167,  // 16.67%
    food: 0.167,       // 16.67%
    waste: 0.167,      // 16.67%
    clothing: 0.167,   // 16.67%
    airQuality: 0.165  // 16.5% (to make total 100%)
  };

  private readonly QUESTION_OPTIONS = {
    A: 10,
    B: 6.66,
    C: 3.33,
    D: 0,
    E: 0
  };

  private readonly DIET_SCORES = {
    VEGAN: 10,
    VEGETARIAN: 8,
    FLEXITARIAN: 6,
    MEAT_MODERATE: 3,
    MEAT_HEAVY: 0
  };

  private readonly FOOD_SOURCE_SCORES = {
    A: 10, // Local & Seasonal
    B: 6.66, // Mixed Sources
    C: 3.33 // Mostly Imported
  };

  private readonly CARBON_VALUES = {
    transport: {
      primaryTransportMode: {
        A: 200, // Active transport
        B: 1000, // Public transit
        C: 2000, // Personal vehicle
        D: 3000 // Frequent flyer
      },
      carProfile: {
        A: 100, // Electric vehicle
        B: 500, // Hybrid vehicle
        C: 1000, // Standard vehicle
        D: 1500, // Large vehicle
        E: 2000 // Luxury vehicle
      },
      longDistanceTravel: {
        A: 300, // Rail and bus
        B: 500, // Balanced
        C: 1500 // Frequent flyer
      }
    },
    food: {
      dietType: {
        VEGAN: 1000,
        VEGETARIAN: 1500,
        FLEXITARIAN: 2500,
        MEAT_MODERATE: 3500,
        MEAT_HEAVY: 4500
      },
      plateProfile: {
        A: 100, // Local & Seasonal
        B: 250, // Mixed Sources
        C: 400 // Mostly Imported
      },
      monthlyDiningOut: {
        A: 100, // <1 a month
        B: 200, // 1-4 times a month
        C: 400, // 5-10 times a month
        D: 600 // >10 times a month
      }
    },
    clothing: {
      wardrobeImpact: {
        A: 300, // Minimal wardrobe
        B: 800, // Balanced collection
        C: 1500 // Extensive wardrobe
      },
      mindfulUpgrades: {
        A: 200, // Sustainable brands
        B: 500, // Mixed approach
        C: 1000 // Conventional shopping
      },
      durability: {
        A: 200, // Long-lasting items
        B: 500, // Mixed quality
        C: 1000 // Fast fashion
      },
      consumptionFrequency: {
        A: 200, // Infrequent shopper
        B: 600, // Seasonal shopper
        C: 1200, // Frequent shopper
        D: 2000 // Very frequent shopper
      },
      brandLoyalty: {
        A: 300, // Brand conscious
        B: 800, // Flexible shopper
        C: 1300, // Variety seeker
        D: 100 // Brand loyal
      }
    },
    homeEnergy: {
      homeSize: {
        '1': 800,
        '2': 1000,
        '3': 1300,
        '4': 1600,
        '5': 1900,
        '6': 2200,
        '7+': 2500
      },
      homeEfficiency: {
        A: 500, // Energy efficient
        B: 1000, // Mixed efficiency
        C: 1500 // Standard home
      },
      energyManagement: {
        A: 400, // Renewable energy
        B: 800, // Mixed sources
        C: 1200 // Traditional grid
      }
    },
    waste: {
      prevention: {
        A: 50, // Zero waste champion
        B: 200, // Consistent reuser
        C: 500, // Occasional reuser
        D: 1000 // Basic disposer
      },
      smartShopping: {
        A: 100, // Conscious consumer
        B: 400, // Balanced shopper
        C: 1000 // Convenience shopper
      },
      dailyWaste: {
        A: 100, // Minimal waste
        B: 300, // Moderate waste
        C: 600, // Regular waste
        D: 1000 // High waste
      },
      management: {
        A: 100, // Advanced management
        B: 300, // Basic management
        C: 600 // Limited management
      },
      repairOrReplace: {
        A: 100, // Always repair
        B: 300, // Sometimes repair
        C: 600 // Usually replace
      }
    },
    airQuality: {
      outdoorAirQuality: {
        A: 100, // Fresh and clean
        B: 200, // Generally clear
        C: 400, // Sometimes polluted
        D: 600, // Not sure
        E: 800 // Mostly polluted
      },
      aqiMonitoring: {
        A: 100, // Active monitoring
        B: 200, // Basic awareness
        C: 400, // No monitoring
        D: 600 // Never thought about it
      },
      indoorAirQuality: {
        A: 100, // Air purifiers & plants
        B: 300, // Natural ventilation
        C: 600, // Basic management
        D: 800 // Not considered
      },
      airQualityCommuting: {
        A: 100, // Air quality conscious
        B: 300, // Sometimes considerate
        C: 600, // Not considered
        D: 800 // Never thought about it
      },
      airQualityImpact: {
        A: 100, // Low impact
        B: 300, // Moderate impact
        C: 600, // High impact
        D: 800 // Very high impact
      }
    }
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
    const percentage = totalQuestions > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    // Apply category weight to the score
    const weightedScore = (percentage * this.CATEGORY_WEIGHTS[category]);

    // Debug log
    console.log(`Category ${category} calculation:`, {
      totalScore,
      maxPossibleScore,
      percentage,
      weightedScore,
      questions,
      subScores
    });

    return {
      score: weightedScore || 0, // Ensure we never return undefined
      weight: this.CATEGORY_WEIGHTS[category],
      subScores,
      totalQuestions,
      percentage,
      maxPossibleScore
    };
  }

  private calculatePersonalityScores(responses: UserResponses): {
    personalityType: EcoPersonalityType;
    categoryScores: Record<string, CategoryScore>;
    finalScore: number;
  } {
    // Group responses by category for scoring
    const categoryResponses = {
      homeEnergy: {
        homeSize: responses.homeSize,
        homeEfficiency: responses.homeEfficiency,
        energyManagement: responses.energyManagement
      },
      transport: {
        primaryTransportMode: responses.primaryTransportMode,
        carProfile: responses.carProfile,
        longDistanceTravel: responses.longDistanceTravel
      },
      food: {
        dietType: responses.dietType,
        plateProfile: responses.plateProfile,
        monthlyDiningOut: responses.monthlyDiningOut
      },
      waste: responses.waste || {},
      clothing: responses.clothing || {},
      airQuality: responses.airQuality || {}
    };

    // Calculate category scores
    const categoryScores = Object.entries(categoryResponses).reduce((acc, [category, categoryResponses]) => {
      if (!categoryResponses) return acc;
      acc[category] = this.calculateCategoryScore(category as CategoryKey, categoryResponses);
      return acc;
    }, {} as Record<string, CategoryScore>);

    // Calculate final score - sum up all category scores
    let finalScore = 0;
    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score && typeof score.score === 'number') {
        finalScore += score.score;
      }
    });

    // Keep numeric aggregates for compatibility, but personalityType is decided elsewhere now
    return {
      personalityType: 'Eco in Progress', // placeholder; not used by caller anymore
      categoryScores,
      finalScore
    };
  }


  /**
   * Determine eco personality by tallying mapping hits rather than numeric thresholds.
   * This eliminates the threshold-based mapping and uses explicit mappings per response.
   */
  private determinePersonalityFromMappings(responses: UserResponses): EcoPersonalityType {
    // Initialize tally with known personalities only
    const tally: Record<string, number> = {};
    personalityHierarchy.forEach((p) => {
      tally[p] = 0;
    });

    const addVotes = (personalityKeys?: string[]) => {
      if (!personalityKeys || !Array.isArray(personalityKeys)) return;
      for (const key of personalityKeys) {
        if (key in tally) {
          tally[key] = (tally[key] ?? 0) + 1;
        }
      }
    };

    // Home Energy
    if (responses.homeEfficiency) {
      addVotes(personalityMappings?.homeEnergy?.efficiency?.[responses.homeEfficiency]);
    }
    if (responses.energyManagement) {
      addVotes(personalityMappings?.homeEnergy?.management?.[responses.energyManagement]);
    }

    // Transport
    if (responses.primaryTransportMode) {
      addVotes(personalityMappings?.transport?.primary?.[responses.primaryTransportMode]);
    }
    if (responses.carProfile) {
      addVotes(personalityMappings?.transport?.carProfile?.[responses.carProfile]);
    }
    if (responses.longDistanceTravel) {
      // Optional mapping, add if defined
      addVotes((personalityMappings as any)?.transport?.longDistanceTravel?.[responses.longDistanceTravel as any]);
    }

    // Food & Diet
    if (responses.dietType) {
      addVotes(personalityMappings?.food?.dietType?.[responses.dietType]);
    }
    if (responses.plateProfile) {
      addVotes(personalityMappings?.food?.plateProfile?.[responses.plateProfile]);
    }
    if (responses.monthlyDiningOut) {
      addVotes(personalityMappings?.food?.monthlyDiningOut?.[responses.monthlyDiningOut]);
    }

    // Waste
    if (responses.waste) {
      const w = responses.waste;
      if (w.prevention) addVotes(personalityMappings?.waste?.prevention?.[w.prevention]);
      if (w.management) addVotes(personalityMappings?.waste?.management?.[w.management]);
      if (w.repairOrReplace) addVotes(personalityMappings?.waste?.repairOrReplace?.[w.repairOrReplace]);
      // Note: smartShopping and dailyWaste are not defined in backend mappings; intentionally omitted
    }

    // Air Quality (optional keys)
    if (responses.airQuality) {
      const a = responses.airQuality;
      if (a.aqiMonitoring) addVotes((personalityMappings as any)?.airQuality?.monitoring?.[a.aqiMonitoring as any]);
      if (a.airQualityImpact) addVotes((personalityMappings as any)?.airQuality?.impact?.[a.airQualityImpact as any]);
      if (a.outdoorAirQuality) addVotes((personalityMappings as any)?.airQuality?.outdoorAirQuality?.[a.outdoorAirQuality as any]);
      if (a.indoorAirQuality) addVotes((personalityMappings as any)?.airQuality?.indoorAirQuality?.[a.indoorAirQuality as any]);
      if (a.airQualityCommuting) addVotes((personalityMappings as any)?.airQuality?.airQualityCommuting?.[a.airQualityCommuting as any]);
    }

    // Clothing
    if (responses.clothing) {
      const c = responses.clothing;
      if (c.wardrobeImpact) addVotes((personalityMappings as any)?.clothing?.wardrobeImpact?.[c.wardrobeImpact as any]);
      if (c.mindfulUpgrades) addVotes((personalityMappings as any)?.clothing?.mindfulUpgrades?.[c.mindfulUpgrades as any]);
      if (c.durability) addVotes((personalityMappings as any)?.clothing?.durability?.[c.durability as any]);
      if (c.consumptionFrequency) addVotes((personalityMappings as any)?.clothing?.consumptionFrequency?.[c.consumptionFrequency as any]);
      if (c.brandLoyalty) addVotes((personalityMappings as any)?.clothing?.brandLoyalty?.[c.brandLoyalty as any]);
    }

    // Select top personality by max votes; break ties by hierarchy order.
    let maxCount = 0;
    const top: string[] = [];
    for (const key of personalityHierarchy) {
      const count = tally[key] ?? 0;
      if (count > maxCount) {
        maxCount = count;
        top.length = 0;
        top.push(key);
      } else if (count === maxCount) {
        top.push(key);
      }
    }

    // If all zeros, default to a reasonable middle-ground personality.
    if (maxCount === 0) return 'Eco in Progress';

    // Tie-break deterministically by hierarchy order (earliest wins)
    return top[0] as EcoPersonalityType;
  }

  private calculateCarbonEmissions(responses: UserResponses): number {
    let totalEmissions = 0;

    // Transport emissions
    if (responses.primaryTransportMode) {
      totalEmissions += this.CARBON_VALUES.transport.primaryTransportMode[responses.primaryTransportMode] || 0;
    }
    if (responses.carProfile) {
      totalEmissions += this.CARBON_VALUES.transport.carProfile[responses.carProfile] || 0;
    }
    if (responses.longDistanceTravel) {
      totalEmissions += this.CARBON_VALUES.transport.longDistanceTravel[responses.longDistanceTravel] || 0;
    }

    // Food emissions
    if (responses.dietType) {
      totalEmissions += this.CARBON_VALUES.food.dietType[responses.dietType] || 0;
    }
    if (responses.plateProfile) {
      totalEmissions += this.CARBON_VALUES.food.plateProfile[responses.plateProfile] || 0;
    }
    if (responses.monthlyDiningOut) {
      totalEmissions += this.CARBON_VALUES.food.monthlyDiningOut[responses.monthlyDiningOut] || 0;
    }

    // Clothing emissions
    if (responses.clothing) {
      if (responses.clothing.wardrobeImpact) {
        totalEmissions += this.CARBON_VALUES.clothing.wardrobeImpact[responses.clothing.wardrobeImpact] || 0;
      }
      if (responses.clothing.mindfulUpgrades) {
        totalEmissions += this.CARBON_VALUES.clothing.mindfulUpgrades[responses.clothing.mindfulUpgrades] || 0;
      }
      if (responses.clothing.durability) {
        totalEmissions += this.CARBON_VALUES.clothing.durability[responses.clothing.durability] || 0;
      }
      if (responses.clothing.consumptionFrequency) {
        totalEmissions += this.CARBON_VALUES.clothing.consumptionFrequency[responses.clothing.consumptionFrequency] || 0;
      }
      if (responses.clothing.brandLoyalty) {
        totalEmissions += this.CARBON_VALUES.clothing.brandLoyalty[responses.clothing.brandLoyalty] || 0;
      }
    }

    // Home emissions
    if (responses.homeSize) {
      totalEmissions += this.CARBON_VALUES.homeEnergy.homeSize[responses.homeSize] || 0;
    }
    if (responses.homeEfficiency) {
      totalEmissions += this.CARBON_VALUES.homeEnergy.homeEfficiency[responses.homeEfficiency] || 0;
    }
    if (responses.energyManagement) {
      totalEmissions += this.CARBON_VALUES.homeEnergy.energyManagement[responses.energyManagement] || 0;
    }

    // Waste emissions
    if (responses.waste) {
      if (responses.waste.smartShopping) {
        totalEmissions += this.CARBON_VALUES.waste.smartShopping[responses.waste.smartShopping] || 0;
      }
      if (responses.waste.management) {
        totalEmissions += this.CARBON_VALUES.waste.management[responses.waste.management] || 0;
      }
      if (responses.waste.prevention) {
        totalEmissions += this.CARBON_VALUES.waste.prevention[responses.waste.prevention] || 0;
      }
      if (responses.waste.repairOrReplace) {
        totalEmissions += this.CARBON_VALUES.waste.repairOrReplace[responses.waste.repairOrReplace] || 0;
      }
    }

    // Air Quality emissions
    if (responses.airQuality) {
      if (responses.airQuality.outdoorAirQuality) {
        totalEmissions += this.CARBON_VALUES.airQuality.outdoorAirQuality[responses.airQuality.outdoorAirQuality] || 0;
      }
      if (responses.airQuality.aqiMonitoring) {
        totalEmissions += this.CARBON_VALUES.airQuality.aqiMonitoring[responses.airQuality.aqiMonitoring] || 0;
      }
      if (responses.airQuality.indoorAirQuality) {
        totalEmissions += this.CARBON_VALUES.airQuality.indoorAirQuality[responses.airQuality.indoorAirQuality] || 0;
      }
      if (responses.airQuality.airQualityCommuting) {
        totalEmissions += this.CARBON_VALUES.airQuality.airQualityCommuting[responses.airQuality.airQualityCommuting] || 0;
      }
      if (responses.airQuality.airQualityImpact) {
        totalEmissions += this.CARBON_VALUES.airQuality.airQualityImpact[responses.airQuality.airQualityImpact] || 0;
      }
    }

    return totalEmissions;
  }

  private calculateImpactMetrics(responses: UserResponses) {
    const totalEmissions = this.calculateCarbonEmissions(responses);
    const baseEmissions = 16000; // Base emissions to compare against
    const carbonReduced = Math.max(0, baseEmissions - totalEmissions);
    const treesPlanted = Math.round(carbonReduced / 100); // 1 tree absorbs ~100 kg CO2 per year

    return {
      treesPlanted,
      carbonReduced: carbonReduced.toFixed(1),
      communityImpact: Math.round((carbonReduced / baseEmissions) * 100)
    };
  }

  private generateImpactHighlights(impactMetrics: any, dominantCategory: string, categoryScores: Record<string, CategoryScore>): string {
    const topCategoryScore = categoryScores[dominantCategory]?.percentage || 0;
    return `You saved **${impactMetrics.carbonReduced} tons of CO₂** — equal to planting **${impactMetrics.treesPlanted} trees** 🌳.\n**Top Category:** ${dominantCategory} (${topCategoryScore}%) — your habits here made a real dent.`;
  }

  private generateStoryHighlights(personality: string, dominantCategory: string, opportunities: string[]): string {
    const templates = {
      "Sustainability Slayer": `You are a **Sustainability Slayer** — consistent, impactful, and quietly leading the change.\nYou scored highest in ${dominantCategory}, but there's still untapped potential in ${opportunities[0]} and ${opportunities[1]}.\nYour eco-journey is one of mastery in motion.`,
      "Planet's Main Character": `You are the **Planet's Main Character** — bold, intentional, and always the one to start the movement.\nYou led in ${dominantCategory}, but the plot thickens in ${opportunities[0]}.\nReady for your next starring role?`,
      "Sustainability Soft Launch": `You are a **Sustainability Soft Launch** — curious, open, and starting strong.\nYou've grown roots in ${dominantCategory}, now branch into ${opportunities[0]}.\nSustainability looks good on you.`,
      "Kind of Conscious, Kind of Confused": `You are **Kind of Conscious...** — a work in progress, with moments of brilliance.\nYou did well in ${dominantCategory}, and your next win lies in ${opportunities[0]}.\nNo pressure. Just progress.`,
      "Eco in Progress": `You are an **Eco in Progress** — gentle but intentional.\nYour care shows in ${dominantCategory}, but ${opportunities[0]} and ${opportunities[1]} are areas to grow into.\nKeep blooming.`,
      "Doing Nothing for the Planet": `You've gone from 'Doing Nothing' to **Showing Up**.\nEvery action counts. Start with ${opportunities[0]}, and let your impact grow.\nThis is your Eco Reset.`,
      "Certified Climate Snoozer": `You were a **Climate Snoozer** — but not anymore.\nYou've woken up to the impact of your actions.\nStart with ${opportunities[0]}, and the world will feel the shift.`
    };
    return templates[personality as keyof typeof templates] || templates["Eco in Progress"];
  }

  private analyzeBehavioralPatterns(responses: UserResponses): {
    goodHabits: string[];
    stretchAreas: string[];
    habitTags: Record<string, boolean>;
  } {
    const habitTags: Record<string, boolean> = {};
    const goodHabits: string[] = [];
    const stretchAreas: string[] = [];

    // Transport Analysis
    if (responses.primaryTransportMode === 'A') {
      habitTags.lowCarbonTransport = true;
      goodHabits.push('lowCarbonTransport');
    } else if (responses.primaryTransportMode === 'D') {
      stretchAreas.push('transport');
    }

    if (responses.carProfile === 'A' || responses.carProfile === 'B') {
      habitTags.efficientVehicle = true;
      goodHabits.push('efficientVehicle');
    }

    // Clothing Analysis
    if (responses.clothing?.wardrobeImpact === 'A') {
      habitTags.ethicalFashion = true;
      goodHabits.push('ethicalFashion');
    } else if (responses.clothing?.consumptionFrequency === 'D') {
      stretchAreas.push('clothing');
    }

    // Waste Analysis
    if (responses.waste?.repairOrReplace === 'A') {
      habitTags.circularMindset = true;
      goodHabits.push('circularMindset');
    }

    if (responses.waste?.prevention === 'A' || responses.waste?.prevention === 'B') {
      habitTags.wasteAware = true;
      goodHabits.push('wasteAware');
    } else if (responses.waste?.prevention === 'D') {
      stretchAreas.push('waste');
    }

    // Air Quality Analysis
    if (responses.airQuality?.aqiMonitoring === 'A' || responses.airQuality?.aqiMonitoring === 'B') {
      habitTags.airAware = true;
      goodHabits.push('airAware');
    }

    // Energy Analysis
    if (responses.homeEfficiency === 'A') {
      habitTags.energyEfficient = true;
      goodHabits.push('energyEfficient');
    } else if (responses.energyManagement === 'C') {
      stretchAreas.push('energy');
    }

    // Diet Analysis
    if (responses.dietType === 'VEGAN' || responses.dietType === 'VEGETARIAN') {
      habitTags.plantBasedDiet = true;
      goodHabits.push('plantBasedDiet');
    } else if (responses.dietType === 'MEAT_HEAVY') {
      stretchAreas.push('diet');
    }

    return { goodHabits, stretchAreas, habitTags };
  }

  private determinePersonalityArchetype(personalityTraits: any): {
    archetype: string;
    decision: string;
    action: string;
    description: string;
    hookLine: string;
  } {
    // Extend with a 4th option: neutral/indecisive
    const decisionCategories = ['analyst', 'intuitive', 'connector', 'neutral', 'indecisive'] as const;
    const actionCategories = ['planner', 'experimenter', 'collaborator', 'neutral', 'indecisive'] as const;

    const decisionCounts: Record<string, number> = { analyst: 0, intuitive: 0, connector: 0, neutral: 0, indecisive: 0 };
    const actionCounts: Record<string, number> = { planner: 0, experimenter: 0, collaborator: 0, neutral: 0, indecisive: 0 };

    Object.entries(personalityTraits).forEach(([key, value]) => {
      // Map personality traits to decision and action categories
      const val = value as string;
      const isDecisionKey = ['relationshipWithChange', 'decisionMaking', 'motivation', 'ecoIdentity', 'opennessToLearning'].includes(key) || key.startsWith('decisionMaking');
      const isActionKey = ['socialInfluence', 'emotionalConnection', 'barriers', 'goalSetting', 'selfEfficacy'].includes(key) || key.startsWith('actionTaking');

      if (isDecisionKey && decisionCategories.includes(val as any)) {
        decisionCounts[val as keyof typeof decisionCounts] += 1;
      }
      if (isActionKey && actionCategories.includes(val as any)) {
        actionCounts[val as keyof typeof actionCounts] += 1;
      }
    });

    // Helper to pick dominant or deterministic fallback
    const pickDominant = (counts: Record<string, number>, cats: readonly string[]): string => {
      const max = Math.max(...cats.map(c => counts[c]));
      if (max === 0) {
        // All neutral – pick first category deterministically
        return cats[0];
      }
      const winners = cats.filter(c => counts[c] === max);
      winners.sort();
      return winners[0];
    };

    const decisionStyle = pickDominant(decisionCounts, decisionCategories);
    const actionStyle = pickDominant(actionCounts, actionCategories);

    // Seed condition: if dominant decision OR action is neutral/indecisive
    if (['neutral', 'indecisive'].includes(decisionStyle) || ['neutral', 'indecisive'].includes(actionStyle)) {
      const pretty = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      return {
        archetype: 'The Seed',
        decision: pretty(decisionStyle),
        action: pretty(actionStyle),
        description:
          "You’re not quite sure where you stand yet, but you're curious, you're here, and you're starting to pay attention. That alone matters.\n" +
          "Maybe you haven’t figured out your routine, your values, or how it all fits together. Maybe you’re still deciding what’s realistic or meaningful for you. That’s not a flaw; it’s the beginning of growth.\n" +
          "Like a seed in the soil, you don’t have to do everything right away. Start small. Notice one thing this week: how much plastic shows up in your day, or how often you toss leftovers. No pressure to act. Just pay attention and you’ll be on your way.",
        hookLine: "You’re not quite sure where you stand yet and that’s okay.\n"
      };
    }

    // Matrix mapping
    const matrix: Record<string, Record<string, { type: string; desc: string; hookLine: string }>> = {
      analyst: {
        planner: { 
          type: 'Strategist', 
          desc: 'You like a plan. Lists are your love language and you probably get a little thrill from checking things off. You\'re not one to wing it—you\'d rather figure out what works, build a system around it, and stick to it. Whether it\'s organizing your fridge to reduce food waste or tracking your energy usage, you\'re all about efficient, repeatable habits. In the climate space, you shine when you turn everyday routines into impact. You don\'t need a rooftop garden (yet)—you\'re the one who actually sets the reminder to bring a tote bag or checks the electricity bill just to see the change. People around you learn from your consistency—so keep showing how structure can lead to sustainability.',
          hookLine: 'You love a plan and turn small routines into big impact.'
        },
        experimenter: { 
          type: 'Trailblazer', 
          desc: 'You\'re all about diving in and figuring it out later. You love testing new ideas, trying new swaps, and seeing what sticks. Composting? You\'ll give it a shot. Switching up your shampoo bar? Why not. Some things will work, some won\'t—and that\'s the whole point. You don\'t wait for a perfect plan, which is exactly what makes you powerful. Your climate journey is built on curiosity, not pressure. And every time you try something new—no matter how small—you make it easier for the next person to try too. You\'re the reason someone else says, "Huh, maybe I can do that too."',
          hookLine: 'You dive in, try things out, and figure it out as you go.'
        },
        collaborator: { 
          type: 'Coordinator', 
          desc: 'You\'re a behind-the-scenes powerhouse. You love bringing people together to get things done, whether it\'s planning a potluck or getting your group to split a bulk grocery order. You\'ve got the social touch and the steady hand—it\'s a winning combo. When it comes to climate action, you make it communal. You\'re the one starting the group chat for a clothing swap or helping your friend figure out what goes in the recycling bin. You remind people that sustainability isn\'t just about what *you* do—it\'s about what *we* build together. Keep leading the way, one shared effort at a time.',
          hookLine: 'You bring people together to make things happen—collaboratively.'
        }
      },
      intuitive: {
        planner: { 
          type: 'Visionary', 
          desc: 'You see the world not just as it is—but as it could be. You\'re thoughtful, creative, and full of quiet hope. Your imagination fuels your actions: maybe you dream about green cities, cozy neighborhoods, or homes that breathe with nature. In practice, that might look like turning a corner of your space into a plant haven, journaling about future lifestyles, or slowly swapping out your habits to reflect your values. You don\'t rush change—you nurture it. Your role in the climate movement is to remind us that small seeds can grow into something beautiful. Keep sketching that future—we need it.',
          hookLine: 'You dream big and act small, building the future one idea at a time.'
        },
        experimenter: { 
          type: 'Explorer', 
          desc: 'You like to learn by doing. You\'re not here for long-winded lectures—you want to test things out, see how it feels, and then tell your friends about it. Maybe you try biking to work, growing herbs on your windowsill, or skipping takeout for a week—just to see. You thrive when you\'re in motion, adjusting as you go. Climate action, for you, is less about perfection and more about momentum. Your honest feedback and real-world experiments help others figure out what works for *them*, too. So keep exploring—your journey is full of insight (and great stories).',
          hookLine: 'You learn by doing and share what works—no fuss, just flow.'
        },
        collaborator: { 
          type: 'Catalyst', 
          desc: 'You\'re the spark that gets things moving. Your enthusiasm is magnetic—when you care about something, it shows, and people notice. You\'re the one who turns a random thought into a group challenge, or who convinces your friend to finally try a tote bag with a "come on, just try it!" In the climate space, your energy creates momentum. You may not have all the answers (who does?), but you know how to make things feel doable—and maybe even fun. You bring the memes, the energy, the group selfies. And in a world full of overwhelm, that\'s exactly what people need more of.',
          hookLine: 'You spark action in others with your energy and enthusiasm.'
        }
      },
      connector: {
        planner: { 
          type: 'Builder', 
          desc: 'You love turning ideas into action. Big visions are cool, but you\'re here to break them into steps. You\'re the type to transform a junk drawer into a reusables station or to figure out a system for sorting your recycling that even guests understand. In climate work, your gift is turning intention into infrastructure—even if it\'s just in your home or workplace. You make change feel achievable because you don\'t just talk about it—you *build* it, one drawer, bin, or corner at a time. Keep constructing your climate-friendly life—it adds up fast.',
          hookLine: 'You break goals into steps and create systems that stick.'
        },
        experimenter: { 
          type: 'Networker', 
          desc: 'You\'re the person everyone asks for recommendations—and you *always* have the list. You\'re naturally resourceful and generous with what you know, whether it\'s sharing the name of a good repair café or reminding your group where to get second-hand furniture. You help create bridges. You may not always be in the spotlight, but your quiet knowledge-sharing keeps the climate movement grounded and growing. You\'re not just building habits—you\'re building community resilience. Keep passing it on—you never know who it\'ll help.',
          hookLine: 'You connect the dots and love sharing what you\'ve learned.'
        },
        collaborator: { 
          type: 'Steward', 
          desc: 'You care deeply and stick to what matters. You don\'t need loud gestures—you\'re guided by values, by care, and by quiet consistency. You\'re the person who\'s always reused glass jars or who reminds everyone to switch off the lights when leaving a room. In a world full of burnout and fast fixes, you offer something rare: steadiness. You show that climate action can be small, deliberate, and full of heart. And even if you don\'t always feel like a "climate person," your habits are a form of love—for your space, your people, and the future. Keep showing up—you\'re already making a difference.',
          hookLine: 'You quietly stick to what matters and lead by thoughtful example.'
        }
      }
    };

    const resultEntry = matrix[decisionStyle as keyof typeof matrix][actionStyle as keyof typeof matrix[typeof decisionStyle]];
    
    return {
      archetype: resultEntry.type,
      decision: decisionStyle.charAt(0).toUpperCase() + decisionStyle.slice(1),
      action: actionStyle.charAt(0).toUpperCase() + actionStyle.slice(1),
      description: resultEntry.desc,
      hookLine: resultEntry.hookLine
    };
  }

  private generatePowerMovesBasedOnBehavior(
    personality: { archetype: string; decision: string; action: string; description: string },
    behavioralPatterns: { goodHabits: string[]; stretchAreas: string[]; habitTags: Record<string, boolean> },
    responses: UserResponses
  ): { powerHabit: string; powerMove: string; stretchCTA: string } {
    const { goodHabits, stretchAreas, habitTags } = behavioralPatterns;
    const { archetype } = personality;

    // Power Habit Generation
    let powerHabit = '';
    if (goodHabits.length >= 2) {
      const habitDescriptions: Record<string, string> = {
        lowCarbonTransport: 'You already commute sustainably',
        ethicalFashion: 'You shop thoughtfully and choose sustainable clothing',
        circularMindset: 'You repair and reuse before replacing',
        wasteAware: 'You prevent waste and manage resources wisely',
        airAware: 'You monitor air quality and make informed decisions',
        energyEfficient: 'You prioritize energy efficiency in your home',
        plantBasedDiet: 'You choose plant-based meals regularly'
      };

      const selectedHabit = goodHabits[0]; // Pick the first good habit to highlight
      powerHabit = `${habitDescriptions[selectedHabit] || 'You already practice sustainable habits'} — that's the quiet kind of climate leadership we love.`;
    } else {
      powerHabit = "You're taking steps toward sustainability — every small action counts and builds momentum.";
    }

    // Power Move Generation based on personality and stretch areas
    let powerMove = '';
    let stretchCTA = '';

    const personalityPowerMoves: Record<string, Record<string, string>> = {
      Strategist: {
        energy: 'Create a 7-day energy tracking system. Monitor one appliance or routine for a week, then optimize based on your data.',
        transport: 'Map out your weekly routes and identify 3 trips you can convert to walking, biking, or public transit.',
        diet: 'Plan your meals for the week to reduce food waste and incorporate 2 more plant-based meals.',
        clothing: 'Audit your wardrobe and create a 30-day capsule wardrobe challenge.',
        waste: 'Set up a waste tracking system for one week to identify your biggest waste sources.'
      },
      Trailblazer: {
        energy: 'Test a new energy-saving hack each week — like unplugging chargers or adjusting your thermostat.',
        transport: 'Try a new transportation mode this week — bike to one errand or take public transit somewhere new.',
        diet: 'Experiment with one new plant-based recipe each week and track which ones you love.',
        clothing: 'Try a clothing swap with friends or visit a thrift store for your next purchase.',
        waste: 'Test a zero-waste alternative for one common item you use daily.'
      },
      Coordinator: {
        energy: 'Organize a "Switch-Off Sunday" with your housemates where you unplug and unwind together.',
        transport: 'Start a carpool group for regular trips or organize a walking group for local errands.',
        diet: 'Host a plant-based potluck with friends to discover new recipes together.',
        clothing: 'Organize a clothing swap party with friends or colleagues.',
        waste: 'Create a shared composting system with neighbors or start a repair café in your community.'
      },
      Visionary: {
        energy: 'Design your ideal sustainable home energy system and start with one small upgrade.',
        transport: 'Envision your ideal sustainable transportation system and take one step toward it this week.',
        diet: 'Imagine your perfect sustainable diet and gradually shift toward it, one meal at a time.',
        clothing: 'Create a vision board for your sustainable wardrobe and start building it piece by piece.',
        waste: 'Design your ideal zero-waste lifestyle and implement one aspect this month.'
      },
      Explorer: {
        energy: 'Discover a new energy-saving technique and share what you learn with friends.',
        transport: 'Explore a new route or transportation option and document your experience.',
        diet: 'Try a new plant-based ingredient or cuisine and share your discoveries.',
        clothing: 'Explore sustainable fashion brands or second-hand shopping in your area.',
        waste: 'Discover a new zero-waste product or technique and test it out.'
      },
      Catalyst: {
        energy: 'Inspire your household to join a 7-day energy challenge with daily check-ins.',
        transport: 'Start a conversation about sustainable transportation options in your community.',
        diet: 'Share your plant-based journey and inspire others to try meatless Mondays.',
        clothing: 'Lead a discussion about sustainable fashion choices with friends or colleagues.',
        waste: 'Spark interest in zero-waste living by sharing your experiences and tips.'
      },
      Builder: {
        energy: 'Build a simple energy monitoring system for your home, starting with one room.',
        transport: 'Create a sustainable transportation plan for your regular routes.',
        diet: 'Build a meal planning system that reduces waste and incorporates more plants.',
        clothing: 'Build a sustainable wardrobe system, starting with a capsule collection.',
        waste: 'Build a waste reduction system for your household, starting with one category.'
      },
      Networker: {
        energy: 'Connect with others who are interested in energy efficiency and share tips.',
        transport: 'Join or start a sustainable transportation group in your community.',
        diet: 'Connect with local farmers or join a community-supported agriculture program.',
        clothing: 'Network with sustainable fashion enthusiasts and share shopping recommendations.',
        waste: 'Connect with local zero-waste groups or start one in your community.'
      },
      Steward: {
        energy: 'Establish a daily energy stewardship routine, like turning off lights when leaving rooms.',
        transport: 'Develop a sustainable transportation routine that becomes second nature.',
        diet: 'Create a sustainable eating routine that honors both your health and the planet.',
        clothing: 'Develop a mindful clothing routine that extends the life of your garments.',
        waste: 'Establish daily waste reduction habits that become automatic over time.'
      }
    };

    // Select the most relevant stretch area and generate appropriate power move
    if (stretchAreas.length > 0) {
      const primaryStretchArea = stretchAreas[0];
      const personalityMoves = personalityPowerMoves[archetype];
      
      if (personalityMoves && personalityMoves[primaryStretchArea]) {
        powerMove = personalityMoves[primaryStretchArea];
      } else {
        // Fallback for areas not covered by personality-specific moves
        const fallbackMoves: Record<string, string> = {
          energy: 'Try creating a simple energy tracking system for one week to understand your usage patterns.',
          transport: 'Experiment with one sustainable transportation option this week.',
          diet: 'Try incorporating one more plant-based meal into your weekly routine.',
          clothing: 'Visit a thrift store or clothing swap for your next purchase.',
          waste: 'Start tracking your waste for one week to identify reduction opportunities.'
        };
        powerMove = fallbackMoves[primaryStretchArea] || 'Choose one small sustainable action to try this week.';
      }
    } else {
      // If no clear stretch areas, suggest a general improvement
      powerMove = `Try creating a 7-day visual tracker to improve one small habit. ${archetype}s like you thrive on small systems.`;
    }

    // Stretch CTA Generation
    const stretchCTAs: Record<string, string> = {
      Strategist: 'Want to go further? Create a detailed sustainability plan for the next 30 days and track your progress.',
      Trailblazer: 'Want to go further? Challenge yourself to try 3 new sustainable practices this month.',
      Coordinator: 'Want to go further? Organize a sustainability challenge with 3 friends or family members.',
      Visionary: 'Want to go further? Design your ideal sustainable lifestyle and take one step toward it.',
      Explorer: 'Want to go further? Discover and share 3 new sustainable practices with your community.',
      Catalyst: 'Want to go further? Inspire 3 people to join you on your sustainability journey.',
      Builder: 'Want to go further? Build a sustainable system that others can follow and adapt.',
      Networker: 'Want to go further? Connect with 3 new people who share your sustainability interests.',
      Steward: 'Want to go further? Establish a sustainable routine that becomes a lasting habit.'
    };

    stretchCTA = stretchCTAs[archetype] || 'Want to go further? Choose one area to focus on and build sustainable habits over time.';

    return { powerHabit, powerMove, stretchCTA };
  }

  private generatePowerMoves(personality: string, impactMetrics: any, badge: string): string[] {
    // This method is now deprecated in favor of the new comprehensive approach
    // Keeping for backward compatibility
    const trees = impactMetrics.treesPlanted;
    const co2 = impactMetrics.carbonReduced;

    const templates: Record<string, string[]> = {
      "Sustainability Slayer": [
        `✅ <b>Your Slayer Signature:</b><br>You've mastered sustainable fashion. <b>${trees} trees' worth of CO₂ saved?</b> Iconic.`,
        `🔥 <b>Next Move:</b><br>Challenge a friend to a zero-waste week. Sustainability spreads faster with community.`,
        `🌐 <b>Amplify Your Impact:</b><br>If just 3 friends follow your lead, that's <b>${trees * 3} more trees planted</b> and <b>${(Number(co2) * 0.25).toFixed(1)} tons of CO₂</b> gone.`
      ],
      "Planet's Main Character": [
        `🌍 <b>Global Impact:</b><br>You're making a significant impact on the planet. Keep it up!`,
        `🌳 <b>Next Move:</b><br>Plant a tree. It's a small act, but it adds up.`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Sustainability Soft Launch": [
        `🌳 <b>Next Move:</b><br>Plant a tree. It's a small act, but it adds up.`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`
      ],
      "Kind of Conscious, Kind of Confused": [
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Eco in Progress": [
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Doing Nothing for the Planet": [
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Certified Climate Snoozer": [
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ]
    };
    return templates[personality as keyof typeof templates] || templates["Eco in Progress"];
  }

  private generateComprehensivePowerMoves(responses: UserResponses): PowerMovesResponse {
    // Analyze behavioral patterns
    const behavioralPatterns = this.analyzeBehavioralPatterns(responses);
    
    // Determine personality archetype if personality traits are available
    // Coherent default (decision/action match archetype): Connector + Planner => Builder
    let personality = {
      archetype: 'Builder',
      decision: 'Connector',
      action: 'Planner',
      description: 'You break big goals into steps. You co-create small experiments with others and build lasting systems that grow over time.',
      hookLine: 'You break goals into steps and create systems that stick.'
    };

    if (responses.personalityTraits) {
      personality = this.determinePersonalityArchetype(responses.personalityTraits);
    }

    // Generate power moves based on behavior and personality
    const powerMoves = this.generatePowerMovesBasedOnBehavior(personality, behavioralPatterns, responses);

    return {
      personality,
      powerMoves,
      tone: 'supportive, intelligent, honest, warm',
      gender: (responses.gender === 'boy' || responses.gender === 'girl')
        ? responses.gender
        : (responses.gender && responses.gender.toLowerCase().startsWith('m') ? 'boy' : 'girl')
    };
  }

  async calculatePersonality(responses: UserResponses): Promise<PersonalityResponse> {
    console.log('Calculating personality for responses:', responses);
    
    // Legacy: category-based numeric scoring retained for backward-compatible fields
    const scores = this.calculatePersonalityScores(responses);
    console.log('Calculated scores:', scores);
    
    const impactMetrics = this.calculateImpactMetrics(responses);
    console.log('Calculated impact metrics:', impactMetrics);
    
    // Calculate impact metrics and equivalences using the new service
    const impactMetricAndEquivalence = this.impactMetricAndEquivalenceService.calculateImpactMetricAndEquivalence(
      responses,
      undefined, // categoryEmissionsKg - let the service calculate
      'conventional', // referencePolicy
      undefined, // cohortAveragesKg
      'clean', // rounding
      'en' // copyLocale
    );
    console.log('Calculated impact metric and equivalence:', impactMetricAndEquivalence);
    
    // New: eliminate threshold mapping, pick personality by mapping tally
    const personalityType = this.determinePersonalityFromMappings(responses);
    console.log('Determined personality type:', personalityType);
    
    const personalityInfo = EcoPersonalityTypes[personalityType];
    console.log('Retrieved personality info:', personalityInfo);

    // Generate power moves
    const powerMoves = this.generatePowerMoves(personalityType, impactMetrics, 'Carbon Strategist');
    console.log('Generated power moves:', powerMoves);

    // ================= New Personality Logic (Decision/Action Matrix) =================
    let newPersonality: string | undefined;
    let newPersonalityDescription: string | undefined;

    if (responses.personalityTraits) {
      const result = this.determinePersonalityArchetype(responses.personalityTraits);
      newPersonality = result.archetype;
      newPersonalityDescription = result.description;
    }

    // Generate comprehensive power moves using new system
    const comprehensivePowerMoves = this.generateComprehensivePowerMoves(responses);
    console.log('Generated comprehensive power moves:', comprehensivePowerMoves);

    // Generate personalized power moves using new system
    const personalizedPowerMoves = PowerMovesService.detectPowerMoves(responses);
    console.log('Generated personalized power moves:', personalizedPowerMoves);

    // Generate highlights using new system
    const highlights = HighlightsService.generateHighlights(responses);
    console.log('Generated highlights:', highlights);

    // Fallback for newPersonality if not calculated from traits
    if (!newPersonality) {
      newPersonality = personalityType;
      newPersonalityDescription = personalityInfo.description;
    }

    const response = {
      personalityType,
      description: personalityInfo.description,
      strengths: personalityInfo.strengths,
      nextSteps: personalityInfo.nextSteps,
      // Preserve existing response shape for compatibility
      categoryScores: scores.categoryScores,
      impactMetrics,
      impactMetricAndEquivalence, // New impact metric and equivalence field
      finalScore: scores.finalScore,
      powerMoves,
      comprehensivePowerMoves, // New comprehensive power moves structure
      personalizedPowerMoves, // New personalized power moves structure
      highlights, // New highlights structure
      newPersonality,
      newPersonalityDescription,
      // Return personalityTraits if present in input
      ...(responses.personalityTraits ? { personalityTraits: responses.personalityTraits } : {})
    };
    
    console.log('Final response:', response);
    return response;
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
