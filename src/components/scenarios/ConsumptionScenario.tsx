
import React from 'react';
import ScenarioCard from './ScenarioCard';
import { ShoppingBag } from 'lucide-react';

interface ConsumptionScenarioProps {
  fashionConsumption: string;
  fashionEmissions: number;
}

const ConsumptionScenario: React.FC<ConsumptionScenarioProps> = ({ 
  fashionConsumption,
  fashionEmissions
}) => {
  return (
    <ScenarioCard 
      title="What if you reduced consumption?"
      description="Explore the impact of sustainable shopping habits"
      icon={<ShoppingBag />}
      currentValue={fashionConsumption}
      currentEmissions={fashionEmissions}
      scenarios={[
        {
          name: "Sustainable Clothing",
          value: "SUSTAINABLE",
          reduction: 0.4, // 40% reduction
          icon: <ShoppingBag />,
          savings: {
            daily: fashionEmissions * 0.4 / 365,
            weekly: fashionEmissions * 0.4 / 52,
            annual: fashionEmissions * 0.4
          }
        },
        {
          name: "Second-hand Shopping",
          value: "SECOND_HAND",
          reduction: 0.6, // 60% reduction
          icon: <ShoppingBag />,
          savings: {
            daily: fashionEmissions * 0.6 / 365,
            weekly: fashionEmissions * 0.6 / 52,
            annual: fashionEmissions * 0.6
          }
        },
        {
          name: "Minimal Consumption",
          value: "MINIMAL",
          reduction: 0.7, // 70% reduction
          icon: <ShoppingBag />,
          savings: {
            daily: fashionEmissions * 0.7 / 365,
            weekly: fashionEmissions * 0.7 / 52,
            annual: fashionEmissions * 0.7
          }
        }
      ]}
    />
  );
};

export default ConsumptionScenario;
