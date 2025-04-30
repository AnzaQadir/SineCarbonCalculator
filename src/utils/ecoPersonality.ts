// Eco-Personality Types
export interface EcoPersonalityType {
  title: string;
  badge: string;
  description: string;
  color: string;
  strengths: string[];
  nextSteps: string[];
  points: string;
  subCategory?: string;
  role: 'visionary' | 'guardian' | 'catalyst' | 'sage';
  mood: 'determined' | 'peaceful' | 'energetic' | 'wise';
}

export const EcoPersonalityTypes: Record<string, EcoPersonalityType> = {
  ECO_VISIONARY: {
    title: "Eco Visionary",
    badge: "🌟",
    description: "You're a forward-thinking environmental pioneer, seeing possibilities where others see challenges. Your innovative approach to sustainability inspires and leads the way.",
    color: "from-teal-600 to-teal-500",
    role: "visionary",
    mood: "determined",
    points: "8/8 Points",
    strengths: [
      "Innovative environmental problem-solving",
      "Long-term sustainability planning",
      "Inspiring others through creative solutions",
      "Pioneering eco-friendly technologies"
    ],
    nextSteps: [
      "Launch a community sustainability initiative",
      "Develop innovative eco-solutions",
      "Create environmental education programs",
      "Partner with local green businesses"
    ]
  },
  EARTH_GUARDIAN: {
    title: "Earth Guardian",
    badge: "🌍",
    description: "You're a steadfast protector of our planet, maintaining balance between progress and preservation. Your consistent efforts create lasting positive change.",
    color: "from-blue-600 to-blue-500",
    role: "guardian",
    mood: "peaceful",
    points: "7/8 Points",
    strengths: [
      "Consistent environmental stewardship",
      "Balanced approach to sustainability",
      "Strong conservation ethics",
      "Community environmental leadership"
    ],
    nextSteps: [
      "Establish local conservation projects",
      "Create sustainable living guidelines",
      "Organize community clean-up events",
      "Develop waste reduction programs"
    ]
  },
  ECO_CATALYST: {
    title: "Eco Catalyst",
    badge: "⚡",
    description: "You're a dynamic force for environmental change, energizing others and sparking eco-conscious movements. Your enthusiasm is contagious and transformative.",
    color: "from-purple-600 to-purple-500",
    role: "catalyst",
    mood: "energetic",
    points: "6/8 Points",
    strengths: [
      "Energetic environmental advocacy",
      "Rapid adoption of eco-innovations",
      "Social influence for sustainability",
      "Quick implementation of green practices"
    ],
    nextSteps: [
      "Start viral eco-challenges",
      "Create engaging sustainability content",
      "Lead quick-impact green initiatives",
      "Network with environmental influencers"
    ]
  },
  SUSTAINABILITY_SAGE: {
    title: "Sustainability Sage",
    badge: "🌿",
    description: "You're a wise environmental steward, understanding the deep connections between nature and human activity. Your thoughtful approach creates lasting impact.",
    color: "from-lime-600 to-lime-500",
    role: "sage",
    mood: "wise",
    points: "5/8 Points",
    strengths: [
      "Deep ecological understanding",
      "Holistic environmental perspective",
      "Mindful resource management",
      "Traditional ecological knowledge"
    ],
    nextSteps: [
      "Share environmental wisdom",
      "Mentor eco-conscious individuals",
      "Document sustainable practices",
      "Research traditional conservation methods"
    ]
  },
  GREEN_APPRENTICE: {
    title: "Green Apprentice",
    badge: "🌱",
    description: "You're beginning your sustainability journey with enthusiasm and openness to learn. Your fresh perspective brings new energy to environmental efforts.",
    color: "from-emerald-500 to-emerald-400",
    role: "catalyst",
    mood: "energetic",
    points: "4/8 Points",
    strengths: [
      "Eager to learn and adapt",
      "Fresh perspective on sustainability",
      "Quick adoption of eco-habits",
      "Openness to new ideas"
    ],
    nextSteps: [
      "Build foundational eco-knowledge",
      "Start small sustainable habits",
      "Connect with environmental mentors",
      "Experiment with green lifestyle changes"
    ]
  }
};

