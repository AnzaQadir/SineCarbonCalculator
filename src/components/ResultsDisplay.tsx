import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Download, Share2, Leaf, Info, Car, Utensils, Plane, Zap, Trash2, Home,
  Bike, Bus, Train, Apple, Beef, PackageCheck, Recycle, Battery, Wind, Share, Loader2, Check, BookOpen,
  Book, Star, Sparkles, Trophy, Heart, 
  Lightbulb, Users, Target, ArrowRight 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { determineEcoPersonality } from '@/utils/ecoPersonality';
import useSound from 'use-sound';
import { EcoAvatar } from '@/components/EcoAvatar';
import { getOutfitForPersonality, getAccessoryForPersonality, getBackgroundForCategory } from '@/utils/ecoPersonality';
import { Badge } from '@/components/ui/badge';
import { ClimateChampions } from '@/components/ClimateChampions';

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

  // Replace the old getEcoPersonality function with the new one
  const personality = determineEcoPersonality(state);

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
        <h1 className="text-5xl font-serif text-green-700">Your Eco Journey Starts Here</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Every step you take shapes our planet's future. Let's discover your unique path to sustainability.
        </p>
      </div>

      {/* Eco Story Card */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 overflow-hidden rounded-2xl shadow-lg">
        <CardContent className="p-8 lg:p-12 space-y-12">
          {/* Hero Section with Personality */}
          <div className="relative">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Personality Info */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    {isPersonalityLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                    ) : (
                      <span className="text-2xl">{personality.badge}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-4xl font-serif text-gray-800">{personality.title}</h2>
                    <p className="text-lg text-gray-600">{personality.subCategory || 'Green Mobility Champion'}</p>
                  </div>
                </div>
                
                <div className="prose prose-lg text-gray-600">
                  <p className="text-xl leading-relaxed">
                    You're a remarkable force for change in our fight against climate change. Your journey as a {personality.title} shows your deep commitment to creating a sustainable future.
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Impact Progress</span>
                    <span className="font-medium">8/8 Points</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-1000" 
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Display */}
              <div className="lg:w-1/3">
                <div className="relative aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl overflow-hidden flex items-center justify-center">
                    <EcoAvatar
                      outfit={getOutfitForPersonality(personality.title)}
                      accessory={getAccessoryForPersonality(personality.title)}
                      background={getBackgroundForCategory(dominantCategory)}
                      role={getPersonalityRole(personality.title)}
                      size="xl"
                      animate={!isPersonalityLoading}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="p-2 bg-white rounded-full shadow-lg">
                      <Leaf className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
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
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Community Impact</h4>
                      <p className="text-sm text-gray-600">
                        Your choices inspire {Math.round(score / 2)} people in your community to adopt sustainable practices.
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
            </div>
          </div>

          {/* Categories Impact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Home Category */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <Badge variant="outline" className={categoryEmissions.home < 3 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                  {categoryEmissions.home.toFixed(1)} tons CO₂
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Home Energy</h3>
              <p className="text-sm text-gray-600">
                {state?.usesRenewableEnergy ? "Using renewable energy sources" : "Traditional energy consumption"}
                {state?.hasEnergyEfficiencyUpgrades ? " with efficiency upgrades" : ""}
              </p>
            </div>

            {/* Transport Category */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <Badge variant="outline" className={categoryEmissions.transport < 4 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                  {categoryEmissions.transport.toFixed(1)} tons CO₂
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Transport</h3>
              <p className="text-sm text-gray-600">
                {state?.primaryTransportMode === 'WALK_BIKE' ? "Primarily using active transport" :
                 state?.primaryTransportMode === 'PUBLIC' ? "Regular public transit user" : "Car-based transportation"}
              </p>
            </div>

            {/* Food Category */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Utensils className="h-6 w-6 text-amber-600" />
                </div>
                <Badge variant="outline" className={categoryEmissions.food < 2 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                  {categoryEmissions.food.toFixed(1)} tons CO₂
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Food Choices</h3>
              <p className="text-sm text-gray-600">
                {state?.dietType === 'VEGAN' ? "Plant-based diet champion" :
                 state?.dietType === 'VEGETARIAN' ? "Vegetarian diet follower" : "Mixed diet consumer"}
              </p>
            </div>

            {/* Waste Category */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Recycle className="h-6 w-6 text-purple-600" />
                </div>
                <Badge variant="outline" className={categoryEmissions.waste < 1 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                  {categoryEmissions.waste.toFixed(1)} tons CO₂
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Waste Management</h3>
              <p className="text-sm text-gray-600">
                {state?.waste?.recyclingPercentage > 75 ? "High recycling achiever" :
                 state?.waste?.recyclingPercentage > 50 ? "Active recycler" : "Starting recycling journey"}
              </p>
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
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 overflow-hidden rounded-2xl shadow-lg">
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

      {/* Tabs Section */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full mb-6 bg-gray-100/80 p-1 rounded-lg">
          <TabsTrigger value="details" className="flex-1 py-3 text-base">Details</TabsTrigger>
          <TabsTrigger value="methodology" className="flex-1 py-3 text-base">Methodology</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {/* Climate Champions Section */}
          <ClimateChampions
            dominantCategory={dominantCategory}
            userScore={score}
            onActionSelect={(action) => {
              // Handle action selection
              console.log('Selected action:', action);
            }}
          />
        </TabsContent>
            
        <TabsContent value="details">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "rounded-xl p-6 lg:p-8 text-white relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]",
                    achievement.color
                  )}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] [background-size:8px_8px] opacity-10" />
                  
                  <div className="relative flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        {achievement.icon}
                      </div>
                      <div className="bg-white/20 rounded-full px-3 py-1 text-sm backdrop-blur-sm">
                        {achievement.value.toFixed(1)}t CO₂e saved
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-2xl font-semibold mb-2">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-white/90 text-sm">{achievement.description}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Leaf className="h-4 w-4" />
                        <span>Keep up the great work!</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>
              ))}
            </div>

            {/* Category Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home Emissions */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Home className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Home Energy</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">{categoryEmissions.home.toFixed(1)}</span>
                        <span className="text-gray-500">tons CO₂e/year</span>
                      </div>
                      <p className="text-gray-600 mt-1">From electricity and heating</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Electricity</span>
                        <span className="font-medium text-gray-900">{(categoryEmissions.home * 0.6).toFixed(1)} tons</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Heating</span>
                        <span className="font-medium text-gray-900">{(categoryEmissions.home * 0.4).toFixed(1)} tons</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transport Emissions */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Transport</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">{categoryEmissions.transport.toFixed(1)}</span>
                        <span className="text-gray-500">tons CO₂e/year</span>
                      </div>
                      <p className="text-gray-600 mt-1">From daily commute and travel</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Car Travel</span>
                        <span className="font-medium text-gray-900">{(categoryEmissions.transport * 0.7).toFixed(1)} tons</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Public Transit</span>
                        <span className="font-medium text-gray-900">{(categoryEmissions.transport * 0.3).toFixed(1)} tons</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                </Card>

              {/* Food Emissions */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Utensils className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Food & Diet</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">{categoryEmissions.food.toFixed(1)}</span>
                        <span className="text-gray-500">tons CO₂e/year</span>
                      </div>
                      <p className="text-gray-600 mt-1">From diet choices and food waste</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Diet Impact</span>
                        <span className="font-medium text-gray-900">{(categoryEmissions.food * 0.8).toFixed(1)} tons</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Food Waste</span>
                        <span className="font-medium text-gray-900">{(categoryEmissions.food * 0.2).toFixed(1)} tons</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                </Card>

              {/* Waste Emissions */}
              <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Waste</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">{categoryEmissions.waste.toFixed(1)}</span>
                        <span className="text-gray-500">tons CO₂e/year</span>
                      </div>
                      <p className="text-gray-600 mt-1">From waste and recycling habits</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Waste Generated</span>
                        <span className="font-medium text-gray-900">{(state.waste?.wasteLbs * 0.0005 * 12).toFixed(1)} tons/year</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Recycling Impact</span>
                        <span className="font-medium text-green-600">-{(state.waste?.wasteLbs * 0.0005 * 12 * (state.waste?.recyclingPercentage / 100) * 0.5).toFixed(1)} tons</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Waste Reduction</span>
                        <span className="font-medium text-green-600">{state.waste?.minimizesWaste ? '-20%' : '0%'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                </Card>
            </div>

            {/* Tips Section */}
            <Card className="mt-8 bg-gradient-to-br from-green-50 to-green-100/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Impact Tips</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">Immediate Actions</h4>
                    <ul className="space-y-2">
                      {[
                        'Switch to LED bulbs',
                        'Use cold water for laundry',
                        'Reduce meat consumption',
                        'Start composting'
                      ].map((tip) => (
                        <li key={tip} className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">Long-term Changes</h4>
                    <ul className="space-y-2">
                      {[
                        'Install solar panels',
                        'Switch to an electric vehicle',
                        'Improve home insulation',
                        'Use public transportation'
                      ].map((tip) => (
                        <li key={tip} className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
            
        <TabsContent value="methodology">
          <div className="space-y-8 max-w-4xl">
            <div className="space-y-6">
              {/* Calculation Methodology */}
              <div className="space-y-4">
                <h2 className="text-3xl font-serif mb-6 text-gray-800">Our Calculation Methodology</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  This calculator uses peer-reviewed emissions factors from governmental and academic sources including:
                </p>
                <ul className="space-y-3 text-gray-600 pl-1">
                  {[
                    'U.S. Environmental Protection Agency (EPA) emissions factors',
                    'Intergovernmental Panel on Climate Change (IPCC) guidelines',
                    'Department of Energy (DOE) data on regional electricity generation',
                    'Peer-reviewed studies on food lifecycle emissions'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assumptions & Limitations */}
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Assumptions & Limitations</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To provide a user-friendly experience, we make certain assumptions:
                </p>
                <ul className="space-y-3 text-gray-600 pl-1">
                  {[
                    'Electricity emissions are based on average grid mix for your region',
                    'Vehicle emissions assume average efficiency for each vehicle category',
                    'Flight emissions include radiative forcing effects at high altitudes',
                    'Food emissions are based on typical diet patterns within each category'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Sources */}
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Data Sources</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our emissions factors are regularly updated based on the latest available data from:
                </p>
                <ul className="space-y-3 text-gray-600 pl-1">
                  {[
                    "EPA's Emissions & Generation Resource Integrated Database (eGRID)",
                    "IPCC's Fifth Assessment Report",
                    "National Renewable Energy Laboratory (NREL) lifecycle assessments",
                    "Academic studies published in peer-reviewed journals"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information */}
              <div className="text-lg text-gray-600 leading-relaxed border-t pt-8 mt-12">
                <p>
                  For questions about our methodology or to discuss your specific case, please contact us at{' '}
                  <a href="mailto:sustainability@example.com" className="text-green-700 hover:underline font-medium">
                    sustainability@example.com
                  </a>
                  .
                </p>
              </div>

              {/* Action Section */}
              <div className="border-t pt-12 mt-12">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800">Ready to take action?</h2>
                <p className="text-lg text-gray-600 mb-8">Support verified carbon reduction projects or share your results.</p>
                <div className="flex gap-4">
                  <Button className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg h-auto">
                    Offset Now
                  </Button>
                  <Button variant="outline" className="gap-2 px-6 py-6 text-lg h-auto">
                    <Share2 className="h-5 w-5" />
                    Share PDF
                  </Button>
                  <Button variant="outline" className="gap-2 px-6 py-6 text-lg h-auto">
                    <Download className="h-5 w-5" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDisplay;
