
import React from 'react';
import ScenarioCard from './ScenarioCard';
import { Leaf } from 'lucide-react';

interface DietScenarioProps {
  dietType: string;
  foodEmissions: number;
}

const DietScenario: React.FC<DietScenarioProps> = ({ 
  dietType,
  foodEmissions
}) => {
  return (
    <ScenarioCard 
      title="What if you changed your diet?"
      description="See the impact of incorporating more plant-based meals"
      icon={<Leaf />}
      currentValue={dietType}
      currentEmissions={foodEmissions}
      scenarios={[
        {
          name: "Vegetarian Diet",
          value: "VEGETARIAN",
          reduction: 0.3, // 30% reduction
          icon: <Leaf />,
          savings: {
            daily: foodEmissions * 0.3 / 365,
            weekly: foodEmissions * 0.3 / 52,
            annual: foodEmissions * 0.3
          }
        },
        {
          name: "Vegan Diet",
          value: "VEGAN", 
          reduction: 0.5, // 50% reduction
          icon: <Leaf />,
          savings: {
            daily: foodEmissions * 0.5 / 365,
            weekly: foodEmissions * 0.5 / 52,
            annual: foodEmissions * 0.5
          }
        },
        {
          name: "Flexitarian Diet",
          value: "FLEXITARIAN",
          reduction: 0.2, // 20% reduction
          icon: <Leaf />,
          savings: {
            daily: foodEmissions * 0.2 / 365,
            weekly: foodEmissions * 0.2 / 52,
            annual: foodEmissions * 0.2
          }
        }
      ]}
    />
  );
};

export default DietScenario;
