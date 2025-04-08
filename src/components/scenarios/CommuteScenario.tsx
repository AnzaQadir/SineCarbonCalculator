
import React from 'react';
import ScenarioCard from './ScenarioCard';
import { Bike, Car } from 'lucide-react';
import { FootprintResults } from '@/types/calculator';

interface CommuteScenarioProps {
  primaryTransportMode: string;
  transportEmissions: number;
}

const CommuteScenario: React.FC<CommuteScenarioProps> = ({ 
  primaryTransportMode,
  transportEmissions
}) => {
  return (
    <ScenarioCard 
      title="What if you changed your commute?"
      description="See how different transportation choices affect your carbon footprint"
      icon={<Bike />}
      currentValue={primaryTransportMode}
      currentEmissions={transportEmissions}
      scenarios={[
        {
          name: "Public Transit",
          value: "PUBLIC",
          reduction: 0.7, // 70% reduction compared to car
          icon: <Bike />,
          savings: {
            daily: transportEmissions * 0.7 / 365,
            weekly: transportEmissions * 0.7 / 52,
            annual: transportEmissions * 0.7
          }
        },
        {
          name: "Biking",
          value: "WALK_BIKE",
          reduction: 1.0, // 100% reduction compared to car
          icon: <Bike />,
          savings: {
            daily: transportEmissions / 365,
            weekly: transportEmissions / 52,
            annual: transportEmissions
          }
        },
        {
          name: "Electric Vehicle",
          value: "ELECTRIC",
          reduction: 0.6, // 60% reduction compared to gas car
          icon: <Car />,
          savings: {
            daily: transportEmissions * 0.6 / 365,
            weekly: transportEmissions * 0.6 / 52,
            annual: transportEmissions * 0.6
          }
        }
      ]}
    />
  );
};

export default CommuteScenario;
