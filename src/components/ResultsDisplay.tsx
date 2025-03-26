import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
import { ArrowLeft, Download, Share2, AlertCircle, Leaf, AlertTriangle, Check, MapPin, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from '@/utils/formatters';

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
    electricityKwh: number;
    naturalGasTherm: number;
    carType: string;
    carMiles: number;
    flightMiles: number;
    dietType: string;
    recyclingPercentage: number;
  };
  onReset: () => void;
}

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

  const COLORS = ['#38A169', '#4299E1', '#F59E0B', '#E53E3E'];

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

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
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
        <CardContent className="p-6">
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="methodology">Methodology</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium mb-4">Emissions by Category</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
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
                        data={comparisonData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 40,
                        }}
                        barSize={40}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          unit=" tons" 
                          tick={{ fontSize: 12 }}
                          domain={[0, Math.max(20, Math.ceil(totalFootprint * 1.2))]}
                        />
                        <Tooltip content={<ComparisonTooltip />} />
                        <ReferenceLine 
                          y={results.totalFootprint} 
                          stroke="#FF8C00" 
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{ 
                            value: 'Your footprint', 
                            position: 'insideBottomRight',
                            fill: '#FF8C00',
                            fontSize: 12
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {comparisonData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 
                                ? (entry.value <= 2 ? '#34D399' : entry.value <= 4.8 ? '#6366F1' : entry.value <= 16 ? '#F59E0B' : '#EF4444') 
                                : (index === 1 ? '#94A3B8' : index === 2 ? '#6B7280' : '#047857')}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-2">
                    Values shown in metric tons of CO2 equivalent per year
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="pt-4">
              <h3 className="text-xl font-medium mb-4">Personalized Recommendations</h3>
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
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
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
