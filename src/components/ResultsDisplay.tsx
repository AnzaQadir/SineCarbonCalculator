
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Legend 
} from 'recharts';
import { ArrowLeft, Download, Share2 } from 'lucide-react';

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
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onReset }) => {
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

  // Format number to 2 decimal places
  const formatNumber = (num: number) => {
    return Number(num.toFixed(2)).toLocaleString();
  };

  // Prepare data for the category breakdown chart
  const categoryData = [
    { name: 'Home', value: homeEmissions },
    { name: 'Transport', value: transportEmissions },
    { name: 'Food', value: foodEmissions },
    { name: 'Waste', value: wasteEmissions },
  ];

  // Prepare data for the comparison chart
  const comparisonData = [
    { name: 'Your Footprint', value: totalFootprint },
    { name: 'US Average', value: 16 },
    { name: 'Global Average', value: 4.8 },
    { name: 'Sustainability Target', value: 2 },
  ];

  // Colors for the charts
  const COLORS = ['#38A169', '#4299E1', '#F59E0B', '#E53E3E'];

  // Custom tooltip for charts
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

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <Card variant="elevated" className="overflow-hidden">
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
            <h3 className="text-xl font-medium mb-2">Total Annual Carbon Footprint</h3>
            <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">
              {formatNumber(totalFootprint)}
              <span className="text-base font-normal text-muted-foreground ml-2">metric tons CO2e</span>
            </p>
            <p className="text-muted-foreground mt-2">
              {comparedToUS < 100 
                ? `That's ${formatNumber(100 - comparedToUS)}% lower than the average American.`
                : `That's ${formatNumber(comparedToUS - 100)}% higher than the average American.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
              <h3 className="text-xl font-medium mb-4">How You Compare</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit=" tons" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#38A169">
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#38A169' : '#94A3B8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card variant="outline" className="p-4">
              <h4 className="font-medium mb-2">Home Emissions</h4>
              <p className="text-2xl font-bold">{formatNumber(homeEmissions / 1000)} <span className="text-sm font-normal text-muted-foreground">metric tons</span></p>
              <p className="text-sm text-muted-foreground mt-1">From electricity, heating, and cooking</p>
            </Card>
            <Card variant="outline" className="p-4">
              <h4 className="font-medium mb-2">Transportation Emissions</h4>
              <p className="text-2xl font-bold">{formatNumber(transportEmissions / 1000)} <span className="text-sm font-normal text-muted-foreground">metric tons</span></p>
              <p className="text-sm text-muted-foreground mt-1">From driving, flying, and public transit</p>
            </Card>
            <Card variant="outline" className="p-4">
              <h4 className="font-medium mb-2">Food Emissions</h4>
              <p className="text-2xl font-bold">{formatNumber(foodEmissions / 1000)} <span className="text-sm font-normal text-muted-foreground">metric tons</span></p>
              <p className="text-sm text-muted-foreground mt-1">Based on your dietary choices</p>
            </Card>
            <Card variant="outline" className="p-4">
              <h4 className="font-medium mb-2">Waste Emissions</h4>
              <p className="text-2xl font-bold">{formatNumber(wasteEmissions / 1000)} <span className="text-sm font-normal text-muted-foreground">metric tons</span></p>
              <p className="text-sm text-muted-foreground mt-1">From garbage and recycling habits</p>
            </Card>
          </div>

          <div className="border-t border-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium">Want to offset your carbon footprint?</h3>
              <p className="text-muted-foreground">Support verified carbon reduction projects.</p>
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
