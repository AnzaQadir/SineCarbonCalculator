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

export class PersonalityService {
  private calculateCategoryScores(responses: UserResponses) {
    return {
      home: (responses.homeEnergy?.efficiency === 'A' ? 3 : responses.homeEnergy?.efficiency === 'B' ? 2 : 1) +
            (responses.homeEnergy?.management === 'A' ? 3 : responses.homeEnergy?.management === 'B' ? 2 : 1),
      transport: (responses.transport?.primary === 'A' ? 3 : responses.transport?.primary === 'B' ? 2 : 1) +
                 (responses.transport?.carProfile === 'A' ? 3 : responses.transport?.carProfile === 'B' ? 2 : 1),
      food: (responses.food?.dietType === 'PLANT_BASED' ? 3 : responses.food?.dietType === 'VEGETARIAN' ? 2 : 1) +
            (responses.food?.foodSource === 'LOCAL_SEASONAL' ? 3 : responses.food?.foodSource === 'MIXED' ? 2 : 1),
      waste: (responses.waste?.prevention === 'A' ? 3 : responses.waste?.prevention === 'B' ? 2 : 1) +
             (responses.waste?.management === 'A' ? 3 : responses.waste?.management === 'B' ? 2 : 1)
    };
  }

  private determineDominantCategory(categoryScores: Record<string, number>): string {
    return Object.entries(categoryScores)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  private calculateSubCategory(dominantCategory: string, categoryScores: Record<string, number>): string {
    switch (dominantCategory) {
      case 'home':
        return categoryScores.home > 4 ? 'Energy Efficiency Expert' : 'Eco Homebody';
      case 'transport':
        return categoryScores.transport > 4 ? 'Green Mobility Champion' : 'Green Traveler';
      case 'food':
        return categoryScores.food > 4 ? 'Sustainable Food Pioneer' : 'Conscious Consumer';
      case 'waste':
        return categoryScores.waste > 4 ? 'Zero Waste Champion' : 'Zero Waste Warrior';
      default:
        return '';
    }
  }

  private calculateImpactMetrics(responses: UserResponses) {
    const baseEmissions = 16;
    let reducedEmissions = 0;

    // Home energy impact
    if (responses.homeEnergy?.efficiency === 'A') reducedEmissions += 2;
    if (responses.homeEnergy?.management === 'A') reducedEmissions += 1.5;

    // Transport impact
    if (responses.transport?.primary === 'A') reducedEmissions += 3;
    if (responses.transport?.carProfile === 'A') reducedEmissions += 2;

    // Food impact
    if (responses.food?.dietType === 'PLANT_BASED') reducedEmissions += 2.5;
    if (responses.food?.foodSource === 'LOCAL_SEASONAL') reducedEmissions += 1;

    // Waste impact
    if (responses.waste?.prevention === 'A') reducedEmissions += 1.5;
    if (responses.waste?.management === 'A') reducedEmissions += 1;

    const carbonReduced = reducedEmissions;
    const treesPlanted = Math.round(carbonReduced * 10);
    const communityImpact = Math.round((carbonReduced / baseEmissions) * 100);

    return {
      treesPlanted,
      carbonReduced,
      communityImpact
    };
  }

  public calculatePersonality(responses: UserResponses) {
    const tally: Record<string, number> = {};
    
    // Initialize tally
    personalityHierarchy.forEach(p => tally[p] = 0);

    // Process responses and update tally
    if (responses.homeEnergy?.efficiency) {
      personalityMappings.homeEnergy.efficiency[responses.homeEnergy.efficiency]?.forEach(p => tally[p]++);
    }
    if (responses.homeEnergy?.management) {
      personalityMappings.homeEnergy.management[responses.homeEnergy.management]?.forEach(p => tally[p]++);
    }

    // Process transport responses
    if (responses.transport?.primary) {
      personalityMappings.transport.primary[responses.transport.primary]?.forEach(p => tally[p]++);
    }
    if (responses.transport?.carProfile) {
      personalityMappings.transport.carProfile[responses.transport.carProfile]?.forEach(p => tally[p]++);
    }

    // Process food responses
    if (responses.food?.dietType) {
      personalityMappings.food.dietType[responses.food.dietType]?.forEach(p => tally[p]++);
    }
    if (responses.food?.foodSource) {
      personalityMappings.food.foodSource[responses.food.foodSource]?.forEach(p => tally[p]++);
    }

    // Process waste responses
    if (responses.waste?.prevention) {
      personalityMappings.waste.prevention[responses.waste.prevention]?.forEach(p => tally[p]++);
    }
    if (responses.waste?.management) {
      personalityMappings.waste.management[responses.waste.management]?.forEach(p => tally[p]++);
    }

    // Process air quality responses
    if (responses.airQuality?.monitoring) {
      personalityMappings.airQuality.monitoring[responses.airQuality.monitoring]?.forEach(p => tally[p]++);
    }
    if (responses.airQuality?.impact) {
      personalityMappings.airQuality.impact[responses.airQuality.impact]?.forEach(p => tally[p]++);
    }

    // Process clothing responses
    if (responses.clothing?.wardrobeImpact) {
      personalityMappings.clothing.wardrobeImpact[responses.clothing.wardrobeImpact]?.forEach(p => tally[p]++);
    }
    if (responses.clothing?.mindfulUpgrades) {
      personalityMappings.clothing.mindfulUpgrades[responses.clothing.mindfulUpgrades]?.forEach(p => tally[p]++);
    }
    if (responses.clothing?.consumptionFrequency) {
      personalityMappings.clothing.consumptionFrequency[responses.clothing.consumptionFrequency]?.forEach(p => tally[p]++);
    }
    if (responses.clothing?.brandLoyalty) {
      personalityMappings.clothing.brandLoyalty[responses.clothing.brandLoyalty]?.forEach(p => tally[p]++);
    }

    // Find personality with highest count
    let maxCount = 0;
    let topPersonalities: string[] = [];
    
    Object.entries(tally).forEach(([personality, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topPersonalities = [personality];
      } else if (count === maxCount) {
        topPersonalities.push(personality);
      }
    });

    // Resolve ties using hierarchy
    const finalPersonality = topPersonalities.reduce((prev, current) => {
      const prevIndex = personalityHierarchy.indexOf(prev);
      const currentIndex = personalityHierarchy.indexOf(current);
      return prevIndex < currentIndex ? prev : current;
    });

    // Calculate additional metrics
    const categoryScores = this.calculateCategoryScores(responses);
    const dominantCategory = this.determineDominantCategory(categoryScores);
    const subCategory = this.calculateSubCategory(dominantCategory, categoryScores);
    const impactMetrics = this.calculateImpactMetrics(responses);

    return {
      personality: finalPersonality,
      dominantCategory,
      subCategory,
      tally,
      categoryScores,
      impactMetrics,
      ...EcoPersonalityTypes[finalPersonality as keyof typeof EcoPersonalityTypes]
    };
  }
} 