import React from 'react';
import { cn } from '@/lib/utils';
import { Users, Leaf } from 'lucide-react';

interface MovementTileProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}

const MovementTile: React.FC<MovementTileProps> = ({
  selected,
  onClick,
  title,
  description
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-6 rounded-xl cursor-pointer transition-all duration-300",
        "border-2 hover:shadow-lg transform hover:-translate-y-1",
        selected ? "border-gray-500 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-300"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className={cn(
          "p-3 rounded-lg w-fit",
          selected ? "bg-gray-100 text-gray-600" : "bg-gray-100 text-gray-600"
        )}>
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      {selected && (
        <div className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-500">
          <Leaf className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

interface MovementTilesProps {
  value: string;
  onChange: (value: string) => void;
}

export const MovementTiles: React.FC<MovementTilesProps> = ({
  value,
  onChange
}) => {
  const movementOptions = [
    {
      value: 'INDIVIDUAL',
      title: 'Individual',
      description: 'Making personal sustainable choices'
    },
    {
      value: 'COMMUNITY',
      title: 'Community',
      description: 'Leading local sustainability initiatives'
    },
    {
      value: 'ORGANIZATION',
      title: 'Organization',
      description: 'Driving corporate sustainability efforts'
    },
    {
      value: 'EDUCATOR',
      title: 'Educator',
      description: 'Teaching and inspiring others about sustainability'
    },
    {
      value: 'POLICY_MAKER',
      title: 'Policy Maker',
      description: 'Shaping sustainable policies and regulations'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {movementOptions.map((option) => (
        <MovementTile
          key={option.value}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
          title={option.title}
          description={option.description}
        />
      ))}
    </div>
  );
}; 