import { PersonalityDetails } from './ecoPersonality';

export interface StoryCard {
  title: string;
  content: string;
  emoji?: string;
  stats?: string;
  isNarrative?: boolean;
}

interface StoryInput {
  name: string;
  ecoPersonality: string;
  co2Saved: number;
  topCategory: string;
  newHabits: string[];
  impactEquivalent: string;
  nextStep: string;
  badge: string;
  score: number;
  categoryEmissions: {
    home: number;
    transport: number;
    food: number;
    waste: number;
  };
}

export interface NarrativeStory {
  title: string;
  content: string;
  emotionalTrigger: string;
  callToAction: string;
}

interface Achievement {
  title: string;
  description: string;
  emoji: string;
  level: 'bronze' | 'silver' | 'gold';
}

interface CategoryAchievement extends Achievement {
  threshold: number;
}

interface Recommendation {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impact: 'low' | 'medium' | 'high';
  emoji: string;
}

const getPersonalityTone = (personality: string): string => {
  switch (personality) {
    case "Sustainability Slayer":
      return "empowering and bold";
    case "Planet's Main Character":
      return "dramatic and heroic";
    case "Sustainability Soft Launch":
      return "hopeful and curious";
    case "Kind of Conscious, Kind of Confused":
      return "witty and reflective";
    case "Eco in Progress":
      return "gentle and honest";
    case "Doing Nothing for the Planet":
      return "awakening and calm";
    case "Certified Climate Snoozer":
      return "bold and disruptive";
    default:
      return "inspiring and motivational";
  }
};

const getPersonalityNarrative = (personality: string): string => {
  switch (personality) {
    case "Sustainability Slayer":
      return "You led the charge with every choice.";
    case "Planet's Main Character":
      return "You are the plot twist the planet needed.";
    case "Sustainability Soft Launch":
      return "You're blooming into a new lifestyle.";
    case "Kind of Conscious, Kind of Confused":
      return "Okay, not perfect — but trying!";
    case "Eco in Progress":
      return "Starting small, growing stronger.";
    case "Doing Nothing for the Planet":
      return "It's okay. You've hit reset now.";
    case "Certified Climate Snoozer":
      return "No more sleepwalking through the climate era.";
    default:
      return "Every choice you make writes a new chapter in our planet's story.";
  }
};

const getCategoryEmoji = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'home':
      return '🏠';
    case 'transport':
      return '🚲';
    case 'food':
      return '🍽️';
    case 'waste':
      return '♻️';
    case 'clothing':
      return '👕';
    default:
      return '🌍';
  }
};

const getNarrativeTone = (personality: string): string => {
  switch (personality) {
    case "Sustainability Slayer":
      return "Empowering & Noble";
    case "Planet's Main Character":
      return "Dramatic & Inspiring";
    case "Sustainability Soft Launch":
      return "Hopeful & Curious";
    case "Kind of Conscious, Kind of Confused":
      return "Reflective & Witty";
    case "Eco in Progress":
      return "Gentle & Encouraging";
    case "Doing Nothing for the Planet":
      return "Awakening & Honest";
    case "Certified Climate Snoozer":
      return "Bold & Jarring";
    default:
      return "Inspiring & Motivational";
  }
};

const getEmotionalTrigger = (personality: string): string => {
  switch (personality) {
    case "Sustainability Slayer":
      return "Pride & Legacy";
    case "Planet's Main Character":
      return "Ambition & Influence";
    case "Sustainability Soft Launch":
      return "Possibility & Growth";
    case "Kind of Conscious, Kind of Confused":
      return "Humor & Honesty";
    case "Eco in Progress":
      return "Safety & Support";
    case "Doing Nothing for the Planet":
      return "Acceptance & Reset";
    case "Certified Climate Snoozer":
      return "Disruption & Alarm";
    default:
      return "Hope & Motivation";
  }
};

const getImpactComparison = (co2: number): string => {
  if (co2 >= 10) return "planting a small forest";
  if (co2 >= 5) return "taking 100 cars off the road for a day";
  if (co2 >= 2) return "saving enough energy to power 10 homes for a month";
  if (co2 >= 1) return "planting 50 trees";
  return "taking the first step towards a greener future";
};

