import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import { ArrowLeft, Download, Share2, AlertCircle, Leaf, AlertTriangle, Check, MapPin, Info, Sprout, Flower2, Trees, Palmtree } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from '@/utils/formatters';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultsDisplayProps {
  results: {
    homeEmissions: number;
    transportEmissions: number;
    foodEmissions: number;
    wasteEmissions: number;
    totalFootprint: number;
    comparedToUS: number;
    comparedToGlobal: number;
    comparedToTarget: number;
  };
  state: {
    name: string;
    email: string;
    age: number;
    gender: string;
    profession: string;
    electricityKwh: number;
    naturalGasTherm: number;
    heatingOilGallons: number;
    propaneGallons: number;
    carMiles: number;
    carType: string;
    flightMiles: number;
    flightType: string;
    transitMiles: number;
    transitType: string;
    dietType: string;
    recyclingPercentage: number;
    wasteLbs: number;
    usesRenewableEnergy: boolean;
    hasEnergyEfficiencyUpgrades: boolean;
    usesActiveTransport: boolean;
    hasElectricVehicle: boolean;
    buysLocalFood: boolean;
    followsSustainableDiet: boolean;
    minimizesWaste: boolean;
    avoidsPlastic: boolean;
  };
  onReset: () => void;
}

type CalculatorState = ResultsDisplayProps['state'];

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, state, onReset }) => {
  const {
    homeEmissions,
    transportEmissions,
    foodEmissions,
    wasteEmissions,
    totalFootprint,
    comparedToUS,
    comparedToGlobal,
    comparedToTarget,
  } = results;

  const categoryData = [
    { name: 'Home', value: homeEmissions },
    { name: 'Transport', value: transportEmissions },
    { name: 'Food', value: foodEmissions },
    { name: 'Waste', value: wasteEmissions },
  ];

  const comparisonData = [
    { 
      name: 'Your Footprint', 
      value: totalFootprint,
      description: 'Your annual carbon emissions'
    },
    { 
      name: 'US Average', 
      value: 16,
      description: 'Average American footprint' 
    },
    { 
      name: 'Global Average', 
      value: 4.8,
      description: 'Average worldwide footprint'
    },
    { 
      name: 'Sustainability Target', 
      value: 2,
      description: 'UN 2030 climate goal'
    },
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#ef4444'];

  const getRecommendations = () => {
    const recs = [];
    
    if (state.electricityKwh > 700) {
      recs.push({
        category: 'Home',
        title: 'Reduce Electricity Usage',
        description: 'Your electricity usage is above average. Consider LED lighting, energy-efficient appliances, and smart power strips to reduce phantom energy use.',
        impact: 'Could save up to 2 tons CO2e per year',
        difficulty: 'easy'
      });
    }
    
    if (state.naturalGasTherm > 40) {
      recs.push({
        category: 'Home',
        title: 'Improve Home Insulation',
        description: 'Your heating usage suggests you might benefit from better insulation. Sealing drafts and adding insulation can reduce energy needs significantly.',
        impact: 'Could save up to 1.5 tons CO2e per year',
        difficulty: 'medium'
      });
    }
    
    if (state.carType === 'LARGE' && state.carMiles > 800) {
      recs.push({
        category: 'Transport',
        title: 'Consider a More Efficient Vehicle',
        description: 'Your large vehicle contributes significantly to your carbon footprint. When possible, consider carpooling, public transit, or switching to a hybrid/electric vehicle.',
        impact: 'Could save up to 4 tons CO2e per year',
        difficulty: 'hard'
      });
    }
    
    if (state.flightMiles > 10000) {
      recs.push({
        category: 'Transport',
        title: 'Offset Your Air Travel',
        description: 'Your air travel has a large impact. Consider video conferencing when possible, and purchase carbon offsets for necessary flights.',
        impact: 'Could offset up to 3 tons CO2e per year',
        difficulty: 'easy'
      });
    }
    
    if (state.dietType === 'MEAT_HEAVY') {
      recs.push({
        category: 'Food',
        title: 'Reduce Red Meat Consumption',
        description: 'Even reducing red meat consumption by one day per week can have a significant impact on your carbon footprint.',
        impact: 'Could save up to 0.8 tons CO2e per year',
        difficulty: 'medium'
      });
    }
    
    if (state.recyclingPercentage < 50) {
      recs.push({
        category: 'Waste',
        title: 'Increase Recycling Efforts',
        description: 'Increasing your recycling rate and composting organic waste can significantly reduce methane emissions from landfills.',
        impact: 'Could save up to 0.5 tons CO2e per year',
        difficulty: 'easy'
      });
    }
    
    if (recs.length < 3) {
      recs.push({
        category: 'General',
        title: 'Switch to Renewable Energy',
        description: 'Check if your utility offers renewable energy options or consider installing solar panels.',
        impact: 'Could save up to 3 tons CO2e per year',
        difficulty: 'medium'
      });
      
      recs.push({
        category: 'General',
        title: 'Reduce, Reuse, Recycle',
        description: 'Follow the waste hierarchy: reduce what you consume, reuse items when possible, and recycle what can\'t be reused.',
        impact: 'Could save up to 1 ton CO2e per year',
        difficulty: 'easy'
      });
    }
    
    return recs;
  };
  
  const recommendations = getRecommendations();
  
  const getLocalizedInfo = () => {
    return {
      region: "United States",
      energyMix: "Coal (50%), Natural Gas (20%), Nuclear (20%), Renewables (10%)",
      transportOptions: "Public transit, bike sharing programs, electric vehicle charging stations",
      localInitiatives: "Community solar projects, city-wide composting, tree planting initiatives",
    };
  };
  
  const localInfo = getLocalizedInfo();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{`${label}: ${formatNumber(payload[0].value)} metric tons CO2e`}</p>
        </div>
      );
    }
    return null;
  };

  const ComparisonTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md max-w-xs">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-lg font-bold text-primary">{formatNumber(data.value)} tons CO2e</p>
          <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
          {data.name === 'Your Footprint' && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
              {data.value > 16 ? 
                <span className="text-red-500 font-medium">Above US average</span> : 
                <span className="text-green-500 font-medium">Below US average</span>
              }
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getImpactLevel = () => {
    if (comparedToTarget <= 100) return { level: "Sustainable", color: "green", icon: <Check className="h-5 w-5 text-green-500" /> };
    if (comparedToTarget <= 200) return { level: "Moderate", color: "amber", icon: <AlertTriangle className="h-5 w-5 text-amber-500" /> };
    return { level: "High Impact", color: "red", icon: <AlertCircle className="h-5 w-5 text-red-500" /> };
  };
  
  const impactLevel = getImpactLevel();

  const calculateSustainabilityScore = (state: CalculatorState): number => {
    let score = 0;
    if (state.usesRenewableEnergy) score++;
    if (state.hasEnergyEfficiencyUpgrades) score++;
    if (state.usesActiveTransport) score++;
    if (state.hasElectricVehicle) score++;
    if (state.buysLocalFood) score++;
    if (state.followsSustainableDiet) score++;
    if (state.minimizesWaste) score++;
    if (state.avoidsPlastic) score++;
    return score;
  };

  const getPersonalityLabel = (score: number): string => {
    if (score <= 2) return "Eco Novice";
    if (score <= 4) return "Green Starter";
    if (score <= 6) return "Eco Advocate";
    return "Sustainability Champion";
  };

  const getPersonalityDescription = (score: number): string => {
    if (score <= 2) {
      return "Just starting your sustainable journey. There's plenty of room to grow your eco-friendly habits.";
    }
    if (score <= 4) {
      return "You're taking your first steps towards sustainability. Keep it up—small changes add up!";
    }
    if (score <= 6) {
      return "Great job! You're actively engaging in sustainable practices and making a positive impact.";
    }
    return "Outstanding! You're leading the charge in eco-friendly living and setting a strong example for others.";
  };

  const getPersonalityIcon = (score: number) => {
    if (score <= 2) {
      return <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Sprout className="w-8 h-8 text-green-500" />
      </div>;
    }
    if (score <= 4) {
      return <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Flower2 className="w-8 h-8 text-green-600" />
      </div>;
    }
    if (score <= 6) {
      return <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Trees className="w-8 h-8 text-green-700" />
      </div>;
    }
    return <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
      <Palmtree className="w-8 h-8 text-green-800" />
    </div>;
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    try {
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Get the overview content
      const overviewContent = document.querySelector('[data-testid="overview-tab"]');
      
      if (overviewContent instanceof HTMLElement) {
        // Add title and header
        pdf.setFillColor(34, 197, 94); // Green color
        pdf.rect(0, 0, pdf.internal.pageSize.width, 40, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.text('Carbon Footprint Report', 20, 25);

        // Add user info section
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Name: ${state.name}`, 20, 50);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 57);
        pdf.text(`Total Footprint: ${formatNumber(totalFootprint)} metric tons CO2e/year`, 20, 64);

        // Convert the overview content to canvas
        const canvas = await html2canvas(overviewContent, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200,
          onclone: (document, element) => {
            // Adjust styles for better PDF rendering
            element.style.padding = '20px';
            element.style.width = '1100px';
            const charts = element.querySelectorAll('.recharts-wrapper');
            charts.forEach(chart => {
              (chart as HTMLElement).style.width = '100%';
            });
          }
        });

        // Calculate dimensions to fit on A4
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add the overview content
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 75, imgWidth, imgHeight);

        // Add footer
        const pageHeight = pdf.internal.pageSize.height;
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text('Generated by Carbon Footprint Calculator', 20, pageHeight - 10);
        
        // Save the PDF
        pdf.save(`carbon-footprint-${state.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    
    const mx = cx + (outerRadius + 3) * cos;
    const my = cy + (outerRadius + 3) * sin;
    
    const textAnchor = cos >= 0 ? 'start' : 'end';
    const xOffset = cos >= 0 ? 3 : -3;

    return (
      <g>
        <path
          d={`M${mx},${my}L${x},${y}`}
          stroke={COLORS[index % COLORS.length]}
          strokeWidth={1}
          fill="none"
        />
        <text
          x={x + xOffset}
          y={y}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          className="text-xs"
          fill="#374151"
        >
          {`${name}: ${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Your Carbon Footprint Results</CardTitle>
            <Button variant="outline" size="sm" onClick={onReset}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-8 p-6 bg-primary/5 rounded-xl text-center">
            <div className="flex items-center justify-center mb-2">
              {impactLevel.icon}
              <h3 className="text-xl font-medium ml-2">{impactLevel.level} Carbon Footprint</h3>
            </div>
            <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">
              {formatNumber(totalFootprint)}
              <span className="text-base font-normal text-muted-foreground ml-2">metric tons CO2e/year</span>
            </p>
            <p className="text-muted-foreground mt-2">
              {comparedToUS < 100 
                ? `That's ${formatNumber(100 - comparedToUS)}% lower than the average American.`
                : `That's ${formatNumber(comparedToUS - 100)}% higher than the average American.`}
            </p>
            <div className="mt-4 text-sm inline-flex items-center bg-white/80 px-3 py-1 rounded-full">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              <span>Based on data relevant to {localInfo.region}</span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="methodology">Methodology</TabsTrigger>
            </TabsList>
            
            <TabsContent 
              value="overview" 
              className="pt-6 space-y-8" 
              data-testid="overview-tab"
            >
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium mb-4">Emissions by Category</h3>
                  <div className="h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          innerRadius={0}
                          paddingAngle={2}
                          fill="#8884d8"
                          dataKey="value"
                          label={renderCustomizedLabel}
                          animationBegin={0}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              strokeWidth={1}
                              stroke="#fff"
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={<CustomTooltip />}
                          wrapperStyle={{ outline: 'none' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4 flex items-center">
                    How You Compare
                    <div className="relative ml-2 group">
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white p-2 rounded shadow-md text-xs w-48 z-10">
                        Comparison with global and national averages. The sustainability target is based on UN climate goals.
                      </div>
                    </div>
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[{ name: 'Your Footprint', value: totalFootprint }]}
                        margin={{
                          top: 30,
                          right: 180,
                          left: 60,
                          bottom: 30,
                        }}
                        barSize={50}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis 
                          dataKey="name"
                          tick={{ fontSize: 14 }}
                        />
                        <YAxis 
                          unit=" tons" 
                          tick={{ fontSize: 14 }}
                          domain={[0, Math.max(20, Math.ceil(totalFootprint * 1.2))]}
                        />
                        <Tooltip content={<ComparisonTooltip />} />
                        <Bar dataKey="value" fill="#22C55E" radius={[6, 6, 0, 0]} />
                        <ReferenceLine 
                          y={16} 
                          stroke="#475569" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          label={{ 
                            value: 'US Average', 
                            position: 'right',
                            fill: '#475569',
                            fontSize: 14
                          }}
                        />
                        <ReferenceLine 
                          y={4.8} 
                          stroke="#64748B" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          label={{ 
                            value: 'Global Average', 
                            position: 'right',
                            fill: '#64748B',
                            fontSize: 14
                          }}
                        />
                        <ReferenceLine 
                          y={2} 
                          stroke="#059669" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          label={{ 
                            value: 'Sustainability Target', 
                            position: 'right',
                            fill: '#059669',
                            fontSize: 14
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Your Eco Personality</h3>
                    <p className="text-sm text-green-600">Based on your sustainable practices</p>
                  </div>
                  {getPersonalityIcon(calculateSustainabilityScore(state))}
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded-full">
                      <div 
                        className="h-3 bg-gradient-to-r from-green-300 to-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${(calculateSustainabilityScore(state) / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-3 font-medium text-green-700">
                    {calculateSustainabilityScore(state)}/8 Points
                  </span>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-green-800 mb-2">
                    {getPersonalityLabel(calculateSustainabilityScore(state))}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getPersonalityDescription(calculateSustainabilityScore(state))}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
                <p className="text-muted-foreground mb-6">
                  Based on your responses, we've identified these opportunities to reduce your carbon footprint:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className={`p-1 ${rec.difficulty === 'easy' ? 'bg-green-100' : rec.difficulty === 'medium' ? 'bg-amber-100' : 'bg-red-100'}`}>
                        <div className="flex justify-between items-center px-3 py-1">
                          <span className="text-xs font-medium">{rec.category}</span>
                          <span className={`text-xs font-medium ${rec.difficulty === 'easy' ? 'text-green-600' : rec.difficulty === 'medium' ? 'text-amber-600' : 'text-red-600'}`}>
                            {rec.difficulty.charAt(0).toUpperCase() + rec.difficulty.slice(1)}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4 pt-3">
                        <h4 className="font-medium text-lg mb-1">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                        <div className="flex items-center text-xs text-primary font-medium">
                          <Leaf className="h-3 w-3 mr-1" />
                          {rec.impact}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center text-blue-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    Local Resources
                  </h4>
                  <div className="text-sm space-y-2 text-blue-600">
                    <p><strong>Local Energy Mix:</strong> {localInfo.energyMix}</p>
                    <p><strong>Transportation Options:</strong> {localInfo.transportOptions}</p>
                    <p><strong>Community Initiatives:</strong> {localInfo.localInitiatives}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Home Emissions</h4>
                  <p className="text-2xl font-bold">{formatNumber(homeEmissions / 1000)} <span className="text-sm font-normal text-muted-foreground">metric tons</span></p>
                  <p className="text-sm text-muted-foreground mt-1">From electricity, heating, and cooking</p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>• Electricity: {formatNumber(state.electricityKwh * 12 * 0.429 / 1000)} tons</p>
                    <p>• Natural Gas: {formatNumber(state.naturalGasTherm * 12 * 5.3 / 1000)} tons</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Transportation Emissions</h4>
                  <p className="text-2xl font-bold">{formatNumber(transportEmissions / 1000)} <span className="text-sm font-normal text-muted-foreground">metric tons</span></p>
                  <p className="text-sm text-muted-foreground mt-1">From driving, flying, and public transit</p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>• Car ({state.carType.toLowerCase()}): {formatNumber(state.carMiles * 12 * (state.carType === 'MEDIUM' ? 0.35 : 0.44) / 1000)} tons</p>
                    <p>• Flights: {formatNumber(state.flightMiles * 0.18 / 1000)} tons</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Food Emissions</h4>
                  <p className="text-2xl font-bold">{formatNumber(foodEmissions / 1000)} <span className="text-sm font-normal text-muted-foreground">metric tons</span></p>
                  <p className="text-sm text-muted-foreground mt-1">Based on your {state.dietType.toLowerCase().replace('_', ' ')} diet</p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>• Adopting a plant-based diet even 1-2 days per week can reduce this significantly</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Waste Emissions</h4>
                  <p className="text-2xl font-bold">{formatNumber(wasteEmissions / 1000)} <span className="text-sm font-normal text-muted-foreground">metric tons</span></p>
                  <p className="text-sm text-muted-foreground mt-1">From garbage and recycling habits</p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>• Recycling rate: {state.recyclingPercentage}%</p>
                    <p>• Composting food waste can reduce methane emissions from landfills</p>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="methodology" className="pt-4">
              <h3 className="text-xl font-medium mb-4">Our Calculation Methodology</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>This calculator uses peer-reviewed emissions factors from governmental and academic sources including:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>U.S. Environmental Protection Agency (EPA) emissions factors</li>
                  <li>Intergovernmental Panel on Climate Change (IPCC) guidelines</li>
                  <li>Department of Energy (DOE) data on regional electricity generation</li>
                  <li>Peer-reviewed studies on food lifecycle emissions</li>
                </ul>
                
                <h4 className="font-medium mt-6 mb-2 text-foreground">Assumptions & Limitations</h4>
                <p>To provide a user-friendly experience, we make certain assumptions:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Electricity emissions are based on average grid mix for your region</li>
                  <li>Vehicle emissions assume average efficiency for each vehicle category</li>
                  <li>Flight emissions include radiative forcing effects at high altitudes</li>
                  <li>Food emissions are based on typical diet patterns within each category</li>
                </ul>
                
                <h4 className="font-medium mt-6 mb-2 text-foreground">Data Sources</h4>
                <p>Our emissions factors are regularly updated based on the latest available data from:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>EPA's Emissions & Generation Resource Integrated Database (eGRID)</li>
                  <li>IPCC's Fifth Assessment Report</li>
                  <li>National Renewable Energy Laboratory (NREL) lifecycle assessments</li>
                  <li>Academic studies published in peer-reviewed journals</li>
                </ul>
                
                <p className="mt-6">For questions about our methodology or to discuss your specific case, please contact us at <a href="mailto:sustainability@example.com" className="text-primary hover:underline">sustainability@example.com</a>.</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="border-t border-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium">Ready to take action?</h3>
              <p className="text-muted-foreground">Support verified carbon reduction projects or share your results.</p>
            </div>
            <div className="flex gap-3">
              <Button>
                Offset Now
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGeneratePDF} 
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share PDF
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
