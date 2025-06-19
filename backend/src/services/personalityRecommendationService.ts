import { PersonalityType } from '../types/personality';

interface RecommendationROI {
  emotional: string;
  environmental: string;
}

interface RecommendationSimulation {
  weekly?: string;
  monthly?: string;
  quarterly?: string;
  yearly?: string;
}

interface Recommendation {
  action: string;
  linkedBehavior: string;
  impact: string;
  analogy: string;
  effortLevel: 'low' | 'medium' | 'high';
  roi: RecommendationROI;
  category: string;
  simulation: RecommendationSimulation;
  personas: PersonalityType[];
  region: string;
  lifestyle: string;
}

// Personality-based recommendations database
const personalityRecommendations: Recommendation[] = [
  {
    action: "Take a 30-minute nature walk without your phone",
    linkedBehavior: "airQuality_awareness",
    impact: "Improves air quality sensitivity and reduces screen time energy use",
    analogy: "Like giving your brain a battery recharge",
    effortLevel: "low",
    roi: {
      emotional: "Restorative, grounding, and refreshing",
      environmental: "Reduces indirect energy draw and fosters eco-mindfulness"
    },
    category: "airQuality",
    simulation: {
      weekly: "2 hours unplugged = ~0.5kg CO₂ saved",
      monthly: "2kg CO₂ = 0.1 trees"
    },
    personas: ["Eco in Progress"],
    region: "Global",
    lifestyle: "Urban"
  },
  {
    action: "Switch off unused lights and appliances before leaving home",
    linkedBehavior: "homeEnergy_management",
    impact: "Saves ~1.5kg CO₂ per week",
    analogy: "Like skipping a 5km car ride",
    effortLevel: "low",
    roi: {
      emotional: "Feels responsible and attentive",
      environmental: "Reduces electricity demand and emissions"
    },
    category: "homeEnergy",
    simulation: {
      weekly: "1.5kg CO₂",
      monthly: "6kg CO₂ = 0.25 trees"
    },
    personas: ["Eco in Progress"],
    region: "Global",
    lifestyle: "Commuter"
  },
  {
    action: "Bring a reusable bag for all shopping trips",
    linkedBehavior: "waste_prevention",
    impact: "Avoids ~20 plastic bags/month",
    analogy: "Like keeping a small river plastic-free",
    effortLevel: "low",
    roi: {
      emotional: "Light, effortless win with visible impact",
      environmental: "Reduces single-use plastic production and litter"
    },
    category: "waste",
    simulation: {
      monthly: "20 bags avoided",
      yearly: "240 bags = 2.4kg plastic waste prevented"
    },
    personas: ["Eco in Progress"],
    region: "Global",
    lifestyle: "Student"
  },
  {
    action: "Replace 2 fast fashion items this month with thrifted pieces",
    linkedBehavior: "apparel_consumption",
    impact: "Saves ~50kg CO₂",
    analogy: "Like skipping 200km of car travel",
    effortLevel: "medium",
    roi: {
      emotional: "Feel proud and stylish with a story",
      environmental: "Reduces water use and carbon footprint from production"
    },
    category: "clothing",
    simulation: {
      monthly: "50kg CO₂ = 2 trees planted",
      quarterly: "150kg CO₂ = 6 trees"
    },
    personas: ["Sustainability Slayer"],
    region: "Global",
    lifestyle: "Conscious Shopper"
  },
  {
    action: "Host a zero-waste dinner for friends",
    linkedBehavior: "food_waste",
    impact: "Reduces ~3kg food waste per event",
    analogy: "Like saving 7 meals from landfill",
    effortLevel: "medium",
    roi: {
      emotional: "Fun, social, and inspiring",
      environmental: "Prevents methane emissions from food waste"
    },
    category: "food",
    simulation: {
      monthly: "12kg food waste avoided",
      yearly: "144kg = 0.3 tons CO₂"
    },
    personas: ["Sustainability Slayer"],
    region: "Europe",
    lifestyle: "Family Household"
  },
  {
    action: "Switch to a renewable energy provider",
    linkedBehavior: "homeEnergy_source",
    impact: "Cuts home energy emissions by up to 50%",
    analogy: "Like planting 10 trees every year",
    effortLevel: "high",
    roi: {
      emotional: "Feels powerful and future-focused",
      environmental: "Major reduction in fossil fuel use"
    },
    category: "homeEnergy",
    simulation: {
      yearly: "Up to 1 ton CO₂ saved"
    },
    personas: ["Sustainability Slayer"],
    region: "Global",
    lifestyle: "Urban"
  },
  {
    action: "Use public transport instead of driving twice a week",
    linkedBehavior: "transport_mode",
    impact: "Saves ~6kg CO₂ per week",
    analogy: "Like skipping a 25km car trip",
    effortLevel: "medium",
    roi: {
      emotional: "Feels adventurous and social",
      environmental: "Reduces traffic and air pollution"
    },
    category: "transport",
    simulation: {
      weekly: "6kg CO₂",
      monthly: "24kg CO₂ = 1 tree"
    },
    personas: ["Kind of Conscious"],
    region: "South Asia",
    lifestyle: "Commuter"
  },
  {
    action: "Try a meatless Monday",
    linkedBehavior: "food_dietType",
    impact: "Saves ~2kg CO₂ per meal",
    analogy: "Like skipping a 10km car ride",
    effortLevel: "low",
    roi: {
      emotional: "Feels healthy and creative",
      environmental: "Reduces methane and water use"
    },
    category: "food",
    simulation: {
      weekly: "2kg CO₂",
      monthly: "8kg CO₂"
    },
    personas: ["Kind of Conscious"],
    region: "Global",
    lifestyle: "Remote Worker"
  },
  {
    action: "Recycle all paper and cardboard for a month",
    linkedBehavior: "waste_management",
    impact: "Saves ~10kg CO₂ and 1 tree",
    analogy: "Like giving a tree a second life",
    effortLevel: "medium",
    roi: {
      emotional: "Feels organized and impactful",
      environmental: "Reduces landfill and saves resources"
    },
    category: "waste",
    simulation: {
      monthly: "10kg CO₂, 1 tree saved"
    },
    personas: ["Kind of Conscious"],
    region: "Global",
    lifestyle: "Family Household"
  },
  {
    action: "Organize a community clean-up weekend",
    linkedBehavior: "waste_community",
    impact: "Removes 10–20kg waste from public areas",
    analogy: "Like giving your neighborhood a fresh start",
    effortLevel: "high",
    roi: {
      emotional: "Builds pride and shared ownership",
      environmental: "Reduces microplastics and landfill load"
    },
    category: "waste",
    simulation: {
      monthly: "20kg waste removed",
      quarterly: "60kg waste = 6 trash bags avoided"
    },
    personas: ["Planet's Main Character"],
    region: "South Asia",
    lifestyle: "Family Household"
  },
  {
    action: "Mentor a friend in eco-friendly practices",
    linkedBehavior: "community_mentorship",
    impact: "Multiplies your positive impact",
    analogy: "Like planting seeds for a greener future",
    effortLevel: "medium",
    roi: {
      emotional: "Feels inspiring and connected",
      environmental: "Spreads sustainable habits"
    },
    category: "digital",
    simulation: {
      monthly: "2 new people influenced"
    },
    personas: ["Planet's Main Character"],
    region: "Global",
    lifestyle: "Urban"
  },
  {
    action: "Switch to a plant-based lunch at work",
    linkedBehavior: "food_dietType",
    impact: "Saves ~1.5kg CO₂ per meal",
    analogy: "Like skipping a 6km car ride",
    effortLevel: "low",
    roi: {
      emotional: "Feels energizing and modern",
      environmental: "Reduces carbon and water use"
    },
    category: "food",
    simulation: {
      weekly: "7.5kg CO₂",
      monthly: "30kg CO₂"
    },
    personas: ["Planet's Main Character"],
    region: "Europe",
    lifestyle: "Commuter"
  },
  {
    action: "Track your waste in a notebook for one week",
    linkedBehavior: "waste_literacy",
    impact: "Creates awareness of disposal patterns",
    analogy: "Like turning on the light in a dark room",
    effortLevel: "low",
    roi: {
      emotional: "Helps take control, builds insight",
      environmental: "Improves chances of long-term behavioral change"
    },
    category: "waste",
    simulation: {
      weekly: "~0.5kg plastic redirected",
      monthly: "2kg + increased recycling potential"
    },
    personas: ["Certified Climate Snoozer"],
    region: "South Asia",
    lifestyle: "Urban"
  },
  {
    action: "Unplug devices when not in use for a week",
    linkedBehavior: "homeEnergy_management",
    impact: "Saves ~1kg CO₂ per week",
    analogy: "Like skipping a 4km car ride",
    effortLevel: "low",
    roi: {
      emotional: "Feels mindful and cost-saving",
      environmental: "Reduces phantom energy use"
    },
    category: "homeEnergy",
    simulation: {
      weekly: "1kg CO₂",
      monthly: "4kg CO₂"
    },
    personas: ["Certified Climate Snoozer"],
    region: "Global",
    lifestyle: "Student"
  },
  {
    action: "Take a 5-minute shorter shower each day",
    linkedBehavior: "homeEnergy_water",
    impact: "Saves ~15 liters water/day",
    analogy: "Like saving a bucket of water daily",
    effortLevel: "low",
    roi: {
      emotional: "Feels refreshing and efficient",
      environmental: "Reduces water and energy use"
    },
    category: "homeEnergy",
    simulation: {
      weekly: "105 liters water",
      monthly: "450 liters water"
    },
    personas: ["Certified Climate Snoozer"],
    region: "Global",
    lifestyle: "Urban"
  },
  {
    action: "Replace one meat meal per day with a plant-based alternative",
    linkedBehavior: "food_dietType",
    impact: "Saves ~2.5kg CO₂/day",
    analogy: "Like skipping a 10km car ride daily",
    effortLevel: "medium",
    roi: {
      emotional: "Feel healthier and ethically aligned",
      environmental: "Reduces methane, land, and water use"
    },
    category: "food",
    simulation: {
      weekly: "17.5kg CO₂",
      monthly: "70kg CO₂ = 3 trees"
    },
    personas: ["Sustainability Soft Launch"],
    region: "Global",
    lifestyle: "Remote Worker"
  },
  {
    action: "Switch to a reusable coffee cup for a month",
    linkedBehavior: "waste_prevention",
    impact: "Avoids 20+ single-use cups/month",
    analogy: "Like keeping a park litter-free",
    effortLevel: "low",
    roi: {
      emotional: "Feels stylish and eco-conscious",
      environmental: "Reduces landfill waste"
    },
    category: "waste",
    simulation: {
      monthly: "20 cups avoided"
    },
    personas: ["Sustainability Soft Launch"],
    region: "Europe",
    lifestyle: "Commuter"
  },
  {
    action: "Bike or walk for short trips under 2km",
    linkedBehavior: "transport_mode",
    impact: "Saves ~1kg CO₂ per trip",
    analogy: "Like skipping a 4km car ride",
    effortLevel: "medium",
    roi: {
      emotional: "Feels energizing and free",
      environmental: "Reduces air pollution and traffic"
    },
    category: "transport",
    simulation: {
      weekly: "3kg CO₂",
      monthly: "12kg CO₂"
    },
    personas: ["Sustainability Soft Launch"],
    region: "Global",
    lifestyle: "Urban"
  }
];

