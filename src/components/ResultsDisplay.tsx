import React, { useState } from 'react';
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
  Bike, Bus, Train, Apple, Beef, PackageCheck, Recycle, Battery, Wind, Share
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Tooltip as RechartsTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

  const getEcoPersonality = (score: number, categoryEmissions: CategoryEmissions) => {
    // Calculate total emissions and category weights
    const totalEmissions = Number(categoryEmissions.home) + Number(categoryEmissions.transport) + 
                          Number(categoryEmissions.food) + Number(categoryEmissions.waste);
    
    const weights = {
      home: Number(categoryEmissions.home) / totalEmissions,
      transport: Number(categoryEmissions.transport) / totalEmissions,
      food: Number(categoryEmissions.food) / totalEmissions,
      waste: Number(categoryEmissions.waste) / totalEmissions
    };

    // Determine dominant category
    const dominantCategory = Object.entries(weights).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    // Base personality type based on total emissions and score
    let personality = {
      title: '',
      points: '',
      description: '',
      level: 0,
      badge: '',
      strengths: [] as string[],
      nextSteps: [] as string[],
      subCategory: '',
      color: ''
    };

    // Determine level based on score and emissions
    if (score < 30 || totalEmissions > 16) {
      personality = {
        title: 'Eco Novice',
        points: '1/8 Points',
        description: 'Just starting your sustainable journey. Every small step counts!',
        level: 1,
        badge: '🌱',
        strengths: ['Taking the first step', 'Open to learning'],
        nextSteps: ['Try a Meatless Monday', 'Start basic recycling'],
        subCategory: '',
        color: 'from-yellow-500 to-yellow-400'
      };
    } else if (score < 50 || totalEmissions > 12) {
      personality = {
        title: 'Green Starter',
        points: '2/8 Points',
        description: 'Building foundational eco-friendly habits. You\'re making progress!',
        level: 2,
        badge: '🌿',
        strengths: ['Growing awareness', 'Basic sustainable practices'],
        nextSteps: ['Upgrade to LED bulbs', 'Try public transport'],
        subCategory: '',
        color: 'from-green-400 to-green-300'
      };
    } else if (score < 70 || totalEmissions > 8) {
      personality = {
        title: 'Eco Advocate',
        points: '4/8 Points',
        description: 'Consistently making sustainable choices. Your impact is growing!',
        level: 3,
        badge: '🌳',
        strengths: ['Regular sustainable practices', 'Influencing others'],
        nextSteps: ['Install smart thermostats', 'Start composting'],
        subCategory: '',
        color: 'from-green-600 to-green-500'
      };
    } else if (score < 85 || totalEmissions > 4) {
      personality = {
        title: 'Sustainability Pro',
        points: '6/8 Points',
        description: 'Leading by example in sustainable living. Impressive commitment!',
        level: 4,
        badge: '🌍',
        strengths: ['Comprehensive approach', 'Community leadership'],
        nextSteps: ['Consider solar panels', 'Start a community garden'],
        subCategory: '',
        color: 'from-blue-600 to-blue-500'
      };
    } else {
      personality = {
        title: 'Climate Hero',
        points: '8/8 Points',
        description: 'Maximum impact achieved! You\'re a beacon of sustainable living.',
        level: 5,
        badge: '⭐',
        strengths: ['Exemplary practices', 'Inspiring others'],
        nextSteps: ['Mentor others', 'Advocate for policy change'],
        subCategory: '',
        color: 'from-purple-600 to-purple-500'
      };
    }

    // Add category-specific strengths and next steps based on dominant category and emissions
    switch(dominantCategory) {
      case 'home':
        personality.subCategory = categoryEmissions.home < 4 ? 'Energy Efficiency Expert' : 'Eco Homebody';
        if (categoryEmissions.home < 4) {
          personality.strengths.push('Efficient home energy use');
          personality.nextSteps.push('Install solar panels');
        }
        break;
      case 'transport':
        personality.subCategory = categoryEmissions.transport < 3 ? 'Green Mobility Champion' : 'Green Traveler';
        if (categoryEmissions.transport < 3) {
          personality.strengths.push('Low-carbon transportation');
          personality.nextSteps.push('Consider an electric vehicle');
        }
        break;
      case 'food':
        personality.subCategory = categoryEmissions.food < 2 ? 'Sustainable Food Pioneer' : 'Conscious Consumer';
        if (categoryEmissions.food < 2) {
          personality.strengths.push('Sustainable diet choices');
          personality.nextSteps.push('Start a vegetable garden');
        }
        break;
      case 'waste':
        personality.subCategory = categoryEmissions.waste < 1 ? 'Zero Waste Champion' : 'Zero Waste Warrior';
        if (categoryEmissions.waste < 1) {
          personality.strengths.push('Minimal waste generation');
          personality.nextSteps.push('Start composting');
        }
        break;
    }

    return personality;
  };

  const personality = getEcoPersonality(score, categoryEmissions);

  // Get achievements based on state
  const achievements = getAchievements(state, categoryEmissions);

  return (
    <div className={cn(
      "space-y-8 transition-opacity duration-500",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      {/* Impact Summary */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 overflow-hidden">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="flex items-center justify-center gap-3 text-red-500">
            <AlertCircle className="h-6 w-6" />
            <span className="text-2xl font-medium">High Impact Carbon Footprint</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-7xl font-bold text-green-700">{emissions.toFixed(2)}</span>
              <div className="space-y-1">
                <span className="text-xl text-gray-600 block">metric tons</span>
                <span className="text-xl text-gray-600 block">CO2e/year</span>
              </div>
            </div>
            <p className="text-xl text-gray-600">
              That's <span className="font-medium">{((16 - emissions) / 16 * 100).toFixed(2)}% lower</span> than the average American.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 text-gray-600">
            <div className="bg-white/50 rounded-full p-2">
              <Leaf className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-lg">Based on data relevant to United States</span>
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
              <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                          cx="50%"
                          cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    paddingAngle={0}
                    label={({ percent }) => (
                      <text
                        fill="#ffffff"
                        fontSize={16}
                        fontWeight="bold"
                        dominantBaseline="central"
                        textAnchor="middle"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    )}
                          labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                          ))}
                        </Pie>
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => {
                      const item = pieData.find(d => d.name === value);
                      return `${value} (${item?.percentage}%)`;
                    }}
                  />
                      </PieChart>
                    </ResponsiveContainer>
                </div>

                <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-semibold">How You Compare</h3>
                <RechartsTooltip>
                  <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>See how your carbon footprint compares to average emissions</p>
                  </TooltipContent>
                </RechartsTooltip>
                      </div>
              <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={comparisonData}
                  margin={{ top: 20, right: 130, left: -20, bottom: 20 }}
                >
                  <YAxis
                    type="number"
                    domain={[0, 20]}
                    ticks={[0, 5, 10, 15, 20]}
                    label={{ value: 'tons', position: 'left', angle: -90, offset: -10 }}
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
                  <Bar 
                    dataKey="value" 
                    fill="#4ade80" 
                    radius={[6, 6, 6, 6]} 
                    barSize={40}
                  >
                          {comparisonData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                        fill="#4ade80"
                            />
                          ))}
                        </Bar>
                  <ReferenceLine
                    y={16}
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    segment={[{ x: 0.2, y: 16 }, { x: 1, y: 16 }]}
                    label={{ 
                      value: 'US Average', 
                      position: 'top',
                      fill: '#64748b',
                      fontSize: 14,
                      offset: 10,
                      fontWeight: 500
                    }}
                  />
                  <ReferenceLine
                    y={4.7}
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    segment={[{ x: 0.2, y: 4.7 }, { x: 1, y: 4.7 }]}
                    label={{ 
                      value: 'Global Average', 
                      position: 'top',
                      fill: '#64748b',
                      fontSize: 14,
                      offset: 10,
                      fontWeight: 500
                    }}
                  />
                  <ReferenceLine
                    y={2}
                    stroke="#22c55e"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    segment={[{ x: 0.2, y: 2 }, { x: 1, y: 2 }]}
                    label={{ 
                      value: 'Sustainability Target', 
                      position: 'top',
                      fill: '#22c55e',
                      fontSize: 14,
                      offset: 10,
                      fontWeight: 500
                    }}
                  />
                      </BarChart>
                    </ResponsiveContainer>
            </div>
          </div>

          {/* Eco Personality */}
          <Card className="bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-r ${personality.color} p-8 text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{personality.badge}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{personality.title}</h3>
                        {personality.subCategory && (
                          <span className="text-white/90 text-sm">{personality.subCategory}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-white/90 text-lg">{personality.description}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                    <Leaf className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress to Next Level</span>
                    <span>{personality.points}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${personality.color}`}
                      style={{ width: `${(score / 100) * 100}%` }}
                    />
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

                {/* Next Steps */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Next Steps</h4>
                  <ul className="space-y-2">
                    {personality.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${personality.color}`} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Personalized Recommendations</h2>
            <p className="text-gray-600">Based on your responses, we've identified these opportunities to reduce your carbon footprint:</p>
            
            <div className="grid grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "rounded-xl overflow-hidden",
                    rec.difficulty === 'Easy' ? "bg-green-50" : "bg-yellow-50"
                  )}
                >
                  <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm">{rec.category}</span>
                      <span 
                        className={cn(
                          "text-sm px-3 py-1 rounded-full",
                          rec.difficulty === 'Easy' 
                            ? "text-green-700 bg-green-100" 
                            : "text-amber-700 bg-amber-100"
                        )}
                      >
                        {rec.difficulty}
                        </span>
                      </div>

                    <h3 className="text-xl font-semibold mb-2">{rec.title}</h3>
                    <p className="text-gray-600 mb-4">{rec.description}</p>

                    <div className="flex items-center gap-2 text-green-700">
                      <Leaf className="h-4 w-4" />
                      <span className="text-sm">{rec.impact}</span>
                    </div>
                  </div>
                      </div>
                ))}
              </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 mt-8 border border-primary/20">
            <h2 className="text-2xl font-semibold mb-4 text-center">Ready to Take Action?</h2>
            <p className="text-center text-muted-foreground mb-6 max-w-xl mx-auto">
              Support verified carbon reduction projects or share your results to inspire others in their sustainability journey.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2"
              >
                <Leaf className="h-5 w-5" />
                Offset Now
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 border-2"
              >
                <Share className="h-5 w-5" />
                Share PDF
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 border-2"
              >
                <Download className="h-5 w-5" />
                Download
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Your actions matter! By offsetting or sharing, you contribute to global sustainability efforts.
              </p>
            </div>
          </div>
        </TabsContent>
            
        <TabsContent value="details">
          <div className="space-y-6 mt-6">
            {/* Achievement Cards */}
            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`${achievement.color} rounded-xl p-6 text-white`}
                  >
                    <div className="flex flex-col h-full">
                      {achievement.icon}
                      <h3 className="text-2xl font-semibold mb-2 mt-4">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-white/80 text-sm mb-4">{achievement.description}</p>
                      )}
                      <div className="mt-auto">
                        <p className="text-2xl font-bold">{achievement.value.toFixed(1)}t CO₂e</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <PackageCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">No Achievements Yet</h3>
                <p className="text-gray-500 mt-2">Complete more sustainable actions to unlock achievements!</p>
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
