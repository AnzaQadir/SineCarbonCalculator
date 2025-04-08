
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/hooks/useCalculator';
import { EMISSION_FACTORS } from '@/constants/emissionFactors';
import ScenarioCard from './ScenarioCard';
import { Bike, Car, Leaf, Lightbulb, ShoppingBag } from 'lucide-react';

interface ScenarioAnalysisProps {
  className?: string;
}

const ScenarioAnalysis: React.FC<ScenarioAnalysisProps> = ({ className }) => {
  const { state, results } = useCalculator();
  const [activeScenario, setActiveScenario] = useState('commute');

  return (
    <section id="scenario-analysis" className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            "What If" Scenario Analysis
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore how different lifestyle changes could impact your carbon footprint.
            Toggle between scenarios to see the potential environmental benefits of each change.
          </p>
        </div>

        <Tabs defaultValue="commute" value={activeScenario} onValueChange={setActiveScenario} className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="commute">Commute</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
          </TabsList>
          
          <TabsContent value="commute" className="space-y-6">
            <ScenarioCard 
              title="What if you changed your commute?"
              description="See how different transportation choices affect your carbon footprint"
              icon={<Bike />}
              currentValue={state.primaryTransportMode}
              currentEmissions={results.transport}
              scenarios={[
                {
                  name: "Public Transit",
                  value: "PUBLIC",
                  reduction: 0.7, // 70% reduction compared to car
                  icon: <Bike />,
                  savings: {
                    daily: results.transport * 0.7 / 365,
                    weekly: results.transport * 0.7 / 52,
                    annual: results.transport * 0.7
                  }
                },
                {
                  name: "Biking",
                  value: "WALK_BIKE",
                  reduction: 1.0, // 100% reduction compared to car
                  icon: <Bike />,
                  savings: {
                    daily: results.transport / 365,
                    weekly: results.transport / 52,
                    annual: results.transport
                  }
                },
                {
                  name: "Electric Vehicle",
                  value: "ELECTRIC",
                  reduction: 0.6, // 60% reduction compared to gas car
                  icon: <Car />,
                  savings: {
                    daily: results.transport * 0.6 / 365,
                    weekly: results.transport * 0.6 / 52,
                    annual: results.transport * 0.6
                  }
                }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="energy" className="space-y-6">
            <ScenarioCard 
              title="What if you improved home energy efficiency?"
              description="Explore the impact of energy-efficient appliances and renewable energy"
              icon={<Lightbulb />}
              currentValue={state.heatingSource}
              currentEmissions={results.home}
              scenarios={[
                {
                  name: "Energy Efficient Appliances",
                  value: "EFFICIENT_APPLIANCES",
                  reduction: 0.15, // 15% reduction
                  icon: <Lightbulb />,
                  savings: {
                    daily: results.home * 0.15 / 365,
                    weekly: results.home * 0.15 / 52,
                    annual: results.home * 0.15
                  }
                },
                {
                  name: "Renewable Energy",
                  value: "RENEWABLE",
                  reduction: 0.7, // 70% reduction
                  icon: <Leaf />,
                  savings: {
                    daily: results.home * 0.7 / 365,
                    weekly: results.home * 0.7 / 52, 
                    annual: results.home * 0.7
                  }
                },
                {
                  name: "Home Insulation",
                  value: "INSULATION",
                  reduction: 0.2, // 20% reduction
                  icon: <Lightbulb />,
                  savings: {
                    daily: results.home * 0.2 / 365,
                    weekly: results.home * 0.2 / 52,
                    annual: results.home * 0.2
                  }
                }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="diet" className="space-y-6">
            <ScenarioCard 
              title="What if you changed your diet?"
              description="See the impact of incorporating more plant-based meals"
              icon={<Leaf />}
              currentValue={state.dietType}
              currentEmissions={results.food}
              scenarios={[
                {
                  name: "Vegetarian Diet",
                  value: "VEGETARIAN",
                  reduction: 0.3, // 30% reduction
                  icon: <Leaf />,
                  savings: {
                    daily: results.food * 0.3 / 365,
                    weekly: results.food * 0.3 / 52,
                    annual: results.food * 0.3
                  }
                },
                {
                  name: "Vegan Diet",
                  value: "VEGAN", 
                  reduction: 0.5, // 50% reduction
                  icon: <Leaf />,
                  savings: {
                    daily: results.food * 0.5 / 365,
                    weekly: results.food * 0.5 / 52,
                    annual: results.food * 0.5
                  }
                },
                {
                  name: "Flexitarian Diet",
                  value: "FLEXITARIAN",
                  reduction: 0.2, // 20% reduction
                  icon: <Leaf />,
                  savings: {
                    daily: results.food * 0.2 / 365,
                    weekly: results.food * 0.2 / 52,
                    annual: results.food * 0.2
                  }
                }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="consumption" className="space-y-6">
            <ScenarioCard 
              title="What if you reduced consumption?"
              description="Explore the impact of sustainable shopping habits"
              icon={<ShoppingBag />}
              currentValue={state.fashionConsumption}
              currentEmissions={results.fashion}
              scenarios={[
                {
                  name: "Sustainable Clothing",
                  value: "SUSTAINABLE",
                  reduction: 0.4, // 40% reduction
                  icon: <ShoppingBag />,
                  savings: {
                    daily: results.fashion * 0.4 / 365,
                    weekly: results.fashion * 0.4 / 52,
                    annual: results.fashion * 0.4
                  }
                },
                {
                  name: "Second-hand Shopping",
                  value: "SECOND_HAND",
                  reduction: 0.6, // 60% reduction
                  icon: <ShoppingBag />,
                  savings: {
                    daily: results.fashion * 0.6 / 365,
                    weekly: results.fashion * 0.6 / 52,
                    annual: results.fashion * 0.6
                  }
                },
                {
                  name: "Minimal Consumption",
                  value: "MINIMAL",
                  reduction: 0.7, // 70% reduction
                  icon: <ShoppingBag />,
                  savings: {
                    daily: results.fashion * 0.7 / 365,
                    weekly: results.fashion * 0.7 / 52,
                    annual: results.fashion * 0.7
                  }
                }
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ScenarioAnalysis;