export class PersonalityRecommendationService {
  /**
   * Get recommendations for a specific personality type
   */
  static getRecommendationsForPersonality(personalityType: PersonalityType): Recommendation[] {
    return personalityRecommendations.filter(rec => 
      rec.personas.includes(personalityType)
    );
  }

  /**
   * Get recommendations by category
   */
  static getRecommendationsByCategory(category: string): Recommendation[] {
    return personalityRecommendations.filter(rec => 
      rec.category === category
    );
  }

  /**
   * Get recommendations by effort level
   */
  static getRecommendationsByEffortLevel(effortLevel: 'low' | 'medium' | 'high'): Recommendation[] {
    return personalityRecommendations.filter(rec => 
      rec.effortLevel === effortLevel
    );
  }

  /**
   * Get recommendations by lifestyle
   */
  static getRecommendationsByLifestyle(lifestyle: string): Recommendation[] {
    return personalityRecommendations.filter(rec => 
      rec.lifestyle === lifestyle
    );
  }

  /**
   * Get personalized recommendations based on personality and preferences
   */
  static getPersonalizedRecommendations(
    personalityType: PersonalityType,
    preferences: {
      effortLevel?: 'low' | 'medium' | 'high';
      category?: string;
      lifestyle?: string;
    } = {}
  ): Recommendation[] {
    let recommendations = this.getRecommendationsForPersonality(personalityType);

    if (preferences.effortLevel) {
      recommendations = recommendations.filter(rec => 
        rec.effortLevel === preferences.effortLevel
      );
    }

    if (preferences.category) {
      recommendations = recommendations.filter(rec => 
        rec.category === preferences.category
      );
    }

    if (preferences.lifestyle) {
      recommendations = recommendations.filter(rec => 
        rec.lifestyle === preferences.lifestyle
      );
    }

    return recommendations;
  }
} 