import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Download, Share2, Leaf, Info, Car, Utensils, Plane, Zap, Trash2, Home,
  Bike, Bus, Train, Apple, Beef, PackageCheck, Recycle, Battery, Wind, Share, Loader2, Check, BookOpen,
  Book, Star, Sparkles, Trophy, Heart, 
  Lightbulb, Users, Target, ArrowRight, ShoppingBag, Droplet, Shirt, X, Quote, PenTool, Brain
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
import { PersonalityType, PersonalityResponse } from '@/types/personality';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/stores/quizStore';
import { SpeedometerGauge } from '@/components/SpeedometerGauge';

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
  homeSize?: string;
  homeEfficiency: string;
  energyManagement: string;
  homeScale: string;
  electricityKwh?: string;
  naturalGasTherm?: string;
  heatingOilGallons?: string;
  propaneGallons?: string;
  usesRenewableEnergy?: boolean;
  hasEnergyEfficiencyUpgrades?: boolean;
  hasSmartThermostats?: boolean;
  hasEnergyStarAppliances?: boolean;
  // Transportation
  primaryTransportMode: string;
  carProfile: string;
  longDistance: string;
  weeklyKm?: string;
  costPerMile?: string;
  // Food & Diet
  dietType: string;
  plateProfile: string;
  diningStyle: string;
  monthlyDiningOut?: string;
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
    outdoorAirQuality?: string;
    aqiMonitoring?: string;
    indoorAirQuality?: string;
    airQualityCommuting?: string;
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
  onBack?: () => void; // Add back function prop
  state: any;
  gender: 'boy' | 'girl';
  comprehensivePowerMoves?: {
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
  };
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