// Question-Answer to Personality Mappings
const personalityMappings = {
  homeEnergy: {
    efficiency: {
      A: ["ECO_VISIONARY", "EARTH_GUARDIAN"],
      B: ["ECO_CATALYST", "SUSTAINABILITY_SAGE"],
      C: ["GREEN_APPRENTICE"],
      "": ["GREEN_APPRENTICE"]
    },
    management: {
      A: ["ECO_VISIONARY", "SUSTAINABILITY_SAGE"],
      B: ["EARTH_GUARDIAN", "ECO_CATALYST"],
      C: ["GREEN_APPRENTICE"],
      "": ["GREEN_APPRENTICE"]
    }
  },
  transport: {
    primary: {
      A: ["ECO_VISIONARY", "EARTH_GUARDIAN"],
      B: ["ECO_CATALYST"],
      C: ["SUSTAINABILITY_SAGE"],
      D: ["GREEN_APPRENTICE"],
      "": ["GREEN_APPRENTICE"]
    },
    carProfile: {
      A: ["ECO_VISIONARY"],
      B: ["EARTH_GUARDIAN"],
      C: ["ECO_CATALYST"],
      D: ["SUSTAINABILITY_SAGE"],
      E: ["GREEN_APPRENTICE"],
      "": ["GREEN_APPRENTICE"]
    }
  },
  food: {
    diet: {
      VEGAN: ["ECO_VISIONARY"],
      VEGETARIAN: ["EARTH_GUARDIAN"],
      FLEXITARIAN: ["ECO_CATALYST"],
      MEAT_MODERATE: ["SUSTAINABILITY_SAGE"],
      MEAT_HEAVY: ["GREEN_APPRENTICE"]
    },
    plateProfile: {
      A: ["ECO_VISIONARY", "EARTH_GUARDIAN"],
      B: ["ECO_CATALYST", "SUSTAINABILITY_SAGE"],
      C: ["GREEN_APPRENTICE"],
      "": ["GREEN_APPRENTICE"]
    }
  },
  waste: {
    prevention: {
      A: ["ECO_VISIONARY"],
      B: ["EARTH_GUARDIAN", "ECO_CATALYST"],
      C: ["SUSTAINABILITY_SAGE"],
      D: ["GREEN_APPRENTICE"],
      "": ["GREEN_APPRENTICE"]
    },
    management: {
      A: ["ECO_VISIONARY", "EARTH_GUARDIAN"],
      B: ["ECO_CATALYST", "SUSTAINABILITY_SAGE"],
      C: ["GREEN_APPRENTICE"],
      "": ["GREEN_APPRENTICE"]
    }
  },
  airQuality: {
    monitoring: {
      A: ["ECO_VISIONARY", "EARTH_GUARDIAN"],
      B: ["ECO_CATALYST"],
      C: ["SUSTAINABILITY_SAGE"],
      D: ["GREEN_APPRENTICE"],
      "": ["GREEN_APPRENTICE"]
    },
    impact: {
      A: ["ECO_VISIONARY"],
      B: ["EARTH_GUARDIAN", "ECO_CATALYST"],
      C: ["SUSTAINABILITY_SAGE"],
      D: ["GREEN_APPRENTICE"],
      "": ["GREEN_APPRENTICE"]
    }
  }
};

// Personality hierarchy for tiebreaking
const personalityHierarchy = [
  "ECO_VISIONARY",
  "EARTH_GUARDIAN",
  "ECO_CATALYST",
  "SUSTAINABILITY_SAGE",
  "GREEN_APPRENTICE"
];

