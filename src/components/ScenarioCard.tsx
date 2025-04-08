
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ArrowRight } from 'lucide-react';

interface ScenarioSavings {
  daily: number;
  weekly: number;
  annual: number;
}

interface ScenarioOption {
  name: string;
  value: string;
  reduction: number;
  icon: React.ReactNode;
  savings: ScenarioSavings;
}

interface ScenarioCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  currentValue: string;
  currentEmissions: number;
  scenarios: ScenarioOption[];
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  title,
  description,
  icon,
  currentValue,
  currentEmissions,
  scenarios
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioOption | null>(null);
  
  const formatCO2 = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <Card 
              key={scenario.value}
              className={`cursor-pointer hover:border-primary transition-all ${selectedScenario?.value === scenario.value ? 'border-2 border-primary' : ''}`}
              onClick={() => setSelectedScenario(scenario)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {scenario.icon}
                    </div>
                    <CardTitle className="text-base">{scenario.name}</CardTitle>
                  </div>
                  
                  {selectedScenario?.value === scenario.value && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  Reduces emissions by {scenario.reduction * 100}%
                </p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${scenario.reduction * 100}%` }} 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedScenario && (
          <div className="bg-secondary/30 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Impact of {selectedScenario.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-background">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Daily Savings</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-end gap-4">
                    <div className="text-2xl font-bold">{formatCO2(selectedScenario.savings.daily)}</div>
                    <div className="text-sm text-muted-foreground">kg CO₂e</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Weekly Savings</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-end gap-4">
                    <div className="text-2xl font-bold">{formatCO2(selectedScenario.savings.weekly)}</div>
                    <div className="text-sm text-muted-foreground">kg CO₂e</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Annual Savings</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-end gap-4">
                    <div className="text-2xl font-bold">{formatCO2(selectedScenario.savings.annual)}</div>
                    <div className="text-sm text-muted-foreground">kg CO₂e</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-medium mb-2">Emissions Comparison</h4>
              <div className="flex items-center gap-4 mb-2">
                <div className="text-sm font-medium w-28">Current:</div>
                <Progress value={100} className="h-3" />
                <div className="text-sm">{formatCO2(currentEmissions)} kg CO₂e</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium w-28">With {selectedScenario.name}:</div>
                <Progress value={100 - (selectedScenario.reduction * 100)} className="h-3" />
                <div className="text-sm">{formatCO2(currentEmissions * (1 - selectedScenario.reduction))} kg CO₂e</div>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                By adopting {selectedScenario.name.toLowerCase()}, you could save approximately {formatCO2(selectedScenario.savings.annual)} kg CO₂e per year. 
                This is equivalent to {(selectedScenario.savings.annual / 22.7).toFixed(1)} trees planted!
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" className="w-full">
          Learn More About This Scenario
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScenarioCard;
