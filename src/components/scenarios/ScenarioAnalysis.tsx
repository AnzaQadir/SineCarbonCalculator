
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCalculator } from '@/hooks/useCalculator';
import ScenarioAnalysisHeader from './ScenarioAnalysisHeader';
import CommuteScenario from './CommuteScenario';
import EnergyScenario from './EnergyScenario';
import DietScenario from './DietScenario';
import ConsumptionScenario from './ConsumptionScenario';

interface ScenarioAnalysisProps {
  className?: string;
}

const ScenarioAnalysis: React.FC<ScenarioAnalysisProps> = ({ className }) => {
  const { state, results } = useCalculator();
  const [activeScenario, setActiveScenario] = useState('commute');

  return (
    <section id="scenario-analysis" className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <ScenarioAnalysisHeader />

        <Tabs defaultValue="commute" value={activeScenario} onValueChange={setActiveScenario} className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="commute">Commute</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
          </TabsList>
          
          <TabsContent value="commute" className="space-y-6">
            <CommuteScenario 
              primaryTransportMode={state.primaryTransportMode}
              transportEmissions={results.transport}
            />
          </TabsContent>
          
          <TabsContent value="energy" className="space-y-6">
            <EnergyScenario 
              heatingSource={state.heatingSource}
              homeEmissions={results.home}
            />
          </TabsContent>
          
          <TabsContent value="diet" className="space-y-6">
            <DietScenario 
              dietType={state.dietType}
              foodEmissions={results.food}
            />
          </TabsContent>
          
          <TabsContent value="consumption" className="space-y-6">
            <ConsumptionScenario 
              fashionConsumption={state.fashionConsumption}
              fashionEmissions={results.fashion}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ScenarioAnalysis;
