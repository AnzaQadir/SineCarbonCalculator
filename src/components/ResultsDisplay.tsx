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
import { AlertCircle, ArrowLeft, Download, Share2, Leaf, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Tooltip as RechartsTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultsDisplayProps {
  score: number;
  emissions: number;
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    impact: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>;
  isVisible: boolean;
  categoryEmissions: {
    home: number;
    transport: number;
    food: number;
    waste: number;
  };
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  score,
  emissions,
  recommendations,
  isVisible,
  categoryEmissions,
  onReset
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

  const getEcoPersonality = (score: number) => {
    if (score <= 20) return { title: 'Eco Novice', points: '1/8 Points', description: 'Just starting your sustainable journey. There\'s plenty of room to grow your eco-friendly habits.' };
    if (score <= 40) return { title: 'Green Starter', points: '2/8 Points', description: 'Taking your first steps towards sustainability. Keep building those eco-friendly habits!' };
    if (score <= 60) return { title: 'Eco Advocate', points: '4/8 Points', description: 'Making good progress on your sustainability journey. Your choices are making a difference.' };
    if (score <= 80) return { title: 'Sustainability Pro', points: '6/8 Points', description: 'You\'re a sustainability champion! Your choices significantly reduce your environmental impact.' };
    return { title: 'Climate Hero', points: '8/8 Points', description: 'Outstanding! You\'re leading the way in sustainable living and inspiring others.' };
  };

  const personality = getEcoPersonality(score);

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
          <Card className="bg-green-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-green-700">Your Eco Personality</h3>
                  <p className="text-gray-600">Based on your sustainable practices</p>
                </div>
                <div className="bg-green-100 rounded-full p-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${(score / 100) * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <span className="text-sm text-gray-600">{personality.points}</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold">{personality.title}</h4>
                <p className="text-gray-600">{personality.description}</p>
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
          <div className="space-y-4">
            <h3 className="text-xl">Ready to take action?</h3>
            <p className="text-gray-600">Support verified carbon reduction projects or share your results.</p>
            
            <div className="flex gap-4">
              <Button className="bg-green-700 hover:bg-green-800 text-white">
                Offset Now
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="space-y-8 mt-6 px-4">
            <div className="grid grid-cols-2 gap-8">
              {/* Home Emissions */}
              <Card className="p-8 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Home Emissions</h3>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-gray-900">{categoryEmissions.home.toFixed(2)}</span>
                    <span className="text-lg text-gray-500">metric tons</span>
                  </div>
                  <p className="text-gray-600 text-lg">From electricity, heating, and cooking</p>
                </div>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Electricity: {(categoryEmissions.home * 0.57).toFixed(2)} tons
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Natural Gas: {(categoryEmissions.home * 0.43).toFixed(2)} tons
                  </li>
                </ul>
              </Card>

              {/* Transportation Emissions */}
              <Card className="p-8 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Transportation Emissions</h3>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-gray-900">{categoryEmissions.transport.toFixed(2)}</span>
                    <span className="text-lg text-gray-500">metric tons</span>
                  </div>
                  <p className="text-gray-600 text-lg">From driving, flying, and public transit</p>
                </div>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Car (medium): {(categoryEmissions.transport * 0.82).toFixed(2)} tons
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Flights: {(categoryEmissions.transport * 0.18).toFixed(2)} tons
                  </li>
                </ul>
              </Card>

              {/* Food Emissions */}
              <Card className="p-8 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Food Emissions</h3>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-gray-900">{categoryEmissions.food.toFixed(2)}</span>
                    <span className="text-lg text-gray-500">metric tons</span>
                  </div>
                  <p className="text-gray-600 text-lg">Based on your average diet</p>
                </div>
                <div className="mt-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Adopting a plant-based diet even 1-2 days per week can reduce this significantly
                  </div>
                </div>
              </Card>

              {/* Waste Emissions */}
              <Card className="p-8 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Waste Emissions</h3>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-gray-900">{categoryEmissions.waste.toFixed(2)}</span>
                    <span className="text-lg text-gray-500">metric tons</span>
                  </div>
                  <p className="text-gray-600 text-lg">From garbage and recycling habits</p>
                </div>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Recycling rate: 30%
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Composting food waste can reduce methane emissions from landfills
                  </li>
                </ul>
              </Card>
            </div>

            {/* Tips Section */}
            <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100/50 mt-8 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Tips to Reduce Your Footprint</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-700">Quick Wins</h4>
                  <ul className="space-y-3 text-gray-600">
                    {['Switch to LED bulbs', 'Use cold water for laundry', 'Reduce meat consumption', 'Start composting'].map((tip) => (
                      <li key={tip} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-700">Long-term Impact</h4>
                  <ul className="space-y-3 text-gray-600">
                    {['Install solar panels', 'Switch to an electric vehicle', 'Improve home insulation', 'Use public transportation'].map((tip) => (
                      <li key={tip} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
