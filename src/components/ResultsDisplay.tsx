import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Download, Share2, Leaf, Info, Car, Utensils, Plane, Zap, Trash2, Home,
  Bike, Bus, Train, Apple, Beef, PackageCheck, Recycle, Battery, Wind, Share, Loader2, Check, BookOpen,
  Book, Star, Sparkles, Trophy, Heart, 
  Lightbulb, Users, Target, ArrowRight, ShoppingBag, Droplet, Shirt 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { determineEcoPersonality, assignEcoPersonality, PersonalityDetails } from '@/utils/ecoPersonality';
import useSound from 'use-sound';
import { EcoAvatar } from '@/components/EcoAvatar';
import { getOutfitForPersonality, getAccessoryForPersonality, getBackgroundForCategory } from '@/utils/ecoPersonality';
import { Badge } from '@/components/ui/badge';
import { ClimateChampions } from '@/components/ClimateChampions';
import { Progress } from "@/components/ui/progress";
import { SustainabilityJourney } from './SustainabilityJourney';
import { impactMappings } from '@/utils/impactMappings';

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

interface ResultsDisplayProps {
  score: number;
  emissions: number;
  categoryEmissions: CategoryEmissions;
  recommendations: Recommendation[];
  isVisible: boolean;
  onReset: () => void;
  state: any;
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

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  score,
  emissions,
  categoryEmissions,
  recommendations,
  isVisible,
  onReset,
  state
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPersonalityLoading, setIsPersonalityLoading] = useState(true);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [playRevealSound] = useSound('/sounds/reveal.mp3', { 
    onError: (e) => console.error('Error playing reveal sound:', e) 
  });
  const [playSuccessSound] = useSound('/sounds/success.mp3', { 
    onError: (e) => console.error('Error playing success sound:', e) 
  });

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
    waste: (state?.waste?.wastePrevention === 'A' ? 3 : state?.waste?.wastePrevention === 'B' ? 2 : 1) +
           (state?.waste?.wasteManagement === 'A' ? 3 : state?.waste?.wasteManagement === 'B' ? 2 : 1)
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

  const generateStory = async () => {
    console.log('Starting story generation...');
    if (!state) {
      console.error('State is undefined');
      return;
    }

    try {
      setIsGeneratingStory(true);
      console.log('Set loading state to true');
      
      try {
        await playRevealSound();
      } catch (e) {
        console.warn('Could not play reveal sound:', e);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const personality = determineEcoPersonality(state);
      console.log('Generated personality:', personality);

      // Generate personalized achievements
      let achievements = [];
      
      // Transport achievements
      if (state.primaryTransportMode === 'WALK_BIKE') {
        achievements.push('choosing active transport like walking and cycling');
      } else if (state.primaryTransportMode === 'PUBLIC') {
        achievements.push('regularly using public transportation');
      }

      // Diet achievements
      if (state.dietType === 'VEGAN') {
        achievements.push('maintaining a plant-based diet');
      } else if (state.dietType === 'VEGETARIAN') {
        achievements.push('choosing vegetarian meals');
      }

      // Energy achievements
      if (state.usesRenewableEnergy) {
        achievements.push('switching to renewable energy sources');
      }
      if (state.hasEnergyEfficiencyUpgrades) {
        achievements.push('implementing energy-efficient home improvements');
      }

      // Waste achievements
      if (state.waste?.recyclingPercentage > 75) {
        achievements.push('maintaining a high recycling rate');
      }
      if (state.waste?.minimizesWaste) {
        achievements.push('actively reducing waste production');
      }

      // Format achievements nicely
      const achievementText = achievements.length > 0
        ? `You've made significant strides by ${achievements.join(', and ')}.`
        : 'You are taking your first steps towards a more sustainable lifestyle.';

      // Calculate impact metrics
      const treesPlanted = Math.round((16 - emissions) * 10);
      const carbonReduced = (16 - emissions).toFixed(1);
      const communityImpact = Math.round(score / 2);

      // Determine next challenge area
      const weakestCategory = Object.entries(categoryScores)
        .sort(([,a], [,b]) => a - b)[0][0];
      
      const nextSteps = {
        home: 'exploring home energy efficiency upgrades',
        transport: 'considering more sustainable transportation options',
        food: 'adopting more plant-based meal choices',
        waste: 'implementing better waste reduction practices'
      };

      // Generate the personalized story
      const story = `As a ${personality?.title || 'sustainability champion'}, your journey towards a greener future has been inspiring. ${achievementText}

Through your conscious choices, you've prevented ${carbonReduced} tons of CO₂ emissions from entering our atmosphere - equivalent to planting ${treesPlanted} trees! Your actions in ${dominantCategory} have been particularly impactful, and you're inspiring approximately ${communityImpact} people in your community to adopt more sustainable practices.

Your next opportunity for growth lies in ${nextSteps[weakestCategory as keyof typeof nextSteps]}. Every step you take brings us closer to a more sustainable world. Keep up the amazing work!`;
      
      console.log('Generated story:', story);
      setGeneratedStory(story);
      
      try {
        await playSuccessSound();
      } catch (e) {
        console.warn('Could not play success sound:', e);
      }
    } catch (error) {
      console.error('Error in story generation:', error);
      setGeneratedStory("Your journey in sustainable living is making a positive impact on our planet. Every small change you make contributes to a greener future.");
    } finally {
      console.log('Resetting loading state...');
      setIsGeneratingStory(false);
    }
  };

  const sharePDF = async () => {
    try {
      // Create a temporary element to hold the content
      const content = document.createElement('div');
      content.className = 'p-8 bg-white';
      
      // Add the content to the temporary element
      content.innerHTML = `
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold mb-4">Your Carbon Footprint Report</h1>
          <p class="text-gray-600">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Summary</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-600">Total Emissions</p>
              <p class="text-2xl font-bold">${emissions.toFixed(2)} tons CO₂e/year</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-600">Sustainability Score</p>
              <p class="text-2xl font-bold">${score.toFixed(0)}/100</p>
            </div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Emissions by Category</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-600">Home Energy</p>
              <p class="text-xl font-bold">${categoryEmissions.home.toFixed(2)} tons</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-600">Transport</p>
              <p class="text-xl font-bold">${categoryEmissions.transport.toFixed(2)} tons</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-600">Food</p>
              <p class="text-xl font-bold">${categoryEmissions.food.toFixed(2)} tons</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-600">Waste</p>
              <p class="text-xl font-bold">${categoryEmissions.waste.toFixed(2)} tons</p>
            </div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Recommendations</h2>
          <div class="space-y-4">
            ${recommendations.map(rec => `
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium">${rec.category}</span>
                  <span class="text-sm px-2 py-1 rounded-full ${
                    rec.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }">${rec.difficulty}</span>
                </div>
                <h3 class="text-lg font-semibold mb-2">${rec.title}</h3>
                <p class="text-gray-600 mb-2">${rec.description}</p>
                <p class="text-sm text-green-700">${rec.impact}</p>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="text-center text-gray-500 text-sm">
          <p>Generated by Carbon Footprint Calculator</p>
          <p>www.carbonfootprintcalculator.com</p>
        </div>
      `;

      // Use html2pdf library to generate PDF
      const opt = {
        margin: 1,
        filename: 'carbon-footprint-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Import html2pdf dynamically
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set(opt).from(content).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  // Map state to scored responses (0-2 per answer, grouped by category)
  function mapStateToScoredResponses(state: any) {
    // This mapping should be adapted to your actual state structure and scoring logic
    return {
      "Transportation": {
        commute: state.primaryTransportMode === 'WALK_BIKE' ? 2 : state.primaryTransportMode === 'PUBLIC' ? 1 : 0,
        electric_vehicle: state.carProfile === 'A' ? 2 : state.carProfile === 'B' ? 1 : 0,
        annual_miles: state.annualMiles < 5000 ? 2 : state.annualMiles < 10000 ? 1 : 0
      },
      "Home Energy": {
        energy_monitoring: state.energyManagement === 'A' ? 2 : state.energyManagement === 'B' ? 1 : 0,
        renewable_energy: state.usesRenewableEnergy ? 2 : 0,
        appliances: state.hasEnergyEfficiencyUpgrades ? 2 : 0
      },
      "Food & Diet": {
        meat_frequency: state.dietType === 'VEGAN' ? 2 : state.dietType === 'VEGETARIAN' ? 1 : 0,
        local_food: state.buysLocalFood ? 2 : 0,
        composting: state.composting ? 2 : 0
      },
      "Waste": {
        recycling: state.waste?.recyclingPercentage > 75 ? 2 : state.waste?.recyclingPercentage > 50 ? 1 : 0,
        plastic_avoidance: state.waste?.avoidsPlastic ? 2 : 0,
        reusing_items: state.waste?.minimizesWaste ? 2 : 0
      },
      "Clothing": {
        buying_frequency: state.clothing?.buyingFrequency === 'RARELY' ? 2 : state.clothing?.buyingFrequency === 'SOMETIMES' ? 1 : 0,
        eco_consideration: state.clothing?.ecoConsideration ? 2 : 0
      },
      "Air Quality": {
        outdoor_check: state.airQuality?.outdoorCheck ? 2 : 0,
        indoor_monitoring: state.airQuality?.indoorMonitoring ? 2 : 0
      },
      "Purchasing Habits": {
        lifecycle_eval: state.purchasing?.lifecycleEval ? 2 : 0,
        sustainable_brands: state.purchasing?.sustainableBrands ? 2 : 0
      }
    };
  }

  const scoredResponses = mapStateToScoredResponses(state);
  const dynamicPersonality = assignEcoPersonality(scoredResponses);
  console.log('Your dynamic personality object:', dynamicPersonality);
  // You can now use dynamicPersonality.personality, .emoji, .story, .avatarSuggestion, .nextAction, .badge, .champion
  // For now, use this for the main personality display and story
  const personality = dynamicPersonality;
  // Get display fields from PersonalityDetails
  const personalityDisplay = PersonalityDetails[personality.personality];
  console.log('Personality object:', personality);

  useEffect(() => {
    // Simulate loading time for personality determination
    const timer = setTimeout(() => {
      setIsPersonalityLoading(false);
      try {
        playRevealSound();
        setTimeout(() => playSuccessSound(), 1000);
      } catch (error) {
        console.error('Error playing sounds:', error);
      }
    }, 1500); // Reduced from 2000 to 1500 for better UX

    return () => clearTimeout(timer);
  }, [playRevealSound, playSuccessSound]);

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

  // Before split hero layout, define currentMilestone
  // Define the order of personalities as milestones
  const milestoneOrder = [
    "Certified Climate Snoozer",
    "Doing Nothing for the Planet",
    "Eco in Progress",
    "Kind of Conscious, Kind of Confused",
    "Sustainability Soft Launch",
    "Planet's Main Character",
    "Sustainability Slayer"
  ];
  const currentMilestone = milestoneOrder.indexOf(personality.personality);
  const nextMilestone = currentMilestone < milestoneOrder.length - 1 
    ? milestoneOrder[currentMilestone + 1] 
    : milestoneOrder[currentMilestone];

  const totalMilestones = 7;
  const progressPercent = Math.max(0, Math.round((currentMilestone / totalMilestones) * 100));
  const userName = state?.name || 'Eco Hero';
  const shareText = `I'm a ${personality.personality} on my sustainability journey! 🌱 What's your eco-personality?`;

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

  function generateImpactHighlights(state, impactMappings) {
    const highlights = [];
    Object.keys(impactMappings).forEach((key) => {
      const userResponse = state[key];
      const mapping = impactMappings[key]?.[userResponse];
      if (mapping) {
        highlights.push({
          key,
          ...mapping,
        });
      }
    });
    return highlights;
  }

  const highlights = generateImpactHighlights(state, impactMappings);

  return (
    <div 
      className={cn(
        "max-w-[1400px] mx-auto px-8 py-12 space-y-12 transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
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
            {/* Personality Image */}
            <img
              src="/profile.jpg"
              alt="Personality Illustration"
              className="w-full object-contain bg-green-50 border-b-4 border-green-100 p-4"
              style={{ maxHeight: 320 }}
            />
            <div className="w-full p-8 flex flex-col items-center">
              {/* Personality Description */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{personality.emoji}</span>
                <h2 className="text-2xl font-bold text-green-700 font-serif">{personality.personality}</h2>
              </div>
              <Badge className="mb-2">{personality.badge}</Badge>
              <p className="text-gray-700 text-center mb-2">{personality.story.split('.')[0]}.</p>
              <div className="text-green-700 font-medium mb-2">{personality.nextAction}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-stretch w-full mt-8 justify-center">
          {/* Profile Card */}
          <div className="flex-1 max-w-xl mx-auto bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-2xl p-10 flex flex-col items-center min-h-[460px]">
            {/* Remove Animated Avatar (without progress ring) */}
            {/* Personalized Greeting */}
            <div className="text-lg font-semibold text-green-900 mb-2 text-center">
              Hi {userName}, you're a {personality.personality}!
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{personality.emoji}</span>
              <h2 className="text-2xl font-bold text-green-700 font-serif">{personality.personality}</h2>
            </div>
            <Badge className="mb-2">{personality.badge}</Badge>
            <p className="text-gray-700 text-center mb-2">{personality.story.split('.')[0]}.</p>
            <div className="text-green-700 font-medium mb-4">{personality.nextAction}</div>
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
              "Every small step you take creates a ripple of positive change.”
            </div>
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition text-base font-semibold"
            >
              Share Your Eco-Personality
            </button>
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
        <div className="w-full flex flex-col justify-center bg-white/60 rounded-3xl shadow-2xl p-12 mt-8">
          <h2 className="text-3xl font-serif text-green-700 mb-8 flex items-center gap-3">
            <Leaf className="h-8 w-8 text-green-500" /> Your Sustainability Journey
          </h2>
          <SustainabilityJourney currentMilestone={currentMilestone} score={score} />
        </div>
      </div>

      {/* Eco Story Card */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 overflow-hidden rounded-2xl shadow-lg">
        <CardContent className="p-8 lg:p-12 space-y-12">
          {/* Hero Section with Personality */}
          <div className="relative">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Personality Info (keep only this, remove avatar on right) */}
              {/* Avatar Display removed */}
            </div>
          </div>

          {/* Impact Highlights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Impact Stats */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-7 w-7 text-yellow-500" />
                <h3 className="text-2xl font-serif text-gray-800">Your Impact Highlights</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-gray-500">Planet Saved</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {(16 - emissions).toFixed(1)}
                    <span className="text-sm font-normal text-gray-500 ml-1">tons CO₂</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Equivalent to planting {Math.round((16 - emissions) * 10)} trees
                  </p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-500">Top Category</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 capitalize">
                    {dominantCategory}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Leading by example
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
        
            </div>

            {/* Story Preview */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-7 w-7 text-blue-500" />
                <h3 className="text-2xl font-serif text-gray-800">Your Story Highlights</h3>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Keep it up!</h4>
                      <p className="text-base text-green-700 font-semibold">
                        You are part of the <span className="text-green-900 font-bold">5%</span> that does XYZ.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Next Chapter Goal</h4>
                      <p className="text-sm text-gray-600">
                        {score >= 75 
                          ? "Lead your community in sustainable innovation" 
                          : "Level up your impact in " + Object.entries(categoryScores)
                              .sort(([,a], [,b]) => a - b)[0][0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {personalityDisplay.powerMoves && (
                <div className="bg-white/80 rounded-xl border border-green-100 shadow p-6 mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-6 w-6 text-yellow-400 drop-shadow" />
                    <span className="text-xl font-serif font-semibold text-green-800 tracking-tight">Power Moves</span>
                  </div>
                  <hr className="border-green-100 mb-4" />
                  <ul className="list-none pl-0 space-y-3">
                    {personalityDisplay.powerMoves.map((move, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-green-900 text-base font-medium"
                      >
                        <span className="inline-block mt-1">
                          <Star className="h-5 w-5 text-green-400" />
                        </span>
                        <span>{move}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Categories Impact Grid */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="h-7 w-7 text-green-500" />
              <h2 className="text-2xl font-serif text-gray-800">Your impact across categories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {/* Home Category */}
              <div className="bg-white border rounded-2xl p-6 flex flex-col items-start shadow-sm">
                <div className="mb-4">
                  <Home className="h-7 w-7 text-green-600" />
                </div>
                <div className="text-lg font-semibold mb-1">Home</div>
                <div className="text-gray-500 text-sm mb-2">
                  {state?.usesRenewableEnergy ? "Using renewable energy sources" : "Traditional energy consumption"}
                  {state?.hasEnergyEfficiencyUpgrades ? " with efficiency upgrades" : ""}
                </div>
                <div className="mt-auto text-green-700 font-medium">Top 50% for Home</div>
              </div>
              {/* Transport Category */}
              <div className="bg-white border rounded-2xl p-6 flex flex-col items-start shadow-sm">
                <div className="mb-4">
                  <Car className="h-7 w-7 text-blue-600" />
                </div>
                <div className="text-lg font-semibold mb-1">Transport</div>
                <div className="text-gray-500 text-sm mb-2">
                  {state?.primaryTransportMode === 'WALK_BIKE' ? "Primarily using active transport" :
                    state?.primaryTransportMode === 'PUBLIC' ? "Regular public transit user" : "Car-based transportation"}
                </div>
                <div className="mt-auto text-green-700 font-medium">Top 40% for Transport</div>
              </div>
              {/* Food Category */}
              <div className="bg-white border rounded-2xl p-6 flex flex-col items-start shadow-sm">
                <div className="mb-4">
                  <Utensils className="h-7 w-7 text-amber-600" />
                </div>
                <div className="text-lg font-semibold mb-1">Food</div>
                <div className="text-gray-500 text-sm mb-2">
                  {state?.dietType === 'VEGAN' ? "Plant-based diet champion" :
                    state?.dietType === 'VEGETARIAN' ? "Vegetarian diet follower" : "Mixed diet consumer"}
                </div>
                <div className="mt-auto text-green-700 font-medium">Top 30% for Food</div>
              </div>
              {/* Clothes Category */}
              <div className="bg-white border rounded-2xl p-6 flex flex-col items-start shadow-sm">
                <div className="mb-4">
                  <ShoppingBag className="h-7 w-7 text-pink-600" />
                </div>
                <div className="text-lg font-semibold mb-1">Clothes</div>
                <div className="text-gray-500 text-sm mb-2">
                  {state?.clothing?.wardrobeImpact === 'A' ? "Sustainable shopper" :
                    state?.clothing?.wardrobeImpact === 'B' ? "Mix & match" :
                    state?.clothing?.wardrobeImpact === 'C' ? "Trend follower" : "Fashion choices"}
                </div>
                <div className="mt-auto text-green-700 font-medium">Top 35% for Clothes</div>
              </div>
              {/* Waste Category */}
              <div className="bg-white border rounded-2xl p-6 flex flex-col items-start shadow-sm">
                <div className="mb-4">
                  <Recycle className="h-7 w-7 text-purple-600" />
                </div>
                <div className="text-lg font-semibold mb-1">Waste</div>
                <div className="text-gray-500 text-sm mb-2">
                  {state?.waste?.recyclingPercentage > 75 ? "High recycling achiever" :
                    state?.waste?.recyclingPercentage > 50 ? "Active recycler" : "Starting recycling journey"}
                </div>
                <div className="mt-auto text-green-700 font-medium">Top 30% for Waste</div>
              </div>
              {/* Air Quality Category */}
              <div className="bg-white border rounded-2xl p-6 flex flex-col items-start shadow-sm">
                <div className="mb-4">
                  <Wind className="h-7 w-7 text-cyan-600" />
                </div>
                <div className="text-lg font-semibold mb-1">Air Quality</div>
                <div className="text-gray-500 text-sm mb-2">
                  {state?.airQuality?.outdoorAirQuality === 'A' ? "Fresh and clean" :
                    state?.airQuality?.outdoorAirQuality === 'B' ? "Generally clear" :
                    state?.airQuality?.outdoorAirQuality === 'C' ? "Sometimes polluted" :
                    state?.airQuality?.outdoorAirQuality === 'D' ? "Not sure" : "Air quality awareness"}
                </div>
                <div className="mt-auto text-green-700 font-medium">Top 45% for Air Quality</div>
              </div>
            </div>
          </div>

          {/* Story Generation Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              <h2 className="text-3xl font-serif text-gray-800">Your Climate Journey Story</h2>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-green-100">
              <div className="space-y-6">
                <p className="text-lg text-gray-700">
                  Every choice you make writes a new chapter in our planet's story. Let's craft your unique journey of sustainable living.
                </p>
                
                <Button
                  onClick={generateStory}
                  className={cn(
                    "w-full text-white py-6 rounded-xl flex items-center justify-center gap-3 text-lg transition-all duration-300",
                    isGeneratingStory 
                      ? "bg-purple-500 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg"
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
            </div>

            {/* Generated Story Display */}
            {generatedStory && (
              <div 
                className="bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-purple-100 animate-fadeIn"
                style={{
                  animation: 'fadeIn 0.5s ease-out'
                }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-2xl font-serif text-gray-800">Your Journey So Far</h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    {generatedStory}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-sm text-gray-600">
                    <Info className="h-4 w-4" />
                    <span>This story is generated based on your sustainable choices and impact.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6">
            <Button onClick={sharePDF} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-5 w-5" />
              Download Report
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-5 w-5" />
              Share Journey
            </Button>
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
    </div>
  );
};

export default ResultsDisplay;
