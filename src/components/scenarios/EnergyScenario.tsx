
import React from 'react';
import ScenarioCard from './ScenarioCard';
import { Lightbulb, Leaf } from 'lucide-react';

interface EnergyScenarioProps {
  heatingSource: string;
  homeEmissions: number;
}

const EnergyScenario: React.FC<EnergyScenarioProps> = ({ 
  heatingSource,
  homeEmissions
}) => {
  return (
    <ScenarioCard 
      title="What if you improved home energy efficiency?"
      description="Explore the impact of energy-efficient appliances and renewable energy"
      icon={<Lightbulb />}
      currentValue={heatingSource}
      currentEmissions={homeEmissions}
      scenarios={[
        {
          name: "Energy Efficient Appliances",
          value: "EFFICIENT_APPLIANCES",
          reduction: 0.15, // 15% reduction
          icon: <Lightbulb />,
          savings: {
            daily: homeEmissions * 0.15 / 365,
            weekly: homeEmissions * 0.15 / 52,
            annual: homeEmissions * 0.15
          }
        },
        {
          name: "Renewable Energy",
          value: "RENEWABLE",
          reduction: 0.7, // 70% reduction
          icon: <Leaf />,
          savings: {
            daily: homeEmissions * 0.7 / 365,
            weekly: homeEmissions * 0.7 / 52, 
            annual: homeEmissions * 0.7
          }
        },
        {
          name: "Home Insulation",
          value: "INSULATION",
          reduction: 0.2, // 20% reduction
          icon: <Lightbulb />,
          savings: {
            daily: homeEmissions * 0.2 / 365,
            weekly: homeEmissions * 0.2 / 52,
            annual: homeEmissions * 0.2
          }
        }
      ]}
    />
  );
};

export default EnergyScenario;