const generateAchievements = (input: StoryInput): Achievement[] => {
  const achievements: Achievement[] = [];

  // Category-specific achievements
  const categoryAchievements: Record<string, CategoryAchievement[]> = {
    home: [
      { threshold: 2, title: "Home Hero", description: "Mastering sustainable living at home", emoji: "🏠", level: "bronze" },
      { threshold: 4, title: "Eco Home Master", description: "Creating an eco-friendly sanctuary", emoji: "🏡", level: "silver" },
      { threshold: 6, title: "Sustainable Living Legend", description: "Your home is a beacon of sustainability", emoji: "⭐", level: "gold" }
    ],
    transport: [
      { threshold: 2, title: "Green Commuter", description: "Choosing planet-friendly transport", emoji: "🚲", level: "bronze" },
      { threshold: 4, title: "Transport Transformer", description: "Leading the way in eco-travel", emoji: "🚊", level: "silver" },
      { threshold: 6, title: "Mobility Master", description: "A champion of sustainable transport", emoji: "🌟", level: "gold" }
    ],
    food: [
      { threshold: 2, title: "Conscious Consumer", description: "Making sustainable food choices", emoji: "🥗", level: "bronze" },
      { threshold: 4, title: "Food Footprint Fighter", description: "Minimizing food-related emissions", emoji: "🌱", level: "silver" },
      { threshold: 6, title: "Sustainable Food Sage", description: "Mastering eco-friendly eating", emoji: "👨‍🌾", level: "gold" }
    ],
    waste: [
      { threshold: 2, title: "Waste Warrior", description: "Taking steps to reduce waste", emoji: "♻️", level: "bronze" },
      { threshold: 4, title: "Zero Waste Hero", description: "Championing waste reduction", emoji: "🗑️", level: "silver" },
      { threshold: 6, title: "Waste-Free Wonder", description: "Leading the zero-waste movement", emoji: "✨", level: "gold" }
    ]
  };

  // Award achievements based on category emissions reductions
  Object.entries(input.categoryEmissions).forEach(([category, emission]) => {
    const categoryAchievs = categoryAchievements[category];
    if (categoryAchievs) {
      const achievement = [...categoryAchievs].reverse().find(a => emission >= a.threshold);
      if (achievement) {
        achievements.push({
          title: achievement.title,
          description: achievement.description,
          emoji: achievement.emoji,
          level: achievement.level
        });
      }
    }
  });

  // Overall impact achievements
  if (input.co2Saved >= 10) {
    achievements.push({
      title: "Climate Champion",
      description: "Making a significant impact on CO2 reduction",
      emoji: "🌍",
      level: "gold"
    });
  } else if (input.co2Saved >= 5) {
    achievements.push({
      title: "Carbon Crusher",
      description: "Successfully reducing your carbon footprint",
      emoji: "👣",
      level: "silver"
    });
  } else if (input.co2Saved >= 2) {
    achievements.push({
      title: "Green Beginner",
      description: "Starting your journey to sustainability",
      emoji: "🌱",
      level: "bronze"
    });
  }

  return achievements;
};

const generatePersonalizedRecommendations = (input: StoryInput): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Find the category with the highest emissions
  const sortedCategories = Object.entries(input.categoryEmissions)
    .sort(([,a], [,b]) => b - a);
  
  const categoryRecommendations: Record<string, Recommendation[]> = {
    home: [
      {
        title: "Energy-Efficient Lighting",
        description: "Switch to LED bulbs throughout your home",
        difficulty: "easy",
        impact: "medium",
        emoji: "💡"
      },
      {
        title: "Smart Thermostat",
        description: "Install a smart thermostat to optimize heating and cooling",
        difficulty: "medium",
        impact: "high",
        emoji: "🌡️"
      },
      {
        title: "Home Solar Installation",
        description: "Consider installing solar panels for renewable energy",
        difficulty: "hard",
        impact: "high",
        emoji: "☀️"
      }
    ],
    transport: [
      {
        title: "Public Transit Trial",
        description: "Try using public transportation for your daily commute",
        difficulty: "easy",
        impact: "medium",
        emoji: "🚌"
      },
      {
        title: "Bike Commuting",
        description: "Start biking for short-distance trips",
        difficulty: "medium",
        impact: "high",
        emoji: "🚲"
      },
      {
        title: "Electric Vehicle Switch",
        description: "Consider switching to an electric vehicle",
        difficulty: "hard",
        impact: "high",
        emoji: "🔌"
      }
    ],
    food: [
      {
        title: "Meatless Mondays",
        description: "Start with one meat-free day per week",
        difficulty: "easy",
        impact: "medium",
        emoji: "🥗"
      },
      {
        title: "Local Food Challenge",
        description: "Source 50% of your food from local producers",
        difficulty: "medium",
        impact: "high",
        emoji: "🌾"
      },
      {
        title: "Plant-Based Diet",
        description: "Transition to a fully plant-based diet",
        difficulty: "hard",
        impact: "high",
        emoji: "🌱"
      }
    ],
    waste: [
      {
        title: "Zero-Waste Starter",
        description: "Begin using reusable bags and water bottles",
        difficulty: "easy",
        impact: "medium",
        emoji: "🛍️"
      },
      {
        title: "Composting Journey",
        description: "Start composting your organic waste",
        difficulty: "medium",
        impact: "high",
        emoji: "🌱"
      },
      {
        title: "Zero-Waste Home",
        description: "Eliminate single-use plastics from your life",
        difficulty: "hard",
        impact: "high",
        emoji: "♻️"
      }
    ]
  };

  // Add recommendations for the highest-emission categories
  sortedCategories.slice(0, 2).forEach(([category]) => {
    const categoryRecs = categoryRecommendations[category];
    if (categoryRecs) {
      // Choose recommendations based on user's eco-personality level
      let difficultyPreference: 'easy' | 'medium' | 'hard';
      switch (input.ecoPersonality) {
        case "Sustainability Slayer":
        case "Planet's Main Character":
          difficultyPreference = "hard";
          break;
        case "Sustainability Soft Launch":
        case "Kind of Conscious, Kind of Confused":
          difficultyPreference = "medium";
          break;
        default:
          difficultyPreference = "easy";
      }

      const matchingRecs = categoryRecs.filter(rec => 
        rec.difficulty === difficultyPreference || 
        (difficultyPreference === "hard" && rec.difficulty === "medium")
      );
      
      recommendations.push(...matchingRecs.slice(0, 2));
    }
  });

  return recommendations;
};

export const generateEcoStory = (input: StoryInput): StoryCard[] => {
  const personalityDetails = PersonalityDetails[input.ecoPersonality as keyof typeof PersonalityDetails];
  const tone = getPersonalityTone(input.ecoPersonality);
  const narrative = getPersonalityNarrative(input.ecoPersonality);
  const impactComparison = getImpactComparison(input.co2Saved);
  const achievements = generateAchievements(input);
  const recommendations = generatePersonalizedRecommendations(input);
  
  const cards: StoryCard[] = [
    {
      title: "🎬 The Plot Twist Begins",
      content: `${input.name}, you weren't just part of the story — you *are* the story.\nThis year, you stepped up, shifted gears, and put the planet center stage.\nWith every small change, you rewrote your role — and Earth noticed.`,
      emoji: "🌍",
      stats: `Personality: ${input.ecoPersonality}`
    },
    {
      title: "🌟 Your Eco-Personality Revealed",
      content: `${narrative}\n\nYou're a ${input.ecoPersonality}! ${personalityDetails?.story?.split('.')[0] || 'Your sustainability journey is just beginning.'}.`,
      emoji: personalityDetails?.emoji || '🌱',
      stats: `Score: ${input.score}/100 • ${input.badge}`
    },
    {
      title: "🏆 Top Category Champion",
      content: `You're crushing it in ${input.topCategory}!\nYour sustainable choices in this area are making waves.\nYou've saved **${input.categoryEmissions[input.topCategory as keyof typeof input.categoryEmissions]?.toFixed(1) || '0'} tons CO₂** in this category alone.`,
      emoji: getCategoryEmoji(input.topCategory),
      stats: `Top Category: ${input.topCategory}`
    },
    {
      title: "✨ New Habits Unlocked",
      content: `You've leveled up your sustainability game by:\n${input.newHabits.map(habit => `• ${habit}`).join('\n')}\n\nEach choice adds up to a greener future!`,
      emoji: "✨",
      stats: `${input.newHabits.length} new habits adopted`
    },
    {
      title: "🌱 Your Impact in Numbers",
      content: `You've prevented **${input.co2Saved} tons** of CO₂ emissions!\nThat's like ${impactComparison}.\n\nYour choices are literally changing the world.`,
      emoji: "🌱",
      stats: `${input.co2Saved} tons CO₂ saved`
    },
    {
      title: "🎯 Next Level Challenge",
      content: `Ready for your next eco-quest?\n${input.nextStep} and watch your impact grow!\n\nThe planet is cheering you on.`,
      emoji: "🎯",
      stats: "Level Up!"
    },
    {
      title: "📤 Your Eco-Wrapped Recap",
      content: `@${input.name.replace(/\s+/g, '')} saved **${input.co2Saved} tons CO₂** this year 🌍\n🏆 Top Habit: ${input.newHabits[0]}\n🌀 Personality: ${input.ecoPersonality}\n🏅 Badge: ${input.badge}\n\n#EcoWrapped #MyImpactStory #${input.topCategory}Champion`,
      emoji: "🌟",
      stats: "Share your story!"
    }
  ];

  // Only add achievements card if there are achievements
  if (achievements.length > 0) {
    cards.push({
      title: "🏆 Achievements Unlocked",
      content: achievements.map(achievement => 
        `**${achievement.emoji} ${achievement.title}** (${achievement.level})\n${achievement.description}`
      ).join('\n\n'),
      emoji: "🏆",
      stats: `${achievements.length} achievements earned`
    });
  }

  // Only add recommendations card if there are recommendations
  if (recommendations.length > 0) {
    cards.push({
      title: "🎯 Your Next Steps",
      content: recommendations.map(rec => 
        `**${rec.emoji} ${rec.title}** (Impact: ${rec.impact})\n${rec.description}`
      ).join('\n\n'),
      emoji: "🎯",
      stats: `${recommendations.length} personalized recommendations`
    });
  }

  return cards;
};

export const formatStoryForDisplay = (cards: StoryCard[]): string => {
  return cards.map(card => 
    `---\n${card.emoji} ${card.title}\n\n${card.content}\n\n${card.stats ? `📊 ${card.stats}` : ''}`
  ).join('\n\n');
};

export const generateNarrativeStory = (input: StoryInput): NarrativeStory => {
  const tone = getNarrativeTone(input.ecoPersonality);
  const emotionalTrigger = getEmotionalTrigger(input.ecoPersonality);
  
  let storyContent = "";
  let callToAction = "";

  switch (input.ecoPersonality) {
    case "Sustainability Slayer":
      storyContent = `In the grand tapestry of environmental change, you've emerged as a true champion. Your journey isn't just about making choices—it's about leading a movement. With ${input.co2Saved} tons of CO₂ prevented, you're not just reducing emissions; you're crafting a legacy. Your impact in ${input.topCategory} shows what's possible when dedication meets action.`;
      callToAction = "Continue your noble quest. The planet needs more leaders like you.";
      break;
      
    case "Planet's Main Character":
      storyContent = `This is your moment. The spotlight is on you, and the world is watching. Your story of change—${input.newHabits.join(', ')}—isn't just personal; it's inspirational. You've saved ${input.co2Saved} tons of CO₂, proving that one person's choices can create ripples of change. In ${input.topCategory}, you're not just participating; you're pioneering.`;
      callToAction = "Step into your power. Your next chapter could inspire thousands.";
      break;
      
    case "Sustainability Soft Launch":
      storyContent = `Every great journey begins with a single step, and yours is unfolding beautifully. You're exploring new territories—${input.newHabits.join(', ')}—with curiosity and hope. Your ${input.co2Saved} tons of CO₂ saved is just the beginning. In ${input.topCategory}, you're discovering your potential to make a difference.`;
      callToAction = "Keep exploring. Your sustainable future is just beginning to bloom.";
      break;
      
    case "Kind of Conscious, Kind of Confused":
      storyContent = `Let's be real—sustainability isn't always straightforward. But here's the thing: you're trying, and that counts. Your ${input.co2Saved} tons of CO₂ saved? That's no small feat. And those new habits—${input.newHabits.join(', ')}—show you're figuring it out, one step at a time. In ${input.topCategory}, you're proving that progress doesn't require perfection.`;
      callToAction = "Keep being real. Your honest journey is more inspiring than you think.";
      break;
      
    case "Eco in Progress":
      storyContent = `Change can feel overwhelming, but you're showing incredible courage. Your ${input.co2Saved} tons of CO₂ saved is proof that small steps create big impact. Those new habits—${input.newHabits.join(', ')}—are your foundation. In ${input.topCategory}, you're building confidence and momentum.`;
      callToAction = "Take it one step at a time. You're exactly where you need to be.";
      break;
      
    case "Doing Nothing for the Planet":
      storyContent = `It's okay to start where you are. Your ${input.co2Saved} tons of CO₂ saved shows that change is possible, even after a slow start. Your new habits—${input.newHabits.join(', ')}—are your fresh beginning. In ${input.topCategory}, you're finding your rhythm.`;
      callToAction = "This is your moment to begin. The planet is ready for your next chapter.";
      break;
      
    case "Certified Climate Snoozer":
      storyContent = `Wake up call: you're more powerful than you think. Your ${input.co2Saved} tons of CO₂ saved proves that change is possible. Those new habits—${input.newHabits.join(', ')}—are your wake-up call to action. In ${input.topCategory}, you're showing what's possible when we choose to act.`;
      callToAction = "The time for action is now. Your choices matter more than ever.";
      break;
      
    default:
      storyContent = `Your journey is unique and powerful. With ${input.co2Saved} tons of CO₂ saved and new habits like ${input.newHabits.join(', ')}, you're making a real difference. In ${input.topCategory}, you're showing what's possible when we commit to change.`;
      callToAction = "Keep writing your story. The planet needs your unique contribution.";
  }

  return {
    title: `Your Sustainable Journey: A ${tone} Story`,
    content: storyContent,
    emotionalTrigger: emotionalTrigger,
    callToAction: callToAction
  };
}; 