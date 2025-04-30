import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, Car, Utensils, Trash2, Wind,
  Zap, Leaf, Bus, Bike, Train,
  Apple, Beef, PackageCheck, Recycle,
  Battery, CloudSun, PackageX, ShoppingBag, ShoppingCart, Store,
  Sun, Cloud, Info, MapPin, Timer
} from 'lucide-react';

interface QuestionTileProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

const QuestionTile: React.FC<QuestionTileProps> = ({
  selected,
  onClick,
  icon,
  title,
  description,
  impact
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-6 rounded-xl cursor-pointer transition-all duration-300",
        "border-2 hover:shadow-lg transform hover:-translate-y-1",
        selected ? [
          impact === 'low' && "border-green-500 bg-green-50",
          impact === 'medium' && "border-yellow-500 bg-yellow-50",
          impact === 'high' && "border-red-500 bg-red-50",
        ] : "border-gray-200 bg-white hover:border-gray-300"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className={cn(
          "p-3 rounded-lg w-fit",
          selected ? [
            impact === 'low' && "bg-green-100 text-green-600",
            impact === 'medium' && "bg-yellow-100 text-yellow-600",
            impact === 'high' && "bg-red-100 text-red-600",
          ] : "bg-gray-100 text-gray-600"
        )}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <div className={cn(
          "text-sm font-medium px-3 py-1 rounded-full w-fit",
          selected ? [
            impact === 'low' && "bg-green-100 text-green-700",
            impact === 'medium' && "bg-yellow-100 text-yellow-700",
            impact === 'high' && "bg-red-100 text-red-700",
          ] : "bg-gray-100 text-gray-600"
        )}>
          {impact === 'low' && "Low Impact"}
          {impact === 'medium' && "Medium Impact"}
          {impact === 'high' && "High Impact"}
        </div>
      </div>
      {selected && (
        <div className={cn(
          "absolute -top-2 -right-2 p-1 rounded-full",
          impact === 'low' && "bg-green-500",
          impact === 'medium' && "bg-yellow-500",
          impact === 'high' && "bg-red-500",
        )}>
          <Leaf className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

interface QuestionTilesProps {
  category: 'homeEnergy' | 'transport' | 'food' | 'waste' | 'airQuality';
  subCategory: 'efficiency' | 'management' | 'primary' | 'carProfile' | 'diet' | 'plateProfile' | 'prevention' | 'monitoring' | 'impact' | 'shopping' | 'wasteManagement' | 'outdoorQuality' | 'indoorQuality' | 'commuting';
  value: string;
  onChange: (value: string) => void;
}

export const QuestionTiles: React.FC<QuestionTilesProps> = ({
  category,
  subCategory,
  value,
  onChange
}) => {
  const getTileOptions = () => {
    switch (category) {
      case 'homeEnergy':
        if (subCategory === 'efficiency') {
          return [
            {
              value: 'A',
              icon: <Battery className="h-6 w-6" />,
              title: 'Energy Efficient Home',
              description: 'Smart thermostats, LED lights, and energy-efficient appliances',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Zap className="h-6 w-6" />,
              title: 'Mixed Efficiency',
              description: 'Some energy-efficient features but room for improvement',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Home className="h-6 w-6" />,
              title: 'Standard Home',
              description: 'Traditional appliances and lighting systems',
              impact: 'high'
            }
          ];
        } else {
          return [
            {
              value: 'A',
              icon: <Wind className="h-6 w-6" />,
              title: 'Renewable Energy',
              description: 'Solar panels or renewable energy provider',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Zap className="h-6 w-6" />,
              title: 'Mixed Sources',
              description: 'Combination of renewable and traditional energy',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Home className="h-6 w-6" />,
              title: 'Traditional Grid',
              description: 'Standard utility provider without renewable options',
              impact: 'high'
            }
          ];
        }

      case 'transport':
        if (subCategory === 'primary') {
          return [
            {
              value: 'A',
              icon: <Bike className="h-6 w-6" />,
              title: 'Active Transport',
              description: 'Walking or cycling for most trips',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Bus className="h-6 w-6" />,
              title: 'Public Transit',
              description: 'Regular use of buses, trains, or shared transport',
              impact: 'low'
            },
            {
              value: 'C',
              icon: <Car className="h-6 w-6" />,
              title: 'Personal Vehicle',
              description: 'Primary use of personal car for transport',
              impact: 'high'
            }
          ];
        } else {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Electric Vehicle',
              description: 'Zero-emission electric vehicle',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Car className="h-6 w-6" />,
              title: 'Hybrid Vehicle',
              description: 'Hybrid or fuel-efficient vehicle',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Car className="h-6 w-6" />,
              title: 'Standard Vehicle',
              description: 'Traditional gasoline/diesel vehicle',
              impact: 'high'
            }
          ];
        }

      case 'food':
        if (subCategory === 'diet') {
          return [
            {
              value: 'VEGAN',
              icon: <Apple className="h-6 w-6" />,
              title: 'Plant-Based Diet',
              description: '100% plant-based foods',
              impact: 'low'
            },
            {
              value: 'VEGETARIAN',
              icon: <Utensils className="h-6 w-6" />,
              title: 'Vegetarian',
              description: 'No meat, but includes dairy and eggs',
              impact: 'low'
            },
            {
              value: 'FLEXITARIAN',
              icon: <Beef className="h-6 w-6" />,
              title: 'Flexitarian',
              description: 'Mostly plant-based with occasional meat',
              impact: 'medium'
            },
            {
              value: 'MEAT_MODERATE',
              icon: <Beef className="h-6 w-6" />,
              title: 'Moderate Meat',
              description: 'Regular meat consumption',
              impact: 'high'
            }
          ];
        } else {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Local & Seasonal',
              description: 'Primarily local, seasonal, and organic foods',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Utensils className="h-6 w-6" />,
              title: 'Mixed Sources',
              description: 'Combination of local and imported foods',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <PackageCheck className="h-6 w-6" />,
              title: 'Conventional',
              description: 'Primarily conventional and imported foods',
              impact: 'high'
            }
          ];
        }

      case 'waste':
        if (subCategory === 'prevention') {
          return [
            {
              value: 'A',
              icon: <PackageCheck className="h-6 w-6" />,
              title: 'Zero Waste Champion',
              description: 'I always carry reusable bags, a water bottle, and containers—so I can refuse single-use items every time',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Recycle className="h-6 w-6" />,
              title: 'Consistent Reuser',
              description: 'I bring my reusables most days, but sometimes I grab disposables if I forget',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Trash2 className="h-6 w-6" />,
              title: 'Occasional Reuser',
              description: 'I occasionally use reusable items but often rely on whatever is convenient',
              impact: 'medium'
            },
            {
              value: 'D',
              icon: <PackageX className="h-6 w-6" />,
              title: 'Basic Disposer',
              description: 'I rarely think about reusables until I see the trash piling up',
              impact: 'high'
            }
          ];
        } else if (subCategory === 'wasteManagement') {
          return [
            {
              value: 'A',
              icon: <Recycle className="h-6 w-6" />,
              title: 'Dedicated Recycler',
              description: 'I carefully sort, recycle, and even repurpose items to keep waste to a minimum',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <PackageCheck className="h-6 w-6" />,
              title: 'Casual Recycler',
              description: 'I recycle when possible, but I might not always sort everything correctly',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Trash2 className="h-6 w-6" />,
              title: 'Basic Disposer',
              description: 'I typically dispose of everything in the same bin, without much thought for separation',
              impact: 'high'
            }
          ];
        } else if (subCategory === 'shopping') {
          return [
            {
              value: 'A',
              icon: <ShoppingBag className="h-6 w-6" />,
              title: 'Conscious Consumer',
              description: 'I always opt for reusable products, consciously avoiding single-use items and packaging',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <ShoppingCart className="h-6 w-6" />,
              title: 'Balanced Shopper',
              description: 'I try to choose eco-friendly products, though sometimes convenience prevails',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Store className="h-6 w-6" />,
              title: 'Convenience Shopper',
              description: 'I rarely consider the waste factor—I usually buy what is readily available',
              impact: 'high'
            }
          ];
        }
        break;

      case 'airQuality':
        if (subCategory === 'commuting') {
          return [
            {
              value: 'A',
              icon: <MapPin className="h-6 w-6" />,
              title: 'Air Quality Conscious',
              description: 'I plan my trips to steer clear of heavy traffic and high-pollution areas',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Timer className="h-6 w-6" />,
              title: 'Sometimes Considerate',
              description: 'I adjust my schedule or route if I know the air is bad',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Car className="h-6 w-6" />,
              title: 'Not Considered',
              description: 'I do not consider air quality when I am out and about',
              impact: 'high'
            },
            {
              value: 'D',
              icon: <Info className="h-6 w-6" />,
              title: 'Never Thought About It',
              description: 'I have not thought about air quality during commuting',
              impact: 'high'
            }
          ];
        } else if (subCategory === 'indoorQuality') {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Air Purifiers & Plants',
              description: 'I use air purifiers and maintain indoor plants for optimal air quality',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Wind className="h-6 w-6" />,
              title: 'Natural Ventilation',
              description: 'I regularly open windows and use natural ventilation',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Cloud className="h-6 w-6" />,
              title: 'Basic Management',
              description: 'No special steps for indoor air quality',
              impact: 'high'
            },
            {
              value: 'D',
              icon: <Info className="h-6 w-6" />,
              title: 'Not Considered',
              description: 'I have not thought about indoor air quality management',
              impact: 'high'
            }
          ];
        } else if (subCategory === 'outdoorQuality') {
          return [
            {
              value: 'A',
              icon: <Wind className="h-6 w-6" />,
              title: 'Fresh and Clean',
              description: 'It feels crisp, clean, and refreshing—like a breath of pure air',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Sun className="h-6 w-6" />,
              title: 'Generally Clear',
              description: 'It is generally clear, though I notice a little haze on busy days',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Cloud className="h-6 w-6" />,
              title: 'Sometimes Polluted',
              description: 'It is often a bit smoggy or polluted, especially during rush hours',
              impact: 'high'
            },
            {
              value: 'D',
              icon: <Info className="h-6 w-6" />,
              title: 'Not Sure',
              description: 'I rarely pay attention to the air quality',
              impact: 'high'
            }
          ];
        } else if (subCategory === 'monitoring') {
          return [
            {
              value: 'A',
              icon: <CloudSun className="h-6 w-6" />,
              title: 'Active Monitoring',
              description: 'Regular air quality monitoring and filtration',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Wind className="h-6 w-6" />,
              title: 'Basic Awareness',
              description: 'Occasional monitoring of air quality',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Wind className="h-6 w-6" />,
              title: 'No Monitoring',
              description: 'No air quality monitoring systems',
              impact: 'high'
            }
          ];
        } else {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Low Impact',
              description: 'Use of air-friendly products and practices',
              impact: 'low'
            },
            {
              value: 'B',
              icon: <Wind className="h-6 w-6" />,
              title: 'Moderate Impact',
              description: 'Some consideration for air quality',
              impact: 'medium'
            },
            {
              value: 'C',
              icon: <Wind className="h-6 w-6" />,
              title: 'High Impact',
              description: 'Limited consideration for air quality',
              impact: 'high'
            }
          ];
        }

      default:
        return [];
    }
  };

  const options = getTileOptions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {options.map((option) => (
        <QuestionTile
          key={option.value}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
          icon={option.icon}
          title={option.title}
          description={option.description}
          impact={option.impact as 'low' | 'medium' | 'high'}
        />
      ))}
    </div>
  );
}; 