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
}

export const EcoPersonalityTypes: Record<string, EcoPersonalityType> = {
  SUSTAINABILITY_SLAYER: {
    title: "Sustainability Slayer",
    badge: "🌍",
    description: "You're a champion of eco-friendly living, consistently making choices that benefit the planet.",
    color: "from-green-600 to-green-500",
    points: "8/8 Points",
    strengths: [
      "Leading by example in sustainable practices",
      "Comprehensive understanding of environmental impact",
      "Influencing others through positive action"
    ],
    nextSteps: [
      "Start a community sustainability initiative",
      "Mentor others in eco-friendly practices",
      "Advocate for environmental policies"
    ]
  },
  PLANETS_MAIN_CHARACTER: {
    title: "Planet's Main Character",
    badge: "🌀",
    description: "You're making significant strides in sustainable living with room to grow into a true environmental leader.",
    color: "from-blue-600 to-blue-500",
    points: "6/8 Points",
    strengths: [
      "Strong commitment to sustainable practices",
      "Active engagement in environmental initiatives",
      "Regular sustainable choices"
    ],
    nextSteps: [
      "Expand your influence in the community",
      "Explore advanced sustainability practices",
      "Share your journey to inspire others"
    ]
  },
  SUSTAINABILITY_SOFT_LAUNCH: {
    title: "Sustainability Soft Launch",
    badge: "🌱",
    description: "You're making conscious efforts to live more sustainably and building momentum for bigger changes.",
    color: "from-teal-600 to-teal-500",
    points: "4/8 Points",
    strengths: [
      "Growing awareness of environmental impact",
      "Implementing basic sustainable practices",
      "Openness to eco-friendly alternatives"
    ],
    nextSteps: [
      "Establish more consistent eco-habits",
      "Learn about advanced sustainability practices",
      "Connect with like-minded individuals"
    ]
  },
  KIND_OF_CONSCIOUS: {
    title: "Kind of Conscious, Kind of Confused",
    badge: "🍃",
    description: "You're aware of environmental issues and making some efforts, but could use more direction and consistency.",
    color: "from-yellow-500 to-yellow-400",
    points: "3/8 Points",
    strengths: [
      "Basic environmental awareness",
      "Some sustainable practices in place",
      "Interest in improvement"
    ],
    nextSteps: [
      "Establish daily eco-friendly routines",
      "Learn more about environmental impact",
      "Start with simple sustainable swaps"
    ]
  },
  ECO_IN_PROGRESS: {
    title: "Eco in Progress…",
    badge: "☁️",
    description: "You're at the beginning of your sustainability journey with lots of potential for positive change.",
    color: "from-orange-500 to-orange-400",
    points: "2/8 Points",
    strengths: [
      "Open to learning",
      "Taking first steps",
      "Recognizing need for change"
    ],
    nextSteps: [
      "Start with one sustainable habit",
      "Learn about basic environmental issues",
      "Find easy eco-friendly alternatives"
    ]
  },
  DOING_NOTHING: {
    title: "DND: Doing Nothing for the Planet",
    badge: "💤",
    description: "Your current lifestyle has significant room for improvement in terms of environmental impact.",
    color: "from-red-500 to-red-400",
    points: "1/8 Points",
    strengths: [
      "Potential for significant impact",
      "Room for easy improvements",
      "Opportunity for fresh start"
    ],
    nextSteps: [
      "Start with simple eco-friendly changes",
      "Learn about environmental basics",
      "Track your daily habits"
    ]
  },
  CLIMATE_SNOOZER: {
    title: "Certified Climate Snoozer",
    badge: "❌",
    description: "It's time to wake up to environmental issues and start making positive changes.",
    color: "from-gray-600 to-gray-500",
    points: "0/8 Points",
    strengths: [
      "Opportunity for major improvement",
      "Clean slate for new habits",
      "Potential for immediate impact"
    ],
    nextSteps: [
      "Begin with basic awareness",
      "Make one eco-friendly change",
      "Learn about environmental impact"
    ]
  }
};

// Question-Answer to Personality Mappings
const personalityMappings = {
  homeEnergy: {
    efficiency: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      C: ["ECO_IN_PROGRESS", "DOING_NOTHING"],
      "": ["CLIMATE_SNOOZER"]
    },
    management: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH"],
      C: ["ECO_IN_PROGRESS", "DOING_NOTHING"],
      "": ["CLIMATE_SNOOZER"]
    }
  },
  transport: {
    primary: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH"],
      C: ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"],
      D: ["DOING_NOTHING", "CLIMATE_SNOOZER"],
      "": ["CLIMATE_SNOOZER"]
    },
    carProfile: {
      A: ["SUSTAINABILITY_SLAYER"],
      B: ["PLANETS_MAIN_CHARACTER"],
      C: ["SUSTAINABILITY_SOFT_LAUNCH"],
      D: ["KIND_OF_CONSCIOUS"],
      E: ["ECO_IN_PROGRESS", "DOING_NOTHING"],
      "": ["CLIMATE_SNOOZER"]
    }
  },
  food: {
    diet: {
      VEGAN: ["SUSTAINABILITY_SLAYER"],
      VEGETARIAN: ["PLANETS_MAIN_CHARACTER"],
      FLEXITARIAN: ["SUSTAINABILITY_SOFT_LAUNCH"],
      MEAT_MODERATE: ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"],
      MEAT_HEAVY: ["DOING_NOTHING", "CLIMATE_SNOOZER"]
    },
    plateProfile: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      C: ["ECO_IN_PROGRESS", "DOING_NOTHING"],
      "": ["CLIMATE_SNOOZER"]
    }
  },
  waste: {
    prevention: {
      A: ["SUSTAINABILITY_SLAYER"],
      B: ["PLANETS_MAIN_CHARACTER", "SUSTAINABILITY_SOFT_LAUNCH"],
      C: ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"],
      D: ["DOING_NOTHING", "CLIMATE_SNOOZER"],
      "": ["CLIMATE_SNOOZER"]
    },
    management: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      C: ["ECO_IN_PROGRESS", "DOING_NOTHING"],
      "": ["CLIMATE_SNOOZER"]
    }
  },
  airQuality: {
    monitoring: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH"],
      C: ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"],
      D: ["DOING_NOTHING", "CLIMATE_SNOOZER"],
      "": ["CLIMATE_SNOOZER"]
    },
    impact: {
      A: ["SUSTAINABILITY_SLAYER"],
      B: ["PLANETS_MAIN_CHARACTER", "SUSTAINABILITY_SOFT_LAUNCH"],
      C: ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"],
      D: ["DOING_NOTHING", "CLIMATE_SNOOZER"],
      "": ["CLIMATE_SNOOZER"]
    }
  }
};

// Personality hierarchy for tiebreaking
const personalityHierarchy = [
  "SUSTAINABILITY_SLAYER",
  "PLANETS_MAIN_CHARACTER",
  "SUSTAINABILITY_SOFT_LAUNCH",
  "KIND_OF_CONSCIOUS",
  "ECO_IN_PROGRESS",
  "DOING_NOTHING",
  "CLIMATE_SNOOZER"
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
    case 'Sustainability Slayer':
      return 'eco-warrior';
    case "Planet's Main Character":
      return 'solar-powered';
    default:
      return 'recycled-denim';
  }
};

export const getAccessoryForPersonality = (personalityTitle: string): string => {
  switch (personalityTitle) {
    case 'Sustainability Slayer':
      return 'leaf-halo';
    case "Planet's Main Character":
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