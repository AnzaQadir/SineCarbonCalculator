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
import { ArrowLeft, Download, Share2, AlertCircle, Leaf, AlertTriangle, Check, MapPin, Info, Sprout, Flower2, Trees, Palmtree, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from '@/utils/formatters';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  score: number;
  emissions: number;
  recommendations: string[];
  isVisible: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  score,
  emissions,
  recommendations,
  isVisible
}) => {
  const getScoreCategory = (score: number) => {
    if (score >= 80) return { label: 'Excellent', icon: Check, color: 'text-green-500' };
    if (score >= 60) return { label: 'Good', icon: Info, color: 'text-blue-500' };
    if (score >= 40) return { label: 'Fair', icon: AlertCircle, color: 'text-yellow-500' };
    return { label: 'Needs Improvement', icon: AlertTriangle, color: 'text-red-500' };
  };

  const { label, icon: Icon, color } = getScoreCategory(score);

  return (
    <div className={cn(
      "transition-opacity duration-500",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      <Card className="w-full">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Your Carbon Footprint Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("h-6 w-6", color)} />
                <h3 className="text-xl font-semibold">Sustainability Score</h3>
              </div>
              <p className="text-3xl font-bold mb-2">{score}/100</p>
              <p className={cn("font-medium", color)}>{label}</p>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Annual CO₂ Emissions</h3>
              <p className="text-3xl font-bold mb-2">{emissions.toFixed(1)} tons</p>
              <p className="text-muted-foreground">
                Global average is 4.7 tons per person
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recommendations</h3>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
