import React from 'react';
import { cn } from '@/lib/utils';
import { User, Leaf } from 'lucide-react';

interface AgeTileProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}

const AgeTile: React.FC<AgeTileProps> = ({
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
        selected ? "border-green-500 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className={cn(
          "p-3 rounded-lg w-fit",
          selected ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
        )}>
          <User className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      {selected && (
        <div className="absolute -top-2 -right-2 p-1 rounded-full bg-green-500">
          <Leaf className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

interface AgeTilesProps {
  value: string;
  onChange: (value: string) => void;
}

export const AgeTiles: React.FC<AgeTilesProps> = ({
  value,
  onChange
}) => {
  const ageOptions = [
    {
      value: 'UNDER_10',
      title: 'Under 10',
      description: 'Young explorer learning about sustainability'
    },
    {
      value: '10_TO_15',
      title: '10-15 years',
      description: 'Growing eco-conscious teen'
    },
    {
      value: '15_TO_20',
      title: '15-20 years',
      description: 'Young environmental advocate'
    },
    {
      value: '20_TO_30',
      title: '20-30 years',
      description: 'Young adult making sustainable choices'
    },
    {
      value: '30_TO_40',
      title: '30-40 years',
      description: 'Experienced sustainability practitioner'
    },
    {
      value: 'OVER_40',
      title: 'Over 40',
      description: 'Seasoned environmental steward'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ageOptions.map((option) => (
        <AgeTile
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