export const determineEcoPersonality = (state: any) => {
  const tally: Record<string, number> = {};
  
  // Initialize tally
  personalityHierarchy.forEach(p => tally[p] = 0);

  // Process home energy responses
  if (state.homeEfficiency) {
    personalityMappings.homeEnergy.efficiency[state.homeEfficiency]?.forEach(p => tally[p]++);
  }
  if (state.energyManagement) {
    personalityMappings.homeEnergy.management[state.energyManagement]?.forEach(p => tally[p]++);
  }

  // Process transport responses
  if (state.primaryTransportMode) {
    personalityMappings.transport.primary[state.primaryTransportMode]?.forEach(p => tally[p]++);
  }
  if (state.carProfile) {
    personalityMappings.transport.carProfile[state.carProfile]?.forEach(p => tally[p]++);
  }

  // Process food responses
  if (state.dietType) {
    personalityMappings.food.diet[state.dietType]?.forEach(p => tally[p]++);
  }
  if (state.plateProfile) {
    personalityMappings.food.plateProfile[state.plateProfile]?.forEach(p => tally[p]++);
  }

  // Process waste responses
  if (state.waste?.wastePrevention) {
    personalityMappings.waste.prevention[state.waste.wastePrevention]?.forEach(p => tally[p]++);
  }
  if (state.waste?.wasteManagement) {
    personalityMappings.waste.management[state.waste.wasteManagement]?.forEach(p => tally[p]++);
  }

  // Process air quality responses
  if (state.airQuality?.aqiMonitoring) {
    personalityMappings.airQuality.monitoring[state.airQuality.aqiMonitoring]?.forEach(p => tally[p]++);
  }
  if (state.airQuality?.airQualityImpact) {
    personalityMappings.airQuality.impact[state.airQuality.airQualityImpact]?.forEach(p => tally[p]++);
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

  // If tie, use hierarchy to determine final personality
  let finalPersonality = topPersonalities.reduce((prev, current) => {
    const prevIndex = personalityHierarchy.indexOf(prev);
    const currentIndex = personalityHierarchy.indexOf(current);
    return prevIndex < currentIndex ? prev : current;
  });

  // Determine dominant category and subCategory
  const categoryScores = {
    home: (state.homeEfficiency === 'A' ? 3 : state.homeEfficiency === 'B' ? 2 : 1) +
          (state.energyManagement === 'A' ? 3 : state.energyManagement === 'B' ? 2 : 1),
    transport: (state.primaryTransportMode === 'A' ? 3 : state.primaryTransportMode === 'B' ? 2 : 1) +
               (state.carProfile === 'A' ? 3 : state.carProfile === 'B' ? 2 : 1),
    food: (state.dietType === 'VEGAN' ? 3 : state.dietType === 'VEGETARIAN' ? 2 : 1) +
          (state.plateProfile === 'A' ? 3 : state.plateProfile === 'B' ? 2 : 1),
    waste: (state.waste?.wastePrevention === 'A' ? 3 : state.waste?.wastePrevention === 'B' ? 2 : 1) +
           (state.waste?.wasteManagement === 'A' ? 3 : state.waste?.wasteManagement === 'B' ? 2 : 1)
  };

  const dominantCategory = Object.entries(categoryScores)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  let subCategory = '';
  switch(dominantCategory) {
    case 'home':
      subCategory = categoryScores.home > 4 ? 'Energy Efficiency Expert' : 'Eco Homebody';
      break;
    case 'transport':
      subCategory = categoryScores.transport > 4 ? 'Green Mobility Champion' : 'Green Traveler';
      break;
    case 'food':
      subCategory = categoryScores.food > 4 ? 'Sustainable Food Pioneer' : 'Conscious Consumer';
      break;
    case 'waste':
      subCategory = categoryScores.waste > 4 ? 'Zero Waste Champion' : 'Zero Waste Warrior';
      break;
  }

  const personalityType = EcoPersonalityTypes[finalPersonality as keyof typeof EcoPersonalityTypes];
  return {
    ...personalityType,
    subCategory,
    tally
  };
};

export const getOutfitForPersonality = (personalityTitle: string): string => {
  switch (personalityTitle) {
    case 'Eco Visionary':
      return 'eco-warrior';
    case "Earth Guardian":
      return 'solar-powered';
    default:
      return 'recycled-denim';
  }
};

export const getAccessoryForPersonality = (personalityTitle: string): string => {
  switch (personalityTitle) {
    case 'Eco Visionary':
      return 'leaf-halo';
    case "Earth Guardian":
      return 'solar-crown';
    default:
      return 'eco-badge';
  }
};

export const getBackgroundForCategory = (category: string): string => {
  switch (category) {
    case 'food':
    case 'waste':
      return 'forest';
    case 'transport':
      return 'mountain';
    case 'home':
      return 'ocean';
    default:
      return 'forest';
  }
}; 