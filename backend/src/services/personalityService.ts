import { EcoPersonalityType, EcoPersonalityTypes, personalityMappings, personalityHierarchy } from '../types/ecoPersonality';

interface UserResponses {
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

export class PersonalityService {
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

    // Determine personality type based on final score
    const personalityType = this.determinePersonalityType(finalScore);

    return {
      personalityType,
      categoryScores,
      finalScore
    };
  }

  private determinePersonalityType(score: number): EcoPersonalityType {
    if (score >= 80) return 'Sustainability Slayer';
    if (score >= 65) return "Planet's Main Character";
    if (score >= 50) return 'Sustainability Soft Launch';
    if (score >= 35) return 'Kind of Conscious, Kind of Confused';
    if (score >= 20) return 'Eco in Progress';
    if (score >= 5) return 'Doing Nothing for the Planet';
    return 'Certified Climate Snoozer';
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

  private generatePowerMoves(personality: string, impactMetrics: any, badge: string): string[] {
    const trees = impactMetrics.treesPlanted;
    const co2 = impactMetrics.carbonReduced;
    const nextBadge = "Carbon Strategist"; // You can make this dynamic if you have a badge engine

    const templates: Record<string, string[]> = {
      "Sustainability Slayer": [
        `✅ <b>Your Slayer Signature:</b><br>You've mastered sustainable fashion. <b>${trees} trees' worth of CO₂ saved?</b> Iconic.`,
        `🔥 <b>Next Move:</b><br>Challenge a friend to a zero-waste week. Sustainability spreads faster with community.`,
        `🌐 <b>Amplify Your Impact:</b><br>If just 3 friends follow your lead, that's <b>${trees * 3} more trees planted</b> and <b>${(Number(co2) * 0.25).toFixed(1)} tons of CO₂</b> gone.`,
        `🌳 <b>Next Move:</b><br>Plant a tree. It's a small act, but it adds up.`,
        `🌍 <b>Global Impact:</b><br>Your actions are making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Planet's Main Character": [
        `🌍 <b>Global Impact:</b><br>You're making a significant impact on the planet. Keep it up!`,
        `🌳 <b>Next Move:</b><br>Plant a tree. It's a small act, but it adds up.`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Sustainability Soft Launch": [
        `🌳 <b>Next Move:</b><br>Plant a tree. It's a small act, but it adds up.`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Kind of Conscious, Kind of Confused": [
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Eco in Progress": [
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Doing Nothing for the Planet": [
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ],
      "Certified Climate Snoozer": [
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Next Move:</b><br>You're making a difference. Keep it up!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`,
        `🌟 <b>Power Move:</b><br>You're a true sustainability hero. Keep leading the way!`
      ]
    };
    return templates[personality as keyof typeof templates] || templates["Eco in Progress"];
  }

  async calculatePersonality(responses: UserResponses): Promise<PersonalityResponse> {
    console.log('Calculating personality for responses:', responses);
    
    const scores = this.calculatePersonalityScores(responses);
    console.log('Calculated scores:', scores);
    
    const impactMetrics = this.calculateImpactMetrics(responses);
    console.log('Calculated impact metrics:', impactMetrics);
    
    const personalityType = scores.personalityType;
    console.log('Determined personality type:', personalityType);
    
    const personalityInfo = EcoPersonalityTypes[personalityType];
    console.log('Retrieved personality info:', personalityInfo);

    // Generate power moves
    const powerMoves = this.generatePowerMoves(personalityType, impactMetrics, 'Carbon Strategist');
    console.log('Generated power moves:', powerMoves);

    const response = {
      personalityType,
      description: personalityInfo.description,
      strengths: personalityInfo.strengths,
      nextSteps: personalityInfo.nextSteps,
      categoryScores: scores.categoryScores,
      impactMetrics,
      finalScore: scores.finalScore,
      powerMoves,
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
