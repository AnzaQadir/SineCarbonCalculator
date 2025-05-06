import { CalculatorState } from '../types/calculator';

export interface PersonalityResult {
  personality: string;
  emoji: string;
  story: string;
  avatarSuggestion: string;
  nextAction: string;
  badge: string;
  champion: string;
  powerMoves: string[];
  subCategory: string;
  tally: Record<string, number>;
}

export async function calculatePersonality(state: CalculatorState): Promise<PersonalityResult> {
  // Calculate scores for each category
  const scores = {
    home: calculateHomeScore(state),
    transport: calculateTransportScore(state),
    food: calculateFoodScore(state),
    waste: calculateWasteScore(state)
  };

  // Determine personality based on scores
  const personality = determinePersonality(scores);

  // Generate story and other details
  return {
    personality: personality.title,
    emoji: personality.emoji,
    story: generateStory(personality, scores),
    avatarSuggestion: generateAvatarSuggestion(personality),
    nextAction: generateNextAction(personality, scores),
    badge: personality.badge,
    champion: personality.champion,
    powerMoves: personality.powerMoves,
    subCategory: personality.subCategory,
    tally: scores
  };
}

function calculateHomeScore(state: CalculatorState): number {
  let score = 0;
  
  // Home efficiency
  if (state.homeEfficiency === 'A') score += 3;
  else if (state.homeEfficiency === 'B') score += 2;
  else if (state.homeEfficiency === 'C') score += 1;

  // Energy management
  if (state.energyManagement === 'A') score += 3;
  else if (state.energyManagement === 'B') score += 2;
  else if (state.energyManagement === 'C') score += 1;

  // Renewable energy
  if (state.usesRenewableEnergy) score += 2;

  // Energy efficiency upgrades
  if (state.hasEnergyEfficiencyUpgrades) score += 2;

  return score;
}

function calculateTransportScore(state: CalculatorState): number {
  let score = 0;

  // Primary transport mode
  if (state.primaryTransportMode === 'A') score += 3; // Walk/Bike
  else if (state.primaryTransportMode === 'B') score += 2; // Public transit
  else if (state.primaryTransportMode === 'C') score += 1; // Car

  // Car profile
  if (state.carProfile === 'A') score += 3; // Electric
  else if (state.carProfile === 'B') score += 2; // Hybrid
  else if (state.carProfile === 'C') score += 1; // Small car

  return score;
}

function calculateFoodScore(state: CalculatorState): number {
  let score = 0;

  // Diet type
  switch (state.dietType) {
    case 'VEGAN':
      score += 3;
      break;
    case 'VEGETARIAN':
      score += 2;
      break;
    case 'FLEXITARIAN':
      score += 1;
      break;
  }

  // Local food
  if (state.buysLocalFood) score += 1;

  // Sustainable diet
  if (state.followsSustainableDiet) score += 1;

  return score;
}

function calculateWasteScore(state: CalculatorState): number {
  let score = 0;

  // Recycling percentage
  if (state.waste.recyclingPercentage > 75) score += 3;
  else if (state.waste.recyclingPercentage > 50) score += 2;
  else if (state.waste.recyclingPercentage > 25) score += 1;

  // Waste prevention
  if (state.waste.wastePrevention === 'A') score += 3;
  else if (state.waste.wastePrevention === 'B') score += 2;
  else if (state.waste.wastePrevention === 'C') score += 1;

  // Waste management
  if (state.waste.wasteManagement === 'A') score += 3;
  else if (state.waste.wasteManagement === 'B') score += 2;
  else if (state.waste.wasteManagement === 'C') score += 1;

  return score;
}

function determinePersonality(scores: Record<string, number>) {
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  
  if (totalScore >= 15) {
    return {
      title: "Sustainability Slayer",
      emoji: "🌍",
      badge: "Eco Warrior",
      champion: "Climate Champion",
      powerMoves: [
        "Leading community initiatives",
        "Advocating for policy change",
        "Mentoring others"
      ],
      subCategory: "Leader"
    };
  } else if (totalScore >= 12) {
    return {
      title: "Planet's Main Character",
      emoji: "🌱",
      badge: "Green Innovator",
      champion: "Sustainability Pioneer",
      powerMoves: [
        "Innovating sustainable solutions",
        "Inspiring others",
        "Creating positive change"
      ],
      subCategory: "Innovator"
    };
  } else if (totalScore >= 9) {
    return {
      title: "Sustainability Soft Launch",
      emoji: "🌿",
      badge: "Eco Explorer",
      champion: "Green Learner",
      powerMoves: [
        "Learning sustainable practices",
        "Making conscious choices",
        "Building eco-friendly habits"
      ],
      subCategory: "Learner"
    };
  } else {
    return {
      title: "Eco in Progress",
      emoji: "🌳",
      badge: "Green Starter",
      champion: "Sustainability Beginner",
      powerMoves: [
        "Starting the journey",
        "Taking first steps",
        "Learning basics"
      ],
      subCategory: "Beginner"
    };
  }
}

function generateStory(personality: any, scores: Record<string, number>): string {
  const topCategory = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)[0][0];
    
  return `As a ${personality.title}, you're making waves in the sustainability world! Your strongest area is ${topCategory}, where you're leading by example. Keep up the amazing work and inspire others to join the movement!`;
}

function generateAvatarSuggestion(personality: any): string {
  return `An avatar that represents ${personality.title.toLowerCase()} with ${personality.emoji} elements`;
}

function generateNextAction(personality: any, scores: Record<string, number>): string {
  const weakestCategory = Object.entries(scores)
    .sort(([,a], [,b]) => a - b)[0][0];
    
  return `Focus on improving your ${weakestCategory} impact to level up your sustainability game!`;
} 