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

  if (!isVisible) {
    return null;
  }

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
    { name: 'Home', value: categoryEmissions.home, color: '#4CAF50' },
    { name: 'Transport', value: categoryEmissions.transport, color: '#2196F3' },
    { name: 'Food', value: categoryEmissions.food, color: '#FFC107' },
    { name: 'Waste', value: categoryEmissions.waste, color: '#9C27B0' }
  ];

  const totalEmissions = pieData.reduce((sum, item) => sum + item.value, 0);
  const pieDataWithPercentages = pieData.map(item => ({
    ...item,
    percentage: ((item.value / totalEmissions) * 100).toFixed(1)
  }));

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
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Carbon Footprint Results</h2>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Start Over
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Emissions Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataWithPercentages}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieDataWithPercentages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="font-medium">{data.name}</p>
                            <p>{data.value.toFixed(2)} tons CO₂e</p>
                            <p>{data.percentage}% of total</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Footprint vs. Averages</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Your Footprint', value: emissions },
                    { name: 'US Average', value: 16.5 },
                    { name: 'Global Average', value: 4.8 },
                    { name: 'Sustainability Target', value: 2.0 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-500">{rec.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rec.difficulty}
                  </span>
                </div>
                <h4 className="font-medium mb-2">{rec.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Leaf className="h-4 w-4" />
                  {rec.impact}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
