import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  ReferenceLine 
} from 'recharts';
import { AlertCircle, ArrowLeft, Download, Share2, Leaf, Info, Car, Utensils, Plane, Zap, Trash2, Home,
  Bike, Bus, Train, Apple, Beef, PackageCheck, Recycle, Battery, Wind, Share, Loader2, Check, BookOpen
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Tooltip as RechartsTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { determineEcoPersonality } from '@/utils/ecoPersonality';
import useSound from 'use-sound';
import { EcoAvatar } from '@/components/EcoAvatar';
import { getOutfitForPersonality, getAccessoryForPersonality, getBackgroundForCategory } from '@/utils/ecoPersonality';
import { Badge } from '@/components/ui/badge';

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
  const [playRevealSound] = useSound('/sounds/reveal.mp3');
  const [playSuccessSound] = useSound('/sounds/success.mp3');

  // Calculate dominant category
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

  const generatePersonalizedStory = async () => {
    setIsGeneratingStory(true);
    try {
      // Generate a personalized story based on the user's data
      const story = `As a ${personality.title}, your journey in sustainable living has been remarkable. 
        Your strongest impact comes from your ${dominantCategory} choices, where you've shown exceptional 
        commitment. Through your actions, you've already prevented ${(16 - emissions).toFixed(1)} tons 
        of CO2 emissions - equivalent to planting ${Math.round((16 - emissions) * 10)} trees! 
        Your next challenge awaits in ${Object.entries(categoryScores)
          .sort(([,a], [,b]) => a - b)[0][0]}, where small changes can lead to big impacts.`;
      
      setGeneratedStory(story);
      playSuccessSound();
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
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

  // Calculate percentages for pie chart
  const pieData = [
    { name: 'Home', value: categoryEmissions.home, percentage: Math.round((categoryEmissions.home / emissions) * 100) },
    { name: 'Transport', value: categoryEmissions.transport, percentage: Math.round((categoryEmissions.transport / emissions) * 100) },
    { name: 'Food', value: categoryEmissions.food, percentage: Math.round((categoryEmissions.food / emissions) * 100) },
    { name: 'Waste', value: categoryEmissions.waste, percentage: Math.round((categoryEmissions.waste / emissions) * 100) }
  ];

  // Colors matching the image
  const COLORS = ['#4ade80', '#60a5fa', '#fb923c', '#ef4444'];

  const comparisonData = [
    { name: 'Your\nFootprint', value: emissions },
  ];

  // Replace the old getEcoPersonality function with the new one
  const personality = determineEcoPersonality(state);

  useEffect(() => {
    // Simulate loading time for personality determination
    const timer = setTimeout(() => {
      setIsPersonalityLoading(false);
      playRevealSound();
      setTimeout(() => playSuccessSound(), 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Get achievements based on state
  const achievements = getAchievements(state, categoryEmissions);

  return (
    <div className={cn(
      "space-y-8 transition-opacity duration-500",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      {/* Impact Summary */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e15_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />
        
        <CardContent className="p-10 space-y-8 relative">
          {/* Impact Level Indicator */}
          <div className="flex items-center justify-center gap-3">
            <div className={cn(
              "px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-sm",
              emissions < 4 ? "bg-green-50 text-green-600" :
              emissions < 8 ? "bg-yellow-50 text-yellow-600" :
              "bg-red-50 text-red-600"
            )}>
              {emissions < 4 ? (
                <>
                  <Leaf className="h-5 w-5" />
                  <span>Low Impact Level</span>
                </>
              ) : emissions < 8 ? (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span>Medium Impact Level</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span>High Impact Level</span>
                </>
              )}
            </div>
          </div>
          
          {/* Main Stats */}
          <div className="text-center space-y-6">
            <div className="flex items-baseline justify-center gap-4">
              <div className="space-y-1">
                <span className={cn(
                  "text-8xl font-bold bg-clip-text text-transparent",
                  emissions < 4 ? "bg-gradient-to-br from-green-600 to-green-700" :
                  emissions < 8 ? "bg-gradient-to-br from-yellow-600 to-yellow-700" :
                  "bg-gradient-to-br from-red-600 to-red-700"
                )}>
                  {emissions.toFixed(2)}
                </span>
                <div className="flex flex-col text-gray-600">
                  <span className="text-xl font-medium">metric tons CO2e</span>
                  <span className="text-lg">per year</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-2xl text-gray-700">
                Your footprint is{' '}
                <span className={cn(
                  "font-semibold",
                  emissions < 4 ? "text-green-700" :
                  emissions < 8 ? "text-yellow-700" :
                  "text-red-700"
                )}>
                  {((16 - emissions) / 16 * 100).toFixed(1)}% lower
                </span>{' '}
                than the average American
              </p>
              <div className="space-y-2">
                <p className="text-gray-600 text-lg">
                  That's equivalent to:
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <span className="block font-semibold text-gray-900">
                        {Math.round((16 - emissions) * 10)} trees
                      </span>
                      <span className="text-sm text-gray-600">planted for one year</span>
                    </div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <span className="block font-semibold text-gray-900">
                        {Math.round((16 - emissions) * 2)} cars
                      </span>
                      <span className="text-sm text-gray-600">taken off the road</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Context & Location */}
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
              <div className="p-1.5 bg-green-100 rounded-full">
                <Leaf className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-600">Based on data relevant to United States</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { 
                icon: <Home className="h-5 w-5" />,
                label: 'Home Energy',
                value: categoryEmissions.home,
                impact: categoryEmissions.home < 4 ? 'low' : categoryEmissions.home < 8 ? 'medium' : 'high'
              },
              {
                icon: <Car className="h-5 w-5" />,
                label: 'Transport',
                value: categoryEmissions.transport,
                impact: categoryEmissions.transport < 3 ? 'low' : categoryEmissions.transport < 6 ? 'medium' : 'high'
              },
              {
                icon: <Utensils className="h-5 w-5" />,
                label: 'Food',
                value: categoryEmissions.food,
                impact: categoryEmissions.food < 2 ? 'low' : categoryEmissions.food < 4 ? 'medium' : 'high'
              },
              {
                icon: <Trash2 className="h-5 w-5" />,
                label: 'Waste',
                value: categoryEmissions.waste,
                impact: categoryEmissions.waste < 1 ? 'low' : categoryEmissions.waste < 2 ? 'medium' : 'high'
              }
            ].map((stat, i) => (
              <div 
                key={i} 
                className={cn(
                  "relative overflow-hidden rounded-xl p-6",
                  "transition-all duration-500 transform hover:scale-105",
                  stat.impact === 'low' 
                    ? "bg-gradient-to-br from-green-50 to-green-100 border border-green-200" 
                    : stat.impact === 'medium'
                    ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200"
                    : "bg-gradient-to-br from-red-50 to-red-100 border border-red-200"
                )}
              >
                {/* Background Pattern */}
                <div 
                  className={cn(
                    "absolute inset-0 opacity-10",
                    "bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)]",
                    "[background-size:8px_8px]",
                    stat.impact === 'low' ? "text-green-600" : stat.impact === 'medium' ? "text-yellow-600" : "text-red-600"
                  )}
                />
                
                <div className="relative flex flex-col items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-lg relative group cursor-pointer",
                    stat.impact === 'low' 
                      ? "bg-green-100 text-green-600" 
                      : stat.impact === 'medium'
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600",
                    stat.label === 'Home Energy' && "hover:animate-bounce",
                    stat.label === 'Transport' && "hover:animate-wiggle",
                    stat.label === 'Food' && "hover:animate-spin",
                    stat.label === 'Waste' && "hover:animate-shake"
                  )}>
                    <div className={cn(
                      "transition-transform duration-300",
                      stat.label === 'Home Energy' && "group-hover:animate-bounce",
                      stat.label === 'Transport' && "group-hover:animate-wiggle",
                      stat.label === 'Food' && "group-hover:animate-spin",
                      stat.label === 'Waste' && "group-hover:animate-shake"
                    )}>
                      {stat.icon}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-medium",
                    stat.impact === 'low' 
                      ? "bg-green-100 text-green-700" 
                      : stat.impact === 'medium'
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  )}>
                    {stat.impact === 'low' ? 'Low Impact' : stat.impact === 'medium' ? 'Medium Impact' : 'High Impact'}
                  </span>
                  
                  {/* Animated Pulse Effect for High Impact */}
                  {stat.impact === 'high' && (
                    <div className="absolute -inset-1 bg-red-400/20 rounded-xl animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Header - Moving it after the impact summary for better visual hierarchy */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 text-center flex-1">Your Carbon Footprint Results</h1>
        <Button 
          variant="outline" 
          className="gap-2 px-4 py-2 text-base hover:bg-gray-100" 
          onClick={onReset}
        >
          <ArrowLeft className="h-4 w-4" />
          Start Over
        </Button>
          </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          <TabsTrigger value="methodology" className="flex-1">Methodology</TabsTrigger>
            </TabsList>
            
        <TabsContent value="overview" className="space-y-8 mt-6">
          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-8 px-6">
                <div>
              <h3 className="text-xl font-semibold mb-6">Emissions by Category</h3>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      label={({ name, value, percent }) => (
                        <text
                          x={0}
                          y={0}
                          fill="#374151"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={12}
                        >
                          {`${name}\n${(percent * 100).toFixed(0)}%`}
                        </text>
                      )}
                      labelLine={true}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                              <p className="font-medium text-gray-900">{data.name}</p>
                              <p className="text-sm text-gray-600">{data.value.toFixed(2)} tons CO₂e</p>
                              <p className="text-sm text-gray-600">{data.percentage}% of total</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {pieData.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-gray-100"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.value.toFixed(2)} tons</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

                <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-semibold">How You Compare</h3>
                <RechartsTooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>See how your carbon footprint compares to global averages</p>
                  </TooltipContent>
                </RechartsTooltip>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 20, right: 130, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <YAxis
                      type="number"
                      domain={[0, 20]}
                      ticks={[0, 5, 10, 15, 20]}
                      label={{ value: 'Metric Tons CO₂e/year', position: 'left', angle: -90, offset: 0 }}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <XAxis 
                      type="category"
                      dataKey="name" 
                      tick={{ fill: '#64748b', fontSize: 14 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = payload[0].value;
                          return (
                            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                              <p className="font-medium text-gray-900">Your Footprint</p>
                              <p className="text-sm text-gray-600">
                                {typeof value === 'number' ? value.toFixed(2) : value} tons CO₂e/year
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#4ade80" 
                      radius={[6, 6, 6, 6]} 
                      barSize={40}
                    >
                      {comparisonData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={emissions < 4 ? "#4ade80" : emissions < 8 ? "#facc15" : "#f87171"}
                        />
                      ))}
                    </Bar>
                    <ReferenceLine
                      y={16}
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      label={{ 
                        value: 'US Average (16 tons)', 
                        position: 'right',
                        fill: '#64748b',
                        fontSize: 12
                      }}
                    />
                    <ReferenceLine
                      y={4.7}
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      label={{ 
                        value: 'Global Average (4.7 tons)', 
                        position: 'right',
                        fill: '#64748b',
                        fontSize: 12
                      }}
                    />
                    <ReferenceLine
                      y={2}
                      stroke="#22c55e"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      label={{ 
                        value: 'Sustainability Target (2 tons)', 
                        position: 'right',
                        fill: '#22c55e',
                        fontSize: 12
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Your Emissions</span>
                    <span className={cn(
                      "font-medium",
                      emissions < 4 ? "text-green-600" :
                      emissions < 8 ? "text-yellow-600" :
                      "text-red-600"
                    )}>
                      {emissions.toFixed(2)} tons
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Distance to Target</span>
                    <span className="font-medium text-gray-900">
                      {(emissions - 2).toFixed(2)} tons to go
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Compared to US Average</span>
                    <span className="font-medium text-green-600">
                      {((16 - emissions) / 16 * 100).toFixed(1)}% lower
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Eco Personality */}
          <Card className="bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-r ${personality.color} p-8 text-white transition-all duration-1000 ${isPersonalityLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {isPersonalityLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <span className="text-4xl animate-bounce">{personality.badge}</span>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold">{personality.title}</h3>
                        {personality.subCategory && (
                          <span className="text-white/90 text-sm">{personality.subCategory}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-white/90 text-lg">{personality.description}</p>
                  </div>
                  
                  {/* Avatar Integration */}
                  <div className="relative">
                    <EcoAvatar
                      outfit={getOutfitForPersonality(personality.title)}
                      accessory={getAccessoryForPersonality(personality.title)}
                      background={getBackgroundForCategory(dominantCategory)}
                      role={getPersonalityRole(personality.title)}
                      size="lg"
                      animate={!isPersonalityLoading}
                      className="transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -top-2 -right-2">
                      <div className={cn(
                        "bg-white/20 backdrop-blur-sm rounded-full p-2",
                        personality.color.includes('green') && "bg-green-500/20",
                        personality.color.includes('blue') && "bg-blue-500/20",
                        personality.color.includes('yellow') && "bg-yellow-500/20",
                        personality.color.includes('red') && "bg-red-500/20"
                      )}>
                        <Leaf className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-8 space-y-6 transition-all duration-1000 ${isPersonalityLoading ? 'opacity-0' : 'opacity-100'}`}>
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress to Next Level</span>
                    <span>{personality.points}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${personality.color} transition-all duration-1000`}
                      style={{ 
                        width: `${(parseInt(personality.points.split('/')[0]) / parseInt(personality.points.split('/')[1])) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Story Generation Button */}
                <div className="flex flex-col items-center gap-4 py-4">
                  <Button 
                    onClick={generatePersonalizedStory}
                    className="w-full max-w-md bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                    disabled={isGeneratingStory}
                  >
                    <div className="flex items-center gap-2">
                      {isGeneratingStory ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )}
                      Listen to Your Eco Story
                    </div>
                  </Button>
                  {generatedStory && (
                    <div className="w-full max-w-md bg-purple-50 rounded-lg p-4 animate-fadeIn">
                      <p className="text-purple-800 italic">{generatedStory}</p>
                    </div>
                  )}
                </div>

                {/* Category Deep Dive */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Category Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(categoryScores).map(([category, score]) => (
                      <Button
                        key={category}
                        variant="outline"
                        className={cn(
                          "h-auto p-4 flex flex-col items-start gap-2",
                          category === dominantCategory && "border-2 border-green-500"
                        )}
                        onClick={() => setExpandedCategory(category)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {getCategoryIcon(category)}
                          <span className="font-medium">{getCategoryTitle(category)}</span>
                          {category === dominantCategory && (
                            <Badge className="ml-auto" variant="secondary">
                              Strongest
                            </Badge>
                          )}
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${(score / 6) * 100}%` }}
                          />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Your Strengths</h4>
                  <ul className="space-y-2">
                    {personality.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${personality.color}`} />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps with Enhanced Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Personalized Action Plan</h4>
                  <div className="space-y-3">
                    {personality.nextSteps.map((step, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${personality.color} text-white`}>
                            {getStepIcon(index)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{step}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {getStepDescription(step)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {getStepDifficulty(step)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getStepImpact(step)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Personalized Recommendations</h2>
                <p className="text-gray-600">Based on your responses, we've identified these opportunities to reduce your carbon footprint:</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-sm">
                  <PackageCheck className="h-4 w-4 mr-2" />
                  Mark All Complete
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg",
                    rec.difficulty === 'Easy' 
                      ? "bg-gradient-to-br from-green-50 to-green-100/50 border border-green-100" 
                      : "bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-100"
                  )}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-2 rounded-lg",
                          rec.difficulty === 'Easy' ? "bg-green-100" : "bg-yellow-100"
                        )}>
                          {rec.category === 'Home Energy' ? <Home className="h-5 w-5 text-gray-700" /> :
                           rec.category === 'Transport' ? <Car className="h-5 w-5 text-gray-700" /> :
                           rec.category === 'Food' ? <Utensils className="h-5 w-5 text-gray-700" /> :
                           <Trash2 className="h-5 w-5 text-gray-700" />}
                        </div>
                        <span className="text-sm font-medium text-gray-600">{rec.category}</span>
                      </div>
                      <span 
                        className={cn(
                          "text-sm px-3 py-1 rounded-full",
                          rec.difficulty === 'Easy' 
                            ? "text-green-700 bg-green-100" 
                            : "text-yellow-700 bg-yellow-100"
                        )}
                      >
                        {rec.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{rec.title}</h3>
                      <p className="text-gray-600 mb-4">{rec.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-700">
                        <Leaf className="h-4 w-4" />
                        <span className="text-sm">{rec.impact}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={cn(
                          "text-sm transition-colors",
                          rec.difficulty === 'Easy' 
                            ? "hover:bg-green-100" 
                            : "hover:bg-yellow-100"
                        )}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="h-1 w-full bg-gray-100">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500 group-hover:opacity-100",
                        rec.difficulty === 'Easy' ? "bg-green-500" : "bg-yellow-500",
                        "opacity-50"
                      )}
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 mt-8 border border-primary/20">
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <h2 className="text-2xl font-semibold">Ready to Take Action?</h2>
                <p className="text-muted-foreground">
                  Support verified carbon reduction projects or share your results to inspire others in their sustainability journey.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 group"
                  >
                    <Leaf className="h-5 w-5 group-hover:animate-bounce" />
                    Offset Now
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 border-2 group"
                    onClick={sharePDF}
                  >
                    <Share className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Share PDF
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 border-2 group"
                  >
                    <Download className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                    Download
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Your actions matter! By offsetting or sharing, you contribute to global sustainability efforts.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
            
        <TabsContent value="details">
          <div className="space-y-6 mt-6">
            {/* Achievement Cards */}
            {achievements.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Your Achievements</h3>
                <p className="text-gray-600">You've earned these badges through your sustainable choices:</p>
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "rounded-xl p-6 text-white relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]",
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
                <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">Achievement Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Total CO₂e Saved</span>
                        <span>{achievements.reduce((acc, curr) => acc + curr.value, 0).toFixed(1)} tons</span>
                      </div>
                      <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-1000"
                          style={{ width: `${Math.min(achievements.reduce((acc, curr) => acc + curr.value, 0) / 5 * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-green-700">
                      <Info className="h-4 w-4" />
                      <span>You're making a real difference! Keep collecting achievements to increase your impact.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                <div className="max-w-md mx-auto space-y-4">
                  <PackageCheck className="h-16 w-16 mx-auto text-gray-400" />
                  <h3 className="text-2xl font-semibold text-gray-900">No Achievements Yet</h3>
                  <p className="text-gray-600">Start your sustainability journey by making eco-friendly choices. Each small action counts towards earning achievements!</p>
                  <Button variant="outline" className="mt-4">
                    <Leaf className="h-4 w-4 mr-2" />
                    Learn How to Earn
                  </Button>
                </div>
              </div>
            )}

            {/* Category Details */}
            <div className="grid grid-cols-2 gap-6 mt-8">
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
          <div className="space-y-12 mt-6 px-8 max-w-4xl mx-auto">
            {/* Calculation Methodology */}
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">Our Calculation Methodology</h2>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDisplay;