// Type guard for PersonalityType
const isPersonalityType = (value: string): value is PersonalityType => {
  return [
    'Sustainability Slayer',
    "Planet's Main Character",
    'Sustainability Soft Launch',
    'Kind of Conscious, Kind of Confused',
    'Eco in Progress',
    'Doing Nothing for the Planet',
    'Certified Climate Snoozer',
  ].includes(value);
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  score,
  emissions,
  categoryEmissions,
  recommendations,
  isVisible,
  onReset,
  onBack,
  state: _state,
  gender,
  comprehensivePowerMoves
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
  const [showStoryModal, setShowStoryModal] = useState(false);
 
  const journeyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setQuizResults, setQuizAnswers } = useQuizStore();
  // Always use the persisted quizAnswers from the store
  const quizAnswers = useQuizStore(s => s.quizAnswers);
  const state = quizAnswers || _state;
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
  const personalityType: PersonalityType = isPersonalityType(dynamicPersonality?.personalityType ?? '')
    ? dynamicPersonality!.personalityType as PersonalityType
    : 'Eco in Progress';
  const emoji = dynamicPersonality?.emoji;
  const story = dynamicPersonality?.story;
  const avatar = undefined; // Not in canonical type
  const nextAction = dynamicPersonality?.nextAction;
  const badge = dynamicPersonality?.badge;
  const champion = undefined; // Not in canonical type
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

  // Update the profile image logic to use the new archetype from comprehensivePowerMoves
  const archetype = dynamicPersonality?.comprehensivePowerMoves?.personality?.archetype;
  const profileImage = dynamicPersonality && archetype ? 
    getPersonalityImage(archetype as PersonalityType, gender) : 
    (dynamicPersonality ? getPersonalityImage(personalityType, gender) : '');

  // Update generateStory to use backend data everywhere
  const generateStory = async () => {
    if (!state || !dynamicPersonality) {
      console.error('State or personality is undefined');
      return;
    }

    // Use backend data for story input
    const storyInput = {
      name: state.name || 'Eco Hero',
      ecoPersonality: dynamicPersonality.personalityType || '', // from backend
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

  const currentMilestone = dynamicPersonality ? milestoneOrder.indexOf(dynamicPersonality.personalityType || '') : 0;
  const nextMilestone = currentMilestone < milestoneOrder.length - 1 
    ? milestoneOrder[currentMilestone + 1] 
    : milestoneOrder[currentMilestone];

  const totalMilestones = 7;
  const progressPercent = Math.max(0, Math.round((currentMilestone / totalMilestones) * 100));
  const userName = state?.name || 'Eco Hero';
  // Update the share text to use dynamicPersonality
  const shareText = dynamicPersonality 
    ? `I'm a ${dynamicPersonality.personalityType || ''} on my sustainability journey! 🌱 What's your eco-personality?`
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
      personality: dynamicPersonality.personalityType || '',
      name: userName,
      co2Saved: `${(16 - emissions).toFixed(1)} tons`,
      topCategory: (dynamicPersonality.dominantCategory || '').charAt(0).toUpperCase() + (dynamicPersonality.dominantCategory || '').slice(1),
      nextStep: recommendations[0]?.title || '',
      badge: dynamicPersonality.badge,
      shareText: `@${userName.replace(/\s+/g, '')} saved ${(16 - emissions).toFixed(1)} tons CO₂ this year! 🌍 Top Habit: ${recommendations[0]?.title || ''} 🌿 Role: ${dynamicPersonality.personalityType || ''} 🏅 Badge: ${dynamicPersonality.badge} #EcoWrapped #ImpactInAction`,
    },
  ] : [];

  useEffect(() => {
    if (showWrapped) {
      setTimeout(async () => {
        const cardId = 'story-card-' + ((dynamicPersonality?.personalityType || '').replace(/\s+/g, '-'));
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
      // Demographics
      name: state.name,
      email: state.email,
      age: state.age,
      gender: state.gender,
      profession: state.profession,
      location: state.location,
      country: state.country,
      householdSize: state.householdSize,
      // Home Energy
      homeSize: state.homeSize as '' | '1' | '2' | '3' | '4' | '5' | '6' | '7+' | undefined,
      homeEfficiency: state.homeEfficiency as '' | 'A' | 'B' | 'C' | undefined,
      energyManagement: state.energyManagement as '' | 'A' | 'B' | 'C' | undefined,
      electricityKwh: state.electricityKwh,
      naturalGasTherm: state.naturalGasTherm,
      heatingOilGallons: state.heatingOilGallons,
      propaneGallons: state.propaneGallons,
      usesRenewableEnergy: state.usesRenewableEnergy,
      hasEnergyEfficiencyUpgrades: state.hasEnergyEfficiencyUpgrades,
      hasSmartThermostats: state.hasSmartThermostats,
      hasEnergyStarAppliances: state.hasEnergyStarAppliances,
      // Transportation
      primaryTransportMode: state.primaryTransportMode as '' | 'A' | 'B' | 'C' | 'D' | undefined,
      carProfile: state.carProfile as '' | 'A' | 'B' | 'C' | 'D' | 'E' | undefined,
      weeklyKm: state.weeklyKm,
      costPerMile: state.costPerMile,
      longDistanceTravel: state.longDistance as '' | 'A' | 'B' | 'C' | undefined,
      // Food & Diet
      dietType: state.dietType as 'VEGAN' | 'VEGETARIAN' | 'FLEXITARIAN' | 'MEAT_MODERATE' | 'MEAT_HEAVY' | undefined,
      plateProfile: state.plateProfile as '' | 'A' | 'B' | 'C' | undefined,
      monthlyDiningOut: state.monthlyDiningOut as '' | 'A' | 'B' | 'C' | 'D' | undefined,
      plantBasedMealsPerWeek: state.plantBasedMealsPerWeek,
      // Waste
      waste: state.waste ? {
        prevention: state.waste.prevention as '' | 'A' | 'B' | 'C' | 'D' | undefined,
        management: state.waste.management as '' | 'A' | 'B' | 'C' | undefined,
        smartShopping: state.waste.smartShopping as '' | 'A' | 'B' | 'C' | undefined,
        dailyWaste: state.waste.dailyWaste as '' | 'A' | 'B' | 'C' | 'D' | undefined,
        repairOrReplace: typeof state.waste.repairOrReplace === 'string' ? state.waste.repairOrReplace as '' | 'A' | 'B' | 'C' | undefined : '',
      } : undefined,
      // Air Quality
      airQuality: state.airQuality ? {
        outdoorAirQuality: state.airQuality.outdoorAirQuality as '' | 'A' | 'B' | 'C' | 'D' | 'E' | undefined,
        aqiMonitoring: state.airQuality.aqiMonitoring as '' | 'A' | 'B' | 'C' | undefined,
        indoorAirQuality: state.airQuality.indoorAirQuality as '' | 'A' | 'B' | 'C' | 'D' | undefined,
        airQualityCommuting: state.airQuality.airQualityCommuting as '' | 'A' | 'B' | 'C' | 'D' | undefined,
        airQualityImpact: state.airQuality.impact as '' | 'A' | 'B' | 'C' | 'D' | undefined,
      } : undefined,
      // Clothing
      clothing: state.clothing ? {
        wardrobeImpact: state.clothing.wardrobeImpact as '' | 'A' | 'B' | 'C' | undefined,
        mindfulUpgrades: state.clothing.mindfulUpgrades as '' | 'A' | 'B' | 'C' | undefined,
        durability: state.clothing.durability as '' | 'A' | 'B' | 'C' | undefined,
        consumptionFrequency: state.clothing.consumptionFrequency as '' | 'A' | 'B' | 'C' | 'D' | undefined,
        brandLoyalty: state.clothing.brandLoyalty as '' | 'A' | 'B' | 'C' | 'D' | undefined,
      } : undefined,
    };
  };

  const calculateInitialPersonality = async () => {
    // Prevent duplicate calls
    if (isLoading || dynamicPersonality || hasAttemptedCalculation.current) return;
    
    try {
      hasAttemptedCalculation.current = true;
      setIsLoading(true);
      setError(null);

      // Use the comprehensivePowerMoves prop if available, otherwise use fallback
      if (comprehensivePowerMoves) {
        // Use the data passed from Quiz.tsx
        setDynamicPersonality({
          personalityType: comprehensivePowerMoves.personality?.archetype || 'Eco in Progress',
          description: comprehensivePowerMoves.personality?.description || 'Your unique approach to sustainability combines awareness with action.',
          strengths: [],
          nextSteps: [],
          categoryScores: {
            home: { score: categoryEmissions.home, percentage: 0, maxPossible: 10, maxPossibleScore: 10 },
            transport: { score: categoryEmissions.transport, percentage: 0, maxPossible: 10, maxPossibleScore: 10 },
            food: { score: categoryEmissions.food, percentage: 0, maxPossible: 10, maxPossibleScore: 10 },
            waste: { score: categoryEmissions.waste, percentage: 0, maxPossible: 10, maxPossibleScore: 10 }
          },
          impactMetrics: {
            carbonReduced: emissions.toString(),
            treesPlanted: Math.round(emissions / 0.02),
            communityImpact: Math.round(emissions * 10)
          },
          finalScore: score,
          powerMoves: [],
          comprehensivePowerMoves: comprehensivePowerMoves,
          dominantCategory: Object.entries(categoryEmissions)
            .reduce((a, b) => (a[1] > b[1] ? a : b))[0],
          emoji: '🌱',
          badge: 'Eco Explorer',
          story: comprehensivePowerMoves.personality?.description || 'Your sustainability journey is unique and meaningful.',
          nextAction: 'Start your journey'
        });
      } else {
        // Fallback: Make API call only if no comprehensivePowerMoves are provided
        const apiResponses = transformStateToApiFormat(state);
        const payload = quizAnswers && quizAnswers.personalityTraits
          ? { ...apiResponses, personalityTraits: quizAnswers.personalityTraits }
          : apiResponses;
        const result = await calculatePersonality(payload) as any;

        setDynamicPersonality({
          personalityType: isPersonalityType(result.personalityType) ? result.personalityType : 'Eco in Progress',
          description: result.description,
          strengths: result.strengths,
          nextSteps: result.nextSteps,
          categoryScores: result.categoryScores,
          impactMetrics: result.impactMetrics,
          finalScore: result.finalScore,
          powerMoves: result.powerMoves,
          comprehensivePowerMoves: result.comprehensivePowerMoves || {
            personality: {
              archetype: 'Eco in Progress',
              decision: 'Analyst',
              action: 'Planner',
              description: 'Your unique approach to sustainability combines awareness with action.',
              hookLine: 'You combine awareness with action.'
            },
            powerMoves: {
              powerHabit: 'You already practice sustainable habits.',
              powerMove: 'Start with one small change this week.',
              stretchCTA: 'Want to go further? Try one new sustainable habit.'
            },
            tone: 'supportive, intelligent, honest, warm'
          },
          dominantCategory: Object.entries(result.categoryScores)
            .reduce((a, b) => (a[1].score > b[1].score ? a : b))[0],
          emoji: '🌱',
          badge: 'Eco Explorer',
          story: result.description,
          nextAction: result.nextSteps[0] || 'Start your journey'
        });
      }

      console.log('Set dynamic personality from props:', {
        score,
        emissions,
        categoryEmissions,
        hasComprehensivePowerMoves: !!comprehensivePowerMoves,
        archetype: comprehensivePowerMoves?.personality?.archetype,
        hookLine: comprehensivePowerMoves?.personality?.hookLine
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

  // Update useEffect to store results
  useEffect(() => {
    if (dynamicPersonality) {
      setQuizResults(dynamicPersonality);
      // Also store quiz answers separately for recommendations
      setQuizAnswers(state);
    }
  }, [dynamicPersonality, setQuizResults, setQuizAnswers, state]);

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

  // Add this button in the appropriate section of your JSX
  const renderRecommendationsButton = () => (
    <Button
      onClick={() => navigate('/recommendations')}
      className="w-full text-white rounded-lg shadow transition text-lg py-3 font-semibold mt-4"
      style={{ backgroundColor: '#5E1614' }}
    >
      View Personalized Recommendations
    </Button>
  );

  return (
    <ErrorBoundary>
      <div className={cn(
        "min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-warm-100 transition-opacity duration-500 relative overflow-hidden",
        isVisible ? "opacity-100" : "opacity-0"
      )}>
        {/* Floating Elements Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-sage-200/30 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-cream-300/40 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-warm-200/50 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-5 h-5 bg-sage-300/30 rounded-full animate-float-delayed"></div>
            </div>

        <div className="max-w-4xl mx-auto px-6 py-12 space-y-16 relative z-10">
          {/* Back Button */}
          {onBack && (
            <div className="flex justify-start mb-8">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex items-center gap-2 text-sage-700 border-sage-200 hover:bg-sage-50 hover:border-sage-300 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Quiz
              </Button>
          </div>
          )}
          
           {/* Profile Section */}
           <div className="flex flex-col items-center justify-center">
             
             {/* Main Avatar */}
             <div className="relative mb-6">
               <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-sage-200 shadow-lg">
                 <img
                   src={profileImage}
                   alt="Profile Avatar"
                   className="w-full h-full object-cover"
                 />
               </div>
             </div>
             
             {/* Personality Name */}
             <h1 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4 text-center">
               {dynamicPersonality?.comprehensivePowerMoves?.personality?.archetype || 'Eco in Progress'}
             </h1>
             

             
             {/* Hook Line */}
             <div className="text-center max-w-2xl mx-auto mb-4">
               <p className="text-lg font-medium text-sage-700 italic">
                 {dynamicPersonality?.comprehensivePowerMoves?.personality?.hookLine || "Your unique approach to sustainability combines awareness with action."}
               </p>
             </div>
             
             {/* Detailed Personality Description */}
             <div className="text-center max-w-2xl mx-auto mb-6">
               <p className="text-base text-sage-600 leading-relaxed">
                 {dynamicPersonality?.comprehensivePowerMoves?.personality?.description || "Your unique approach to sustainability combines awareness with action, creating meaningful change through thoughtful choices."}
               </p>
             </div>
             
             {/* Debug Info */}
             {process.env.NODE_ENV === 'development' && (
               <div className="text-xs text-gray-500 mt-2">
                 API Description: {dynamicPersonality?.comprehensivePowerMoves?.personality?.description?.substring(0, 100)}...
               </div>
             )}
             

           </div>

           {/* Impact Metrics Section - Speedometer Gauge (Hidden) */}
           {/* <div className="space-y-8">
             <div className="text-center space-y-4">
               <h2 className="text-3xl md:text-4xl font-serif text-sage-800">
                 Your Impact Metrics
               </h2>
               <p className="text-lg text-sage-600 max-w-2xl mx-auto">
                 See how your sustainable choices are making a difference
               </p>
             </div>
             
             <div className="flex justify-center">
               <SpeedometerGauge 
                 value={Number(dynamicPersonality?.impactMetrics?.carbonReduced || 0)} 
                 max={10} 
               />
             </div>
           </div> */}

           {/* Three Action Buttons */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
             {/* Generate Your Story Button */}
             <button 
               className="group bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-2xl hover:scale-105 hover:border-gray-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-50 cursor-pointer transform active:scale-95"
               onClick={async () => {
                 await generateStory();
                 setShowStoryModal(true);
               }}
               disabled={isGeneratingStory}
               aria-label="Generate your sustainability story"
             >
               <div className="text-center space-y-4">
                 <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                   <BookOpen className="h-6 w-6 text-black" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">Generate Your Story</h3>
                 <p className="text-sm text-gray-600">Discover your unique sustainability journey and share it with others</p>
                 <div className="mt-4">
                   <div className="w-16 h-16 mx-auto">
                     <svg viewBox="0 0 64 64" className="w-full h-full">
                       <path d="M32 8c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8z" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"/>
                       <circle cx="24" cy="28" r="2" fill="currentColor" className="text-black"/>
                       <circle cx="40" cy="28" r="2" fill="currentColor" className="text-black"/>
                       <path d="M20 36c0 0 4 4 12 4s12-4 12-4" fill="none" stroke="currentColor" strokeWidth="2" className="text-black"/>
                     </svg>
                   </div>
                 </div>
                 {/* Click indicator */}
                 <div className="text-xs text-gray-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                   Click to explore →
                 </div>
               </div>
             </button>

             {/* Recommendations Button */}
             <button 
               className="group bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-2xl hover:scale-105 hover:border-gray-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-50 cursor-pointer transform active:scale-95"
               onClick={() => navigate('/recommendations')}
               aria-label="Get personalized recommendations"
             >
               <div className="text-center space-y-4">
                 <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                   <Lightbulb className="h-6 w-6 text-black" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">Personalized Recommendations</h3>
                 <p className="text-sm text-gray-600">Get tailored suggestions based on your lifestyle and goals</p>
                 <div className="mt-4">
                   <div className="w-16 h-16 mx-auto">
                     <svg viewBox="0 0 64 64" className="w-full h-full">
                       <rect x="16" y="20" width="32" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"/>
                       <line x1="16" y1="28" x2="48" y2="28" stroke="currentColor" strokeWidth="2" className="text-black"/>
                       <line x1="16" y1="36" x2="48" y2="36" stroke="currentColor" strokeWidth="2" className="text-black"/>
                       <line x1="16" y1="44" x2="40" y2="44" stroke="currentColor" strokeWidth="2" className="text-black"/>
                       <circle cx="12" cy="16" r="2" fill="currentColor" className="text-black"/>
                       <circle cx="20" cy="16" r="2" fill="currentColor" className="text-black"/>
                     </svg>
                   </div>
                 </div>
                 {/* Click indicator */}
                 <div className="text-xs text-gray-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                   Click to discover →
                 </div>
               </div>
             </button>

             {/* Journalize Button */}
             <button 
               className="group bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-2xl hover:scale-105 hover:border-gray-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-50 cursor-pointer transform active:scale-95"
               onClick={() => console.log('Journalize clicked')}
               aria-label="Journalize your sustainability journey"
             >
               <div className="text-center space-y-4">
                 <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                   <PenTool className="h-6 w-6 text-black" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">Journalize Your Journey</h3>
                 <p className="text-sm text-gray-600">Reflect on your progress and track your sustainability growth</p>
                 <div className="mt-4">
                   <div className="w-16 h-16 mx-auto">
                     <svg viewBox="0 0 64 64" className="w-full h-full">
                       <rect x="16" y="12" width="32" height="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"/>
                       <line x1="20" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="1" className="text-black"/>
                       <line x1="20" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1" className="text-black"/>
                       <line x1="20" y1="28" x2="44" y2="28" stroke="currentColor" strokeWidth="1" className="text-black"/>
                       <line x1="20" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="1" className="text-black"/>
                       <line x1="20" y1="36" x2="44" y2="36" stroke="currentColor" strokeWidth="1" className="text-black"/>
                       <line x1="20" y1="40" x2="44" y2="40" stroke="currentColor" strokeWidth="1" className="text-black"/>
                       <rect x="20" y="44" width="8" height="4" fill="currentColor" className="text-black"/>
                       <rect x="36" y="44" width="8" height="4" fill="currentColor" className="text-black"/>
                       <circle cx="12" cy="16" r="1" fill="currentColor" className="text-black"/>
                       <circle cx="20" cy="16" r="1" fill="currentColor" className="text-black"/>
                     </svg>
                   </div>
                 </div>
                 {/* Click indicator */}
                 <div className="text-xs text-gray-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                   Click to reflect →
                 </div>
               </div>
             </button>
           </div>

                                      {/* Power Moves Grid - Using New Comprehensive System */}
           <div className="space-y-8">
             <div className="text-center space-y-4">
               <h2 className="text-3xl md:text-4xl font-serif text-sage-800">
                 Your Power Moves
              </h2>
               <p className="text-lg text-sage-600 max-w-2xl mx-auto">
                 These gentle actions are your superpowers for creating positive change
               </p>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Card 1: Power Habit */}
               <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20">
                   <div className="w-full h-full" style={{
                     backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(34, 197, 94, 0.1) 8px, rgba(34, 197, 94, 0.1) 16px)`
                   }}></div>
                 </div>
                 <div className="relative z-10 space-y-4">
                   <div className="w-16 h-16 mx-auto flex items-center justify-center">
                     <Heart className="w-12 h-12 text-green-600" />
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 text-center">Your Power Habit</h3>
                   <p className="text-sm text-gray-600 text-center">
                     {dynamicPersonality?.comprehensivePowerMoves?.powerMoves?.powerHabit || 
                      "You're taking steps toward sustainability — every small action counts and builds momentum."}
                   </p>
                 </div>
               </div>

               {/* Card 2: Power Move */}
               <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20">
                   <div className="w-full h-full" style={{
                     backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(147, 51, 234, 0.1) 8px, rgba(147, 51, 234, 0.1) 16px)`
                   }}></div>
                 </div>
                 <div className="relative z-10 space-y-4">
                   <div className="w-16 h-16 mx-auto flex items-center justify-center">
                     <Zap className="w-12 h-12 text-purple-600" />
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 text-center">Your Power Move</h3>
                   <p className="text-sm text-gray-600 text-center">
                     {dynamicPersonality?.comprehensivePowerMoves?.powerMoves?.powerMove || 
                      "Try creating a 7-day visual tracker to improve one small habit. Builders like you thrive on small systems."}
                   </p>
                 </div>
               </div>

               {/* Card 3: Stretch CTA */}
               <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20">
                   <div className="w-full h-full" style={{
                     backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(59, 130, 246, 0.1) 8px, rgba(59, 130, 246, 0.1) 16px)`
                   }}></div>
                 </div>
                 <div className="relative z-10 space-y-4">
                   <div className="w-16 h-16 mx-auto flex items-center justify-center">
                     <Target className="w-12 h-12 text-blue-600" />
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 text-center">Go Further</h3>
                   <p className="text-sm text-gray-600 text-center">
                     {dynamicPersonality?.comprehensivePowerMoves?.powerMoves?.stretchCTA || 
                      "Want to go further? Choose one area to focus on and build sustainable habits over time."}
                   </p>
                 </div>
               </div>

               {/* Card 4: Personality Archetype */}
               <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 shadow-lg border border-amber-200 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20">
                   <div className="w-full h-full" style={{
                     backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(245, 158, 11, 0.1) 8px, rgba(245, 158, 11, 0.1) 16px)`
                   }}></div>
                 </div>
                 <div className="relative z-10 space-y-4">
                   <div className="w-16 h-16 mx-auto flex items-center justify-center">
                     <Sparkles className="w-12 h-12 text-amber-600" />
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 text-center">
                     {dynamicPersonality?.comprehensivePowerMoves?.personality?.archetype || 'Your Archetype'}
                   </h3>
                   <p className="text-sm text-gray-600 text-center">
                     {dynamicPersonality?.comprehensivePowerMoves?.personality?.description || 
                      "You break big goals into steps. You co-create small experiments with others and build lasting systems that grow over time."}
                   </p>
                 </div>
               </div>

               {/* Card 5: Decision Style */}
               <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-emerald-200 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20">
                   <div className="w-full h-full" style={{
                     backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(16, 185, 129, 0.1) 8px, rgba(16, 185, 129, 0.1) 16px)`
                   }}></div>
                 </div>
                 <div className="relative z-10 space-y-4">
                   <div className="w-16 h-16 mx-auto flex items-center justify-center">
                     <Brain className="w-12 h-12 text-emerald-600" />
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 text-center">Decision Style</h3>
                   <p className="text-sm text-gray-600 text-center">
                     {dynamicPersonality?.comprehensivePowerMoves?.personality?.decision || 'Connector'}
                   </p>
                 </div>
               </div>

               {/* Card 6: Action Style */}
               <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-6 shadow-lg border border-rose-200 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20">
                   <div className="w-full h-full" style={{
                     backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(244, 63, 94, 0.1) 8px, rgba(244, 63, 94, 0.1) 16px)`
                   }}></div>
                 </div>
                 <div className="relative z-10 space-y-4">
                   <div className="w-16 h-16 mx-auto flex items-center justify-center">
                     <ArrowRight className="w-12 h-12 text-rose-600" />
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 text-center">Action Style</h3>
                   <p className="text-sm text-gray-600 text-center">
                     {dynamicPersonality?.comprehensivePowerMoves?.personality?.action || 'Experimenter'}
                   </p>
                 </div>
               </div>
             </div>
           </div>



                    {/* Progress Visual - Flower Ring */}
        <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif text-sage-800">
                🌸 Your Actions Are Blooming
              </h2>
              <p className="text-lg text-sage-600 max-w-2xl mx-auto">
                Each petal represents a habit you've embraced
              </p>
            </div>

            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                {/* Flower Ring Progress */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Outer Ring - Completed Habits */}
                    <div className="absolute inset-0 rounded-full border-8 border-sage-200"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-8 border-sage-400"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 25 * Math.cos(0)}% ${50 + 25 * Math.sin(0)}%, ${50 + 25 * Math.cos(0.2)}% ${50 + 25 * Math.sin(0.2)}%, ${50 + 25 * Math.cos(0.4)}% ${50 + 25 * Math.sin(0.4)}%, ${50 + 25 * Math.cos(0.6)}% ${50 + 25 * Math.sin(0.6)}%, ${50 + 25 * Math.cos(0.8)}% ${50 + 25 * Math.sin(0.8)}%, 50% 50%)`
                      }}
                    ></div>
                    
                    {/* Petals */}
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className={`absolute w-8 h-8 rounded-full transform transition-all duration-500 ${
                          i < 5 ? 'bg-sage-400' : 'bg-sage-200'
                        }`}
                        style={{
                          left: `${50 + 35 * Math.cos((i * Math.PI * 2) / 8)}%`,
                          top: `${50 + 35 * Math.sin((i * Math.PI * 2) / 8)}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-sage-700">
                      {dynamicPersonality?.impactMetrics?.carbonReduced || '0.0'}
                    </div>
                    <div className="text-sm text-sage-600">tons saved</div>
                    <div className="text-xs text-sage-500">= {dynamicPersonality?.impactMetrics?.treesPlanted || 0} trees</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reflection Prompt */}
            <div className="text-center space-y-6">
              <h3 className="text-xl font-serif text-sage-800">
                How did this feel?
              </h3>
              
              {/* Mood Buttons */}
              <div className="flex justify-center gap-4">
                {['😊', '🧘‍♀️', '🌱', '😌', '😢'].map((emoji, index) => (
                  <button
                    key={index}
                    className="w-12 h-12 rounded-full bg-white border-2 border-sage-200 hover:border-sage-400 hover:scale-110 transition-all duration-200 text-2xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Micro-journaling */}
              <div className="max-w-md mx-auto">
                <textarea
                  placeholder="Write one word for your future self..."
                  className="w-full p-4 border-2 border-sage-200 rounded-xl bg-white/80 text-sage-700 placeholder-sage-400 resize-none focus:border-sage-400 focus:outline-none transition-colors"
                  rows={3}
                ></textarea>
              </div>
            </div>
          </div>

        </div>

        {/* Story Generation Section - Keep Exactly As Is */}
        <div className="space-y-8 mt-16">
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
                      setCurrentCardIndex(0);
                      setStoryCards([]);
                      setNarrativeStory(null);
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
                  personality={personalityType}
                  profileImage={getPersonalityImage(personalityType, gender)}
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
                  personality={personalityType}
                  profileImage={getPersonalityImage(personalityType, gender)}
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

        {/* Story Modal */}
        {showStoryModal && (
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
              className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              {/* Story Header with Actions */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-sage-600" />
                  <h2 className="text-2xl font-bold text-sage-800">Your Climate Journey Story</h2>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowWrapped(true)}
                    className={cn(
                      "text-green-700 border-green-200 px-4 py-2",
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
                      setCurrentCardIndex(0);
                      setStoryCards([]);
                      setNarrativeStory(null);
                    }}
                    className="text-green-700 border-green-200 px-4 py-2"
                  >
                    Reset Story
                  </Button>
                  <button
                    onClick={() => setShowStoryModal(false)}
                    className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-8">
                {!showStory ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-purple-600" />
                      </div>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover your unique sustainability journey and share it with others
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                      <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-purple-500" />
                          <span className="font-medium text-purple-900">Personalized</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Tailored to your unique sustainability journey and choices
                        </p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Share2 className="h-5 w-5 text-blue-500" />
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
            </motion.div>
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default ResultsDisplay;
