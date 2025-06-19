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
    },
    homeScale: {
      "1": ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      "2": ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      "3": ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      "4": ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"],
      "5": ["ECO_IN_PROGRESS", "DOING_NOTHING"],
      "6": ["DOING_NOTHING", "CLIMATE_SNOOZER"],
      "7+": ["DOING_NOTHING", "CLIMATE_SNOOZER"]
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
    },
    longDistance: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH"],
      C: ["KIND_OF_CONSCIOUS"],
      D: ["DOING_NOTHING", "CLIMATE_SNOOZER"],
      E: ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"]
    }
  },
  food: {
    dietType: {
      PLANT_BASED: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      VEGETARIAN: ["PLANETS_MAIN_CHARACTER", "SUSTAINABILITY_SOFT_LAUNCH"],
      FLEXITARIAN: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      MODERATE_MEAT: ["ECO_IN_PROGRESS", "DOING_NOTHING", "CLIMATE_SNOOZER"]
    },
    foodSource: {
      LOCAL_SEASONAL: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      MIXED: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      CONVENTIONAL: ["ECO_IN_PROGRESS", "DOING_NOTHING", "CLIMATE_SNOOZER"]
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
    },
    smartShopping: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      C: ["ECO_IN_PROGRESS", "DOING_NOTHING"]
    },
    dailyWaste: {
      A: ["SUSTAINABILITY_SLAYER"],
      B: ["PLANETS_MAIN_CHARACTER", "SUSTAINABILITY_SOFT_LAUNCH"],
      C: ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"],
      D: ["DOING_NOTHING", "CLIMATE_SNOOZER"]
    },
    wastePrevention: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      C: ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"],
      D: ["DOING_NOTHING", "CLIMATE_SNOOZER"]
    },
    repairOrReplace: {
      true: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      false: ["DOING_NOTHING", "CLIMATE_SNOOZER"]
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
  },
  clothing: {
    wardrobeImpact: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      C: ["ECO_IN_PROGRESS", "DOING_NOTHING", "CLIMATE_SNOOZER"],
      "": ["CLIMATE_SNOOZER"]
    },
    mindfulUpgrades: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      C: ["ECO_IN_PROGRESS", "DOING_NOTHING", "CLIMATE_SNOOZER"],
      "": ["CLIMATE_SNOOZER"]
    },
    consumptionFrequency: {
      A: ["DOING_NOTHING", "CLIMATE_SNOOZER"],
      B: ["KIND_OF_CONSCIOUS", "ECO_IN_PROGRESS"],
      C: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      D: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"]
    },
    brandLoyalty: {
      A: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"],
      B: ["SUSTAINABILITY_SOFT_LAUNCH", "KIND_OF_CONSCIOUS"],
      C: ["ECO_IN_PROGRESS", "DOING_NOTHING"],
      D: ["SUSTAINABILITY_SLAYER", "PLANETS_MAIN_CHARACTER"]
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
    personalityMappings.food.dietType[state.dietType]?.forEach(p => tally[p]++);
  }
  if (state.foodSource) {
    personalityMappings.food.foodSource[state.foodSource]?.forEach(p => tally[p]++);
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

  // Process clothing responses
  if (state.clothing?.wardrobeImpact) {
    personalityMappings.clothing.wardrobeImpact[state.clothing.wardrobeImpact]?.forEach(p => tally[p]++);
  }
  if (state.clothing?.mindfulUpgrades) {
    personalityMappings.clothing.mindfulUpgrades[state.clothing.mindfulUpgrades]?.forEach(p => tally[p]++);
  }
  if (state.clothing?.consumptionFrequency) {
    personalityMappings.clothing.consumptionFrequency[state.clothing.consumptionFrequency]?.forEach(p => tally[p]++);
  }
  if (state.clothing?.brandLoyalty) {
    personalityMappings.clothing.brandLoyalty[state.clothing.brandLoyalty]?.forEach(p => tally[p]++);
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
    food: (state.dietType === 'PLANT_BASED' ? 3 : state.dietType === 'VEGETARIAN' ? 2 : state.dietType === 'FLEXITARIAN' ? 1 : 0) +
          (state.foodSource === 'LOCAL_SEASONAL' ? 3 : state.foodSource === 'MIXED' ? 2 : state.foodSource === 'CONVENTIONAL' ? 1 : 0),
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

// Score mapping logic
function calculateTotalScoreFromResponses(responses: Record<string, Record<string, number>>): number {
  let total = 0;
  for (const category of Object.values(responses)) {
    for (const score of Object.values(category)) {
      total += score;
    }
  }
  return total;
}

function getPersonalityTypeFromScore(score: number): keyof typeof PersonalityDetails {
  if (score >= 16) return "Sustainability Slayer";
  if (score >= 13) return "Planet's Main Character";
  if (score >= 10) return "Sustainability Soft Launch";
  if (score >= 7) return "Kind of Conscious, Kind of Confused";
  if (score >= 5) return "Eco in Progress";
  if (score >= 3) return "Doing Nothing for the Planet";
  return "Certified Climate Snoozer";
}

// --- Dynamic, score-based eco-personality assignment ---

export const PersonalityDetails = {
  "Sustainability Slayer": {
    emoji: "🌍",
    story: `You are a Sustainability Slayer! Your lifestyle is a beacon of hope for the planet. Every choice you make is rooted in deep environmental awareness and a drive to inspire others. You lead by example, showing that a sustainable life is not only possible, but rewarding and impactful.\n\nYour journey is one of mastery—your home, habits, and heart are all aligned with the planet's needs. Others look to you for guidance, and you're always ready to take on the next big eco-challenge!`,
    avatar: "A radiant eco-hero, surrounded by lush forests and a sparkling clean river, with a golden aura.",
    nextAction: "Mentor someone new to sustainability or start a community green project.",
    badge: "First Meatless Week",
    champion: "Greta Thunberg – for her relentless climate activism.",
    powerMoves: [
      'Deep knowledge of sustainable practices',
      'Consistent, intentional behavior',
      'Leading by example in your community'
    ],
  },
  "Planet's Main Character": {
    emoji: "🌀",
    story: `You are Planet's Main Character! You're making significant strides in sustainable living, and your actions are shaping a better world. You're not just a participant—you're a protagonist in the story of our planet's future.\n\nYour journey is inspiring, and you're on the verge of becoming a true eco-leader. Keep pushing boundaries and sharing your story!`,
    avatar: "A confident explorer with a reusable water bottle, standing in a vibrant meadow with wind turbines in the background.",
    nextAction: "Switch to a renewable energy provider or organize a local clean-up.",
    badge: "Conscious Shopper",
    champion: "Jane Goodall – for her lifelong dedication to conservation.",
    powerMoves: [
      'Deep commitment to sustainable practices',
      'Active engagement in environmental initiatives',
      'Regular sustainable choices'
    ],
  },
  "Sustainability Soft Launch": {
    emoji: "🌱",
    story: `You're in your Sustainability Soft Launch! You're making conscious efforts and building momentum for bigger changes. Every step you take is a seed for a greener tomorrow.\n\nYou're learning, growing, and your impact is starting to show. Stay curious and keep nurturing your eco-habits!`,
    avatar: "A cheerful character tending a small garden, with a compost bin and solar lights.",
    nextAction: "Try a plant-based meal or start composting at home.",
    badge: "Compost Starter",
    champion: "Immy Lucas (Sustainably Vegan) – for practical low-impact living.",
    powerMoves: [
      'Growing awareness of environmental impact',
      'Implementing basic sustainable practices',
      'Openness to eco-friendly alternatives'
    ],
  },
  "Kind of Conscious, Kind of Confused": {
    emoji: "🍃",
    story: `You're Kind of Conscious, Kind of Confused. You're aware of environmental issues and making some efforts, but there's room for more direction and consistency.\n\nYou're on the right path—just keep learning and experimenting with new habits!`,
    avatar: "A thoughtful person with a reusable tote, surrounded by both green and gray areas, symbolizing transition.",
    nextAction: "Replace single-use plastics with reusables this week.",
    badge: "Plastic-Free Day",
    champion: "Lauren Singer – for pioneering the zero-waste movement.",
    powerMoves: [
      'Basic environmental awareness',
      'Some sustainable practices in place',
      'Interest in improvement'
    ],
  },
  "Eco in Progress": {
    emoji: "☁️",
    story: `You're Eco in Progress… You're at the beginning of your sustainability journey, with lots of potential for positive change.\n\nEvery small step counts—celebrate your progress and keep going!`,
    avatar: "A hopeful character planting their first tree, with a partly cloudy sky and a few green sprouts.",
    nextAction: "Start recycling or track your energy use for a week.",
    badge: "First Recycle",
    champion: "Boyan Slat – for innovative ocean cleanup efforts.",
    powerMoves: [
      'Open to learning',
      'Taking first steps',
      'Recognizing need for change'
    ],
  },
  "Doing Nothing for the Planet": {
    emoji: "💤",
    story: `You're Doing Nothing for the Planet (for now). Your current lifestyle has significant room for improvement, but that means you have the power to make a big difference!\n\nStart with one simple change and watch your impact grow.`,
    avatar: "A sleepy character on a gray couch, with a single plant in the background, ready to wake up.",
    nextAction: "Switch off unused lights or try a meatless meal.",
    badge: "First Green Step",
    champion: "David Attenborough – for awakening millions to nature's wonders.",
    powerMoves: [
      'Potential for significant impact',
      'Room for easy improvements',
      'Opportunity for fresh start'
    ],
  },
  "Certified Climate Snoozer": {
    emoji: "❌",
    story: `You're a Certified Climate Snoozer. It's time to wake up to environmental issues and start making positive changes.\n\nThe good news? Every journey starts with a single step.`,
    avatar: "A character with an alarm clock, surrounded by smog, but a sunrise is visible in the distance.",
    nextAction: "Read one article about climate change and share it with a friend.",
    badge: "Awareness Unlocked",
    champion: "Katharine Hayhoe – for climate science communication.",
    powerMoves: [
      'Opportunity for major improvement',
      'Clean slate for new habits',
      'Potential for immediate impact'
    ],
  }
};

/**
 * Assigns eco-personality and returns all required output fields.
 * @param responses - User responses with scores (0–2 per answer)
 */
export function assignEcoPersonality(responses: Record<string, Record<string, number>>) {
  const totalScore = calculateTotalScoreFromResponses(responses);
  const personalityType = getPersonalityTypeFromScore(totalScore);
  const details = PersonalityDetails[personalityType];
  return {
    totalScore,
    personality: personalityType,
    emoji: details.emoji,
    story: details.story,
    avatarSuggestion: details.avatar,
    nextAction: details.nextAction,
    badge: details.badge,
    champion: details.champion,
    powerMoves: details.powerMoves
  };
} 