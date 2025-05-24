import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Download, Share2, Leaf, Info, Car, Utensils, Plane, Zap, Trash2, Home,
  Bike, Bus, Train, Apple, Beef, PackageCheck, Recycle, Battery, Wind, Share, Loader2, Check, BookOpen,
  Book, Star, Sparkles, Trophy, Heart, 
  Lightbulb, Users, Target, ArrowRight, ShoppingBag, Droplet, Shirt, X, Quote 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { determineEcoPersonality, PersonalityDetails } from '@/utils/ecoPersonality';
import useSound from 'use-sound';
import { EcoAvatar } from '@/components/EcoAvatar';
import { getOutfitForPersonality, getAccessoryForPersonality, getBackgroundForCategory } from '@/utils/ecoPersonality';
import { Badge } from '@/components/ui/badge';
import { ClimateChampions } from '@/components/ClimateChampions';
import { Progress } from "@/components/ui/progress";
import { SustainabilityJourney } from './SustainabilityJourney';
import { impactMappings } from '@/utils/impactMappings';
import { generateEcoStory, formatStoryForDisplay, StoryCard, generateNarrativeStory, NarrativeStory } from '@/utils/ecoStoryEngine';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { WrappedStoryCarousel } from './WrappedStoryCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from "@/components/ui/separator";
import WrappedStoryCard from './WrappedStoryCard';
import html2canvas from 'html2canvas';
import EcoWrappedCard from './EcoWrappedCard';
import { calculatePersonality, UserResponses } from '@/services/api';
import { getPersonalityImage, preloadPersonalityImages } from '@/utils/personalityImages';
import { PersonalityType } from '@/types/personality';

interface CategoryEmissions {
  home: number;
  transport: number;
  food: number;
  waste: number;
}

interface Recommendation {
  category: string;
  difficulty: 'Easy' | 'Medium';
  title: string;
  description: string;
  impact: string;
}

interface Achievement {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface State {
  homeEfficiency: string;
  energyManagement: string;
  homeScale: string;
  primaryTransportMode: string;
  carProfile: string;
  longDistance: string;
  dietType: string;
  plateProfile: string;
  diningStyle: string;
  buysLocalFood: boolean;
  followsSustainableDiet: boolean;
  growsOwnFood: boolean;
  compostsFood: boolean;
  usesMealPlanning: boolean;
  plantBasedMealsPerWeek: string;
  waste?: {
    prevention: "" | "A" | "B" | "C" | "D";
    management: "" | "A" | "B" | "C";
    smartShopping: "" | "A" | "B" | "C";
    dailyWaste: "" | "A" | "B" | "C" | "D";
    repairOrReplace: boolean;
  };
  airQuality?: {
    monitoring: string;
    impact: string;
  };
  clothing?: {
    wardrobeImpact: 'A' | 'B' | 'C' | '';
    mindfulUpgrades: 'A' | 'B' | 'C' | '';
    durability: 'A' | 'B' | 'C' | '';
    consumptionFrequency: 'A' | 'B' | 'C' | 'D' | '';
    brandLoyalty: 'A' | 'B' | 'C' | 'D' | '';
  };
}

interface ImpactMapping {
  category: string;
  value: string;
  impact: string;
}

interface ResultsDisplayProps {
  score: number;
  emissions: number;
  categoryEmissions: CategoryEmissions;
  recommendations: Recommendation[];
  isVisible: boolean;
  onReset: () => void;
  state: any;
  gender: 'boy' | 'girl';
}

// Update PersonalityResponse type to match the API response
interface PersonalityResponse {
  personality?: string;
  dominantCategory?: string;
  subCategory?: string;
  tally?: Record<string, number>;
  categoryScores?: {
    [key: string]: {
      score: number;
      percentage: number;
      maxPossible?: number;
      maxPossibleScore?: number;
    };
  };
  impactMetrics?: {
    carbonReduced?: string;
    treesPlanted?: number;
    communityImpact?: number;
  };
  insights?: {
    strengths?: string[];
    opportunities?: string[];
    confidence?: number;
    dominantCategory?: string;
    recommendations?: string[];
    impactHighlights?: string;
    storyHighlights?: string;
    powerMoves?: string[];
  };
  impactHighlights?: string;
  storyHighlights?: string;
  powerMoves?: string[];
  badge?: string;
  champion?: string;
  emoji?: string;
  story?: string;
  avatar?: string;
  nextAction?: string;
  title?: string;
  description?: string;
  strengths?: string[];
  nextSteps?: string[];
  finalScore?: number;
}

const getAchievements = (state: any, categoryEmissions: CategoryEmissions): Achievement[] => {
  const achievements: Achievement[] = [];

  // Transport achievements
  if (state?.primaryTransportMode === 'WALK_BIKE') {
    achievements.push({
      title: 'Opted not to drive',
      value: 0.5,
      icon: <Bike className="h-8 w-8" />,
      color: 'bg-rose-500',
      description: 'Choosing active transport'
    });
  } else if (state?.primaryTransportMode === 'PUBLIC') {
    achievements.push({
      title: 'Used public transit',
      value: 0.4,
      icon: <Bus className="h-8 w-8" />,
      color: 'bg-rose-500',
      description: 'Choosing sustainable transport'
    });
  }

  // Diet achievements
  if (state?.dietType === 'VEGAN') {
    achievements.push({
      title: 'Plant-based diet',
      value: 0.3,
      icon: <Apple className="h-8 w-8" />,
      color: 'bg-amber-500',
      description: '100% plant-based choices'
    });
  } else if (state?.dietType === 'VEGETARIAN') {
    achievements.push({
      title: 'Vegetarian diet',
      value: 0.2,
      icon: <Utensils className="h-8 w-8" />,
      color: 'bg-amber-500',
      description: 'Meat-free choices'
    });
  }

  // Air travel achievements
  if (!state?.flightMiles || state?.flightMiles === 0) {
    achievements.push({
      title: 'Avoided air travel',
      value: 0.1,
      icon: <Plane className="h-8 w-8" />,
      color: 'bg-blue-500',
      description: 'Zero flight emissions'
    });
  }

  // Energy achievements
  if (state?.usesRenewableEnergy) {
    achievements.push({
      title: 'Green energy',
      value: 0.1,
      icon: <Wind className="h-8 w-8" />,
      color: 'bg-purple-500',
      description: 'Using renewable sources'
    });
  }

  // Waste achievements
  if (state?.waste?.recyclingPercentage > 75) {
    achievements.push({
      title: 'High recycling',
      value: 0.15,
      icon: <Recycle className="h-8 w-8" />,
      color: 'bg-green-500',
      description: '75%+ recycling rate'
    });
  }

  // Energy efficiency
  if (state?.hasEnergyEfficiencyUpgrades) {
    achievements.push({
      title: 'Energy efficient',
      value: 0.2,
      icon: <Battery className="h-8 w-8" />,
      color: 'bg-indigo-500',
      description: 'Upgraded efficiency'
    });
  }

  return achievements;
};

const getPersonalityRole = (personalityTitle: string): 'pioneer' | 'guardian' | 'innovator' | 'advocate' => {
  switch (personalityTitle) {
    case 'Sustainability Slayer':
      return 'pioneer';
    case "Planet's Main Character":
      return 'innovator';
    case 'Sustainability Soft Launch':
      return 'guardian';
    default:
      return 'advocate';
  }
};

// Local error boundary for debugging render errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: any) {
    // You can log error info here if needed
    console.error('ErrorBoundary caught an error:', error, info);
  }
  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="p-8 bg-red-100 text-red-800 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">An error occurred in ResultsDisplay</h2>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  score,
  emissions,
  categoryEmissions,
  recommendations,
  isVisible,
  onReset,
  state,
  gender
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPersonalityLoading, setIsPersonalityLoading] = useState(true);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string>('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
 

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const [storyCards, setStoryCards] = useState<StoryCard[]>([]);
  const [narrativeStory, setNarrativeStory] = useState<NarrativeStory | null>(null);
  const [wrappedImage, setWrappedImage] = useState<string | null>(null);
  const [showWrapped, setShowWrapped] = useState(false);
  const [showWrappedModal, setShowWrappedModal] = useState(false);
  const wrappedCardRef = useRef<HTMLDivElement>(null);
  const [wrappedTheme, setWrappedTheme] = useState<'light' | 'dark' | 'pop'>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dynamicPersonality, setDynamicPersonality] = useState<PersonalityResponse | null>(null);
  const [showJourney, setShowJourney] = useState(false);
  const journeyRef = useRef<HTMLDivElement>(null);
  // Debug: Log all props and key state
  console.log('ResultsDisplay props:', { score, emissions, categoryEmissions, recommendations, isVisible, state });
  console.log('DynamicPersonality at top of render:', dynamicPersonality);

  // Add a ref to track if calculation has been attempted
  const hasAttemptedCalculation = useRef(false);

  // Update error handling with proper typing
  const handleError = (error: unknown) => {
    console.warn('Error:', error);
  };

  // Update the component to use optional chaining
  const personalityType = dynamicPersonality?.personality || '';
  const emoji = dynamicPersonality?.emoji;
  const story = dynamicPersonality?.story;
  const avatar = dynamicPersonality?.avatar;
  const nextAction = dynamicPersonality?.nextAction;
  const badge = dynamicPersonality?.badge;
  const champion = dynamicPersonality?.champion;
  const powerMoves = dynamicPersonality?.powerMoves;

  // Debug logging for state changes
  useEffect(() => {
    console.log('Story generation state changed:', { isGeneratingStory, generatedStory });
  }, [isGeneratingStory, generatedStory]);

  // Calculate dominant category
  const categoryScores = {
    home: (state?.homeEfficiency === 'A' ? 3 : state?.homeEfficiency === 'B' ? 2 : 1) +
          (state?.energyManagement === 'A' ? 3 : state?.energyManagement === 'B' ? 2 : 1),
    transport: (state?.primaryTransportMode === 'A' ? 3 : state?.primaryTransportMode === 'B' ? 2 : 1) +
               (state?.carProfile === 'A' ? 3 : state?.carProfile === 'B' ? 2 : 1),
    food: (state?.dietType === 'VEGAN' ? 3 : state?.dietType === 'VEGETARIAN' ? 2 : 1) +
          (state?.plateProfile === 'A' ? 3 : state?.plateProfile === 'B' ? 2 : 1),
    waste: (state?.waste?.prevention === 'A' ? 3 : state?.waste?.prevention === 'B' ? 2 : 1) +
           (state?.waste?.management === 'A' ? 3 : state?.waste?.management === 'B' ? 2 : 1)
  };

  const dominantCategory = Object.entries(categoryScores)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0] as 'home' | 'transport' | 'food' | 'waste';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'transport':
        return <Car className="h-5 w-5" />;
      case 'food':
        return <Utensils className="h-5 w-5" />;
      case 'waste':
        return <Trash2 className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getStepIcon = (index: number) => {
    const icons = [
      <Leaf key="leaf" className="h-5 w-5" />,
      <Zap key="zap" className="h-5 w-5" />,
      <Share2 key="share" className="h-5 w-5" />
    ];
    return icons[index % icons.length];
  };

  const getStepDescription = (step: string) => {
    // Add custom descriptions based on the step
    const descriptions: Record<string, string> = {
      'Start a community sustainability initiative': 'Connect with local environmental groups and organize eco-friendly events.',
      'Mentor others in eco-friendly practices': 'Share your knowledge and experience with those starting their sustainability journey.',
      'Advocate for environmental policies': 'Get involved in local government and support green initiatives.',
      // Add more descriptions as needed
    };
    return descriptions[step] || 'Take this step to reduce your environmental impact.';
  };

  const getStepDifficulty = (step: string) => {
    // Add custom difficulty levels based on the step
    const difficulties: Record<string, string> = {
      'Start a community sustainability initiative': 'Medium',
      'Mentor others in eco-friendly practices': 'Easy',
      'Advocate for environmental policies': 'Hard',
      // Add more difficulties as needed
    };
    return difficulties[step] || 'Medium';
  };

  const getStepImpact = (step: string) => {
    // Add custom impact levels based on the step
    const impacts: Record<string, string> = {
      'Start a community sustainability initiative': 'High Impact',
      'Mentor others in eco-friendly practices': 'Medium Impact',
      'Advocate for environmental policies': 'Very High Impact',
      // Add more impacts as needed
    };
    return impacts[step] || 'Medium Impact';
  };

  // Update the profile image logic to use the mapped image for the personality name
  const profileImage = dynamicPersonality ? getPersonalityImage(dynamicPersonality.personality as PersonalityType, gender) : '';

  // Update generateStory to use backend data everywhere
  const generateStory = async () => {
    if (!state || !dynamicPersonality) {
      console.error('State or personality is undefined');
      return;
    }

    // Use backend data for story input
    const storyInput = {
      name: state.name || 'Eco Hero',
      ecoPersonality: dynamicPersonality.personality || '', // from backend
      co2Saved: parseFloat(dynamicPersonality.impactMetrics?.carbonReduced || '0'), // from backend
      topCategory: (dynamicPersonality.dominantCategory || '').charAt(0).toUpperCase() + (dynamicPersonality.dominantCategory || '').slice(1),
      newHabits: [], // You can keep your habit logic or use backend if available
      impactEquivalent: `planting ${dynamicPersonality.impactMetrics?.treesPlanted || 0} trees`, // from backend
      nextStep: dynamicPersonality.nextAction || 'Start your journey', // from backend
      badge: dynamicPersonality.badge || 'Eco Explorer', // from backend
      score: Math.max(1, score),
      categoryEmissions: {
        home: categoryEmissions.home || 0,
        transport: categoryEmissions.transport || 0,
        food: categoryEmissions.food || 0,
        waste: categoryEmissions.waste || 0
      }
    };

    try {
      setIsGeneratingStory(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Generate story using backend data
      const storyCards = generateEcoStory(storyInput);
      const narrativeStory = generateNarrativeStory(storyInput);
      setStoryCards(storyCards);
      setNarrativeStory(narrativeStory);
      setShowStory(true);
      setCurrentCardIndex(0);
    } catch (error) {
      setGeneratedStory("Your journey in sustainable living is making a positive impact on our planet. Every small change you make contributes to a greener future.");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Add a useEffect to monitor story state changes
  useEffect(() => {
    console.log('Story state changed:', {
      showStory,
      storyCardsLength: storyCards.length,
      hasNarrativeStory: !!narrativeStory,
      currentCardIndex
    });
  }, [showStory, storyCards, narrativeStory, currentCardIndex]);

  // Get achievements based on state
  const achievements = getAchievements(state, categoryEmissions);

  // Helper functions for qualitative assessments
  const getStrengthLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  };

  const getQuickTip = (category: string): string => {
    const tips = {
      home: 'Focus on energy-efficient choices and mindful consumption',
      transport: 'Choose sustainable transportation options when possible',
      food: 'Make earth-friendly food choices and reduce waste',
      waste: 'Practice recycling and minimize single-use items'
    };
    return tips[category as keyof typeof tips] || '';
  };

  const getProgressStatus = (score: number): string => {
    if (score >= 5) return 'Excellent Progress';
    if (score >= 3) return 'Good Progress';
    return 'Getting Started';
  };

  // Update the milestone calculation to use dynamicPersonality
  const milestoneOrder = [
    "Certified Climate Snoozer",
    "Doing Nothing for the Planet",
    "Eco in Progress",
    "Kind of Conscious, Kind of Confused",
    "Sustainability Soft Launch",
    "Planet's Main Character",
    "Sustainability Slayer"
  ];

  const currentMilestone = dynamicPersonality ? milestoneOrder.indexOf(dynamicPersonality.personality || '') : 0;
  const nextMilestone = currentMilestone < milestoneOrder.length - 1 
    ? milestoneOrder[currentMilestone + 1] 
    : milestoneOrder[currentMilestone];

  const totalMilestones = 7;
  const progressPercent = Math.max(0, Math.round((currentMilestone / totalMilestones) * 100));
  const userName = state?.name || 'Eco Hero';
  // Update the share text to use dynamicPersonality
  const shareText = dynamicPersonality 
    ? `I'm a ${dynamicPersonality.personality || ''} on my sustainability journey! 🌱 What's your eco-personality?`
    : '';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Eco-Personality',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Eco-personality summary copied to clipboard!');
    }
  };

  function generateImpactHighlights(state: State, impactMappings: ImpactMapping[]): string[] {
    const highlights: string[] = [];
    (Object.keys(state) as Array<keyof State>).forEach((key) => {
      const userResponse = state[key];
      const mapping = impactMappings.find(m => m.category === key && m.value === userResponse);
      if (mapping) {
        highlights.push(mapping.impact);
      }
    });
    return highlights;
  }

  const homeEnergyMappings = Object.entries(impactMappings.homeEnergy).map(([value, obj]) => ({
    ...obj,
    category: 'homeEnergy',
    value
  }));
  const wasteMappings = Object.entries(impactMappings.waste).map(([value, obj]) => ({
    ...obj,
    category: 'waste',
    value
  }));
  const highlights = generateImpactHighlights(
    state,
    [...homeEnergyMappings, ...wasteMappings]
  );

  const handleNextCard = () => {
    if (currentCardIndex < storyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  // Update the wrappedSlides to use optional chaining
  const wrappedSlides = storyCards.length > 0 && dynamicPersonality ? [
    {
      personality: dynamicPersonality.personality || '',
      name: userName,
      co2Saved: `${(16 - emissions).toFixed(1)} tons`,
      topCategory: (dynamicPersonality.dominantCategory || '').charAt(0).toUpperCase() + (dynamicPersonality.dominantCategory || '').slice(1),
      nextStep: recommendations[0]?.title || '',
      badge: dynamicPersonality.badge,
      shareText: `@${userName.replace(/\s+/g, '')} saved ${(16 - emissions).toFixed(1)} tons CO₂ this year! 🌍 Top Habit: ${recommendations[0]?.title || ''} 🌿 Role: ${dynamicPersonality.personality || ''} 🏅 Badge: ${dynamicPersonality.badge} #EcoWrapped #ImpactInAction`,
    },
  ] : [];

  useEffect(() => {
    if (showWrapped) {
      setTimeout(async () => {
        const cardId = 'story-card-' + ((dynamicPersonality?.personality || '').replace(/\s+/g, '-'));
        const card = document.getElementById(cardId);
        if (card) {
          const canvas = await html2canvas(card, {
            useCORS: true,
            scale: 2,
            backgroundColor: null,
          });
          setWrappedImage(canvas.toDataURL('image/png'));
        }
      }, 300);
    }
  }, [showWrapped, dynamicPersonality]);

  // Combine narrative and segment cards for the carousel
  const combinedStoryCards = narrativeStory
    ? [
        {
          title: narrativeStory.title,
          content: narrativeStory.content,
          emoji: '📖',
          stats: undefined,
          isNarrative: true,
        },
        ...storyCards.map(card => ({ ...card, isNarrative: false })),
        {
          title: '🌟 Your Next Chapter',
          content: narrativeStory.callToAction,
          emoji: '🎯',
          stats: narrativeStory.emotionalTrigger,
          isNarrative: true,
        },
      ]
    : storyCards;

  // Function to transform state to API format
  const transformStateToApiFormat = (state: State): UserResponses => {
    return {
      homeEnergy: {
        efficiency: (state.homeEfficiency || '') as 'A' | 'B' | 'C' | '',
        management: (state.energyManagement || '') as 'A' | 'B' | 'C' | '',
        homeScale: (state.homeScale || '') as '1' | '2' | '3' | '4' | '5' | '6' | '7+',
      },
      transport: {
        primary: (state.primaryTransportMode || '') as 'A' | 'B' | 'C' | 'D' | '',
        carProfile: (state.carProfile || '') as 'A' | 'B' | 'C' | 'D' | 'E' | '',
        longDistance: (state.longDistance || '') as 'A' | 'B' | 'C' | 'D' | 'E',
      },
      food: {
        dietType: (
          state.dietType === "VEGAN" ? "PLANT_BASED" :
          state.dietType === "VEGETARIAN" ? "VEGETARIAN" :
          state.dietType === "FLEXITARIAN" ? "FLEXITARIAN" :
          state.dietType === "MEAT_MODERATE" ? "MODERATE_MEAT" :
          undefined
        ) as 'PLANT_BASED' | 'VEGETARIAN' | 'FLEXITARIAN' | 'MODERATE_MEAT' | undefined,
        foodSource: (
          state.plateProfile === "A" ? "LOCAL_SEASONAL" :
          state.plateProfile === "B" ? "MIXED" :
          state.plateProfile === "C" ? "CONVENTIONAL" :
          undefined
        ) as 'LOCAL_SEASONAL' | 'MIXED' | 'CONVENTIONAL' | undefined,
        diningStyle: (
          state.diningStyle === "A" ? "HOME_COOKED" :
          state.diningStyle === "B" ? "BALANCED" :
          state.diningStyle === "C" ? "FREQUENT_DINE_OUT" :
          undefined
        ) as 'HOME_COOKED' | 'BALANCED' | 'FREQUENT_DINE_OUT' | undefined,
        plantBasedMealsPerWeek: state.plantBasedMealsPerWeek ? parseInt(state.plantBasedMealsPerWeek) : undefined
      },
      waste: {
        prevention: (state.waste?.prevention || '') as 'A' | 'B' | 'C' | 'D' | '',
        management: (state.waste?.management || '') as 'A' | 'B' | 'C' | '',
        smartShopping: (state.waste?.smartShopping || '') as 'A' | 'B' | 'C',
        dailyWaste: (state.waste?.dailyWaste || '') as 'A' | 'B' | 'C' | 'D',
        repairOrReplace: Boolean(state.waste?.repairOrReplace),
      },
      airQuality: {
        monitoring: (state.airQuality?.monitoring || '') as 'A' | 'B' | 'C' | 'D' | '',
        impact: (state.airQuality?.impact || '') as 'A' | 'B' | 'C' | 'D' | '',
      },
      clothing: {
        wardrobeImpact: state.clothing?.wardrobeImpact || undefined,
        mindfulUpgrades: state.clothing?.mindfulUpgrades || undefined,
        durability: state.clothing?.durability || undefined,
        consumptionFrequency: state.clothing?.consumptionFrequency || undefined,
        brandLoyalty: state.clothing?.brandLoyalty || undefined
      },
    };
  };

  const calculateInitialPersonality = async () => {
    // Prevent duplicate calls
    if (isLoading || dynamicPersonality || hasAttemptedCalculation.current) return;
    
    try {
      hasAttemptedCalculation.current = true;
      setIsLoading(true);
      setError(null);

      const apiResponses = transformStateToApiFormat(state);
      const result = await calculatePersonality(apiResponses);

      // Map the API response to the expected format
      setDynamicPersonality({
        personality: result.personalityType,
        description: result.description,
        strengths: result.strengths,
        nextSteps: result.nextSteps,
        categoryScores: result.categoryScores,
        impactMetrics: result.impactMetrics,
        finalScore: result.finalScore,
        powerMoves: result.powerMoves,
        dominantCategory: Object.entries(result.categoryScores)
          .reduce((a, b) => (a[1].score > b[1].score ? a : b))[0],
        emoji: '🌱', // Default emoji
        badge: 'Eco Explorer', // Default badge
        story: result.description,
        nextAction: result.nextSteps[0] || 'Start your journey'
      });

      console.log('Set dynamic personality:', {
        personality: result.personalityType,
        description: result.description,
        strengths: result.strengths,
        nextSteps: result.nextSteps,
        categoryScores: result.categoryScores,
        impactMetrics: result.impactMetrics,
        finalScore: result.finalScore
      });
    } catch (err) {
      console.error('Error calculating personality:', err);
      setError('Failed to calculate personality. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to only run once when component mounts
  useEffect(() => {
    if (state && !hasAttemptedCalculation.current) {
      calculateInitialPersonality();
    }
  }, []); // Empty dependency array ensures it only runs once

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
          <button
            onClick={() => {
              hasAttemptedCalculation.current = false; // Reset the ref
              setError(null);
              calculateInitialPersonality();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={cn(
        "max-w-[1400px] mx-auto px-8 py-12 space-y-12 transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0"
      )}>
        {/* Header */}
        <div className="space-y-6">
          <div className="inline-block">
            <div className="relative">
              <Book className="h-12 w-12 text-green-600" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-5xl font-serif text-green-700">Your Planet, Your Impact: Let's Begin!</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Every step you take shapes our planet's future. Let's discover your unique path to sustainability.
          </p>
        </div>

        {/* Split Hero Layout */}
        <div className="space-y-8">
          {/* Fancy Heading for Top Section */}
          <div className="w-full flex flex-col items-center mb-8">
            <div className="flex items-center gap-4">
              <Sparkles className="h-10 w-10 text-yellow-400 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-extrabold font-serif bg-gradient-to-r from-green-700 via-emerald-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                Your Story So Far & The Next Chapter
              </h2>
              <Sparkles className="h-10 w-10 text-green-400 animate-pulse" />
            </div>
            <p className="text-lg text-gray-600 mt-2 text-center max-w-2xl">
              Every choice shapes your journey. See your unique path and discover the next move in your story.
            </p>
          </div>
          {/* New: Personality Visual Card */}
          <div className="flex justify-center w-full mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-0 flex flex-col items-center max-w-2xl w-full border border-green-100 overflow-hidden">
              {/* Personality Image - classy, well-formed */}
              <div className="mx-auto my-4 w-64 h-80 rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                {profileImage && (
                  <img
                    src={profileImage}
                    alt={`${dynamicPersonality?.personality || 'Personality'} Illustration`}
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-300"
                    loading="eager"
                    decoding="async"
                  />
                )}
              </div>
              <div className="w-full p-8 flex flex-col items-center">
                {/* Personality Description */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{dynamicPersonality?.emoji}</span>
                  <h2 className="text-2xl font-bold text-green-700 font-serif">{dynamicPersonality?.personality || ''}</h2>
                </div>
                <Badge className="mb-2">{dynamicPersonality?.badge}</Badge>
                {/* Add description here */}
                {dynamicPersonality?.description && (
                  <p className="text-base text-gray-600 text-center mb-3 italic max-w-md">{dynamicPersonality.description}</p>
                )}
                <p className="text-gray-700 text-center mb-2">
                  {dynamicPersonality?.impactHighlights ||
                    `You saved ${dynamicPersonality?.impactMetrics?.carbonReduced || 0} tons of CO₂ — equal to planting ${dynamicPersonality?.impactMetrics?.treesPlanted || 0} trees.`}
                </p>
                <div className="text-green-700 font-medium mb-2">{nextAction || ''}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-stretch w-full mt-8 justify-center">
            {/* Profile Card */}
            <div className="flex-1 max-w-xl mx-auto bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-2xl p-10 flex flex-col items-center min-h-[460px]">
              {/* Remove Animated Avatar (without progress ring) */}
              {/* Personalized Greeting */}
              <div className="text-lg font-semibold text-green-900 mb-2 text-center">
                Hi {userName}, you're a {dynamicPersonality?.personality || ''}!
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{emoji}</span>
                <h2 className="text-2xl font-bold text-green-700 font-serif">{dynamicPersonality?.personality || ''}</h2>
              </div>
              <Badge className="mb-2">{badge}</Badge>
              <div className="text-green-700 font-medium mb-4">{nextAction || ''}</div>
              {/* New: Strengths/Highlights */}
              <div className="bg-green-50 rounded-lg p-3 mb-3 w-full text-center">
                <div className="text-sm font-semibold text-green-700 mb-1">Your Strengths</div>
                <div className="text-sm text-gray-700">
                  You excel at making conscious choices and inspiring others to start their journey.
                </div>
              </div>
              {/* New: Fun Fact/Stat */}
              <div className="bg-green-50 rounded-lg p-3 mb-3 w-full text-center">
                <div className="text-sm font-semibold text-green-700 mb-1">Did you know?</div>
                <div className="text-sm text-gray-700">
                  People with your profile are likely to influence at least 3 friends to take action!
                </div>
              </div>
              {/* New: Motivational Quote/Tip */}
              <div className="text-xs italic text-green-600 text-center mb-4">
                "Every small step you take creates a ripple of positive change."
              </div>
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition text-base font-semibold"
              >
                Share Your Eco-Personality
              </button>
              <Button
                onClick={() => {
                  setShowJourney(true);
                  setTimeout(() => journeyRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition text-base font-semibold"
              >
                View Your Journey
              </Button>
            </div>
            {/* Recommendation Engine Card */}
            <div className="flex-1 max-w-xl mx-auto bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-2xl p-10 flex flex-col items-center min-h-[460px]">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-7 w-7 text-green-500" />
                <h2 className="text-2xl font-bold text-green-700 font-serif">Recommendation Engine</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-green-500 cursor-pointer ml-1" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <span>Why this matters: This recommendation is chosen based on your answers and has the biggest impact for you right now.</span>
                  </TooltipContent>
                </Tooltip>
              </div>
              {recommendations && recommendations.length > 0 ? (
                <>
                  <div className="w-full mb-4">
                    <div className="text-lg font-semibold text-green-700 mb-1 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-500" />
                      {recommendations[0].title}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{recommendations[0].description}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={recommendations[0].difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {recommendations[0].difficulty}
                      </Badge>
                      <span className="text-xs text-green-700 font-medium">{recommendations[0].impact}</span>
                    </div>
                    {/* Why this is recommended */}
                    <div className="mt-4 bg-green-50 rounded-lg p-3 flex items-start gap-2">
                      <Info className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-green-700 mb-1">Why this is recommended</div>
                        <div className="text-sm text-gray-700">Switching to renewable energy is one of the most effective ways to reduce your carbon footprint and support a cleaner future.</div>
                      </div>
                    </div>
                    {/* How to get started */}
                    <div className="mt-4 bg-green-50 rounded-lg p-3 flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-green-700 mb-1">How to get started</div>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          <li>Contact your local utility to ask about green energy options.</li>
                          <li>Research solar panel providers in your area.</li>
                          <li>Start with small steps, like using energy-efficient appliances.</li>
                        </ul>
                      </div>
                    </div>
                    {/* Inspirational tip */}
                    <div className="mt-4 text-xs italic text-green-600 text-center">
                      "Every small switch adds up to a brighter, cleaner tomorrow."
                    </div>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition text-lg py-3 font-semibold"
                    onClick={() => alert('Simulate recommendation: ' + recommendations[0].title)}
                  >
                    Simulate Recommendation
                  </Button>
                </>
              ) : (
                <div className="text-gray-500">No recommendations available.</div>
              )}
            </div>
          </div>

          {/* Sustainability Journey */}
          {showJourney && (
            <div ref={journeyRef} className="w-full flex flex-col justify-center bg-white/60 rounded-3xl shadow-2xl p-12 mt-8">
              <h2 className="text-3xl font-serif text-green-700 mb-8 flex items-center gap-3">
                <Leaf className="h-8 w-8 text-green-500" /> Your Sustainability Journey
              </h2>
              <SustainabilityJourney currentMilestone={currentMilestone} score={score} />
            </div>
          )}
        </div>

        {/* Story Generation Section - Updated UI */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              <h2 className="text-3xl font-serif text-gray-800">Your Climate Journey Story</h2>
            </div>
            <div className="flex gap-2 justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => setShowWrapped(true)}
                className={cn(
                  "text-green-700 border-green-200",
                  !showStory && "opacity-50 cursor-not-allowed"
                )}
                disabled={!showStory}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {!showStory ? "Generate Story First" : "Generate Wrapped"}
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowStory(false);
                  setShowWrapped(false);
                  setWrappedImage(null);
                  onReset();
                }}
                className="text-green-700 border-green-200"
              >
                Reset Story
              </Button>
            </div>
          </div>
          
          {!showStory ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-green-50 rounded-xl p-8 border border-purple-100 shadow-lg"
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">
                      Generate Your Unique Climate Story
                    </h3>
                    <p className="text-gray-600">
                      Let's transform your sustainable choices into an inspiring narrative. Your story could motivate others to join the climate action movement.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                  <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium text-purple-900">Personalized</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Story tailored to your unique eco-personality and achievements
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-purple-900">Engaging</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Interactive storytelling with visual elements and animations
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-purple-900">Shareable</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Easy to share your journey with friends and family
                    </p>
                  </div>
                </div>

                <Button
                  onClick={async () => {
                    await generateStory();
                    setShowStory(true);
                  }}
                  className={cn(
                    "w-full text-white py-6 rounded-xl flex items-center justify-center gap-3 text-lg transition-all duration-300",
                    isGeneratingStory 
                      ? "bg-purple-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg"
                  )}
                  disabled={isGeneratingStory}
                >
                  {isGeneratingStory ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Crafting Your Story...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6" />
                      Generate Your Climate Journey
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : storyCards.length > 0 ? (
            <AnimatePresence>
              <motion.div 
                key={currentCardIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className={cn(
                  'story-card space-y-6 rounded-3xl shadow-2xl border p-10 md:p-14',
                  combinedStoryCards[currentCardIndex]?.isNarrative
                    ? 'bg-gradient-to-br from-blue-50 via-white to-green-50 border-blue-100'
                    : 'bg-gradient-to-br from-green-50 via-white to-purple-50 border-green-100'
                )}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-gradient-to-br from-green-200 to-green-400 rounded-xl shadow-lg">
                    {combinedStoryCards[currentCardIndex].emoji && (
                      <span className="text-3xl drop-shadow-lg">{combinedStoryCards[currentCardIndex].emoji}</span>
                    )}
                  </div>
                  <h3 className={cn(
                    'font-serif tracking-tight flex-1',
                    combinedStoryCards[currentCardIndex]?.isNarrative
                      ? 'text-3xl md:text-4xl font-extrabold text-blue-900'
                      : 'text-3xl md:text-4xl font-extrabold text-green-900'
                  )}>
                    {combinedStoryCards[currentCardIndex].title}
                  </h3>
                </div>
                <div className={cn(
                  'rounded-2xl shadow-md',
                  combinedStoryCards[currentCardIndex]?.isNarrative
                    ? 'bg-white/95 p-10 border-l-4 border-blue-300'
                    : 'bg-white/90 p-8 border-l-4 border-green-300'
                )}>
                  <p className={cn(
                    'leading-relaxed whitespace-pre-line',
                    combinedStoryCards[currentCardIndex]?.isNarrative
                      ? 'text-xl text-blue-900 font-medium italic'
                      : 'text-lg md:text-xl text-gray-800 font-medium'
                  )}>
                    {combinedStoryCards[currentCardIndex].content}
                  </p>
                </div>
                {combinedStoryCards[currentCardIndex].stats && (
                  <div className={cn(
                    'flex items-center gap-2 font-semibold mt-2',
                    combinedStoryCards[currentCardIndex]?.isNarrative
                      ? 'text-blue-700 text-base'
                      : 'text-green-700 text-base'
                  )}>
                    <Info className="h-5 w-5" />
                    {combinedStoryCards[currentCardIndex].stats}
                  </div>
                )}
                <div className="flex items-center justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePreviousCard}
                    disabled={currentCardIndex === 0}
                    className="flex items-center gap-2 text-green-700 border-green-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {combinedStoryCards.map((_, index) => (
                      <motion.div
                        key={index}
                        className={cn(
                          'h-3 w-3 rounded-full border-2',
                          currentCardIndex === index
                            ? combinedStoryCards[index]?.isNarrative
                              ? 'bg-blue-600 border-blue-600 shadow-lg'
                              : 'bg-green-600 border-green-600 shadow-lg'
                            : combinedStoryCards[index]?.isNarrative
                              ? 'bg-blue-100 border-blue-200'
                              : 'bg-green-100 border-green-200'
                        )}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => setCurrentCardIndex(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleNextCard}
                    disabled={currentCardIndex === combinedStoryCards.length - 1}
                    className="flex items-center gap-2 text-green-700 border-green-200"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-600">Generating your story...</p>
            </div>
          )}
        </div>

        {/* Eco Story Card - Combined Impact Summary and Power Moves */}
        <Card className="bg-gradient-to-br from-green-50 to-yellow-50 overflow-hidden rounded-2xl shadow-lg">
          <CardContent className="p-8 lg:p-12 space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-8 text-center font-sans tracking-tight">
              Your Impact & Power Moves
            </h2>
            {/* Impact Summary */}
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
              <div className="relative mb-2">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4 shadow-lg flex items-center justify-center">
                  <Leaf className="h-10 w-10 text-white drop-shadow-lg animate-pulse" />
                </div>
                <span className="absolute -top-2 -right-2 text-yellow-300 animate-bounce select-none">✨</span>
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-green-800 font-sans" style={{ fontFamily: 'Inter, Satoshi, Manrope, sans-serif' }}>
                {dynamicPersonality?.impactMetrics?.carbonReduced || '0.0'}
              </div>
              <span className="block text-lg font-bold text-green-700">tons of CO₂</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">🌳</span>
                <span className="text-green-800 font-semibold">= {dynamicPersonality?.impactMetrics?.treesPlanted || 0} trees</span>
                <span className="ml-2 flex gap-0.5">
                  {Array(Math.min(7, Math.floor((dynamicPersonality?.impactMetrics?.treesPlanted || 0) / 10))).fill(0).map((_, i) => (
                    <span key={i} className="text-lg">🌲</span>
                  ))}
                </span>
              </div>
              <div className="mt-1 text-xs text-green-500 font-medium">
                ≈ {Math.round(Number(dynamicPersonality?.impactMetrics?.carbonReduced || 0) / 500)} flights avoided ✈️
              </div>
            </div>
            {/* Power Moves */}
            <div className="bg-gradient-to-br from-yellow-50 via-gold-50 to-yellow-100 rounded-3xl shadow-xl px-4 py-8 flex flex-col gap-6 w-full">
              <h3 className="text-2xl md:text-3xl font-bold text-yellow-700 mb-2 font-sans flex items-center gap-2">
                Power Moves
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(dynamicPersonality?.powerMoves || []).map((move, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-white/90 rounded-xl shadow-lg p-4 hover:scale-105 transition-transform"
                  >
                    <span
                      className="text-base text-gray-700"
                      dangerouslySetInnerHTML={{ __html: move }}
                    />
                  </div>
                ))}
              </div>
              {/* Badge progress bar / unlock row */}
              <div className="mt-6 flex items-center gap-3 justify-center">
                <span className="text-lg font-semibold text-green-800">Unlock:</span>
                <span className="bg-gradient-to-r from-green-200 to-green-400 text-green-900 font-bold rounded-full px-4 py-1 shadow">{dynamicPersonality?.badge || 'Carbon Strategist'}</span>
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Climate Champions Card */}
        <Card className="bg-green-50 overflow-hidden rounded-2xl shadow-lg">
          <CardContent className="p-8 lg:p-12">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h2 className="text-3xl font-serif text-gray-800">Climate Champions</h2>
              </div>
              
              <p className="text-lg text-gray-600">
                Connect with inspiring climate leaders who share your passion for {dominantCategory} sustainability.
              </p>

              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
                <ClimateChampions
                  dominantCategory={dominantCategory}
                  userScore={score}
                  onActionSelect={(action) => {
                    console.log('Selected action:', action);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {showWrapped && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gradient-to-br from-purple-900 to-blue-900 rounded-[40px] p-8 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setShowWrapped(false)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-900" />
              </button>

              {/* Theme switcher */}
              <div className="flex justify-center gap-4 mb-6">
                {(['light', 'dark', 'pop'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setWrappedTheme(theme)}
                    className={cn(
                      'px-4 py-2 rounded-full font-semibold border transition-all',
                      wrappedTheme === theme
                        ? theme === 'dark'
                          ? 'bg-[#23213a] text-yellow-300 border-yellow-400 scale-105 shadow-lg'
                          : theme === 'pop'
                            ? 'bg-[#ff2d55] text-white border-[#ff2d55] scale-105 shadow-lg'
                            : 'bg-white text-green-700 border-green-400 scale-105 shadow-lg'
                        : 'bg-transparent text-gray-400 border-gray-200 hover:scale-105 hover:shadow'
                    )}
                    style={{ minWidth: 80 }}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>

              {/* Hidden card for generation */}
              <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
                <EcoWrappedCard
                  theme={wrappedTheme as 'light' | 'dark' | 'pop'}
                  savedCO2={`${(16 - emissions).toFixed(1)}`}
                  topCategory={(dynamicPersonality?.dominantCategory || '').charAt(0).toUpperCase() + (dynamicPersonality?.dominantCategory || '').slice(1)}
                  badge={dynamicPersonality?.badge}
                  personality={dynamicPersonality?.personality || ''}
                  profileImage={dynamicPersonality ? getPersonalityImage(dynamicPersonality.personality as PersonalityType, gender) : ''}
                />
              </div>

              {/* Show the generated image or fallback to EcoWrappedCard */}
              {wrappedImage ? (
                <motion.img
                  src={wrappedImage}
                  alt="Your Eco Wrapped"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="rounded-[32px] shadow-2xl"
                  style={{ maxWidth: 600 }}
                />
              ) : (
                <EcoWrappedCard
                  theme={wrappedTheme as 'light' | 'dark' | 'pop'}
                  savedCO2={`${(16 - emissions).toFixed(1)}`}
                  topCategory={(dynamicPersonality?.dominantCategory || '').charAt(0).toUpperCase() + (dynamicPersonality?.dominantCategory || '').slice(1)}
                  badge={dynamicPersonality?.badge}
                  personality={dynamicPersonality?.personality || ''}
                  profileImage={dynamicPersonality ? getPersonalityImage(dynamicPersonality.personality as PersonalityType, gender) : ''}
                />
              )}

              {/* Share buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  onClick={handleShare}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  Share
                </Button>
                <Button
                  onClick={() => {
                    if (wrappedImage) {
                      const link = document.createElement('a');
                      link.download = 'eco-wrapped.png';
                      link.href = wrappedImage;
                      link.click();
                    }
                  }}
                  variant="outline"
                  className="px-8"
                >
                  Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default ResultsDisplay;
