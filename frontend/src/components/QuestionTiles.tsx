import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, Car, Utensils, Trash2, Wind,
  Zap, Leaf, Bus, Bike, Train,
  Apple, Beef, PackageCheck, Recycle,
  Battery, CloudSun, PackageX, ShoppingBag, ShoppingCart, Store,
  Sun, Cloud, Info, MapPin, Timer, FileText, Shirt
} from 'lucide-react';

interface QuestionTileProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const QuestionTile: React.FC<QuestionTileProps> = ({
  selected,
  onClick,
  icon,
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
          {icon}
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

interface QuestionTilesProps {
  category: 'homeEnergy' | 'transport' | 'food' | 'waste' | 'airQuality' | 'clothing';
  subCategory: 'efficiency' | 'management' | 'primary' | 'carProfile' | 'diet' | 'plateProfile' | 'prevention' | 'monitoring' | 'impact' | 'shopping' | 'wasteManagement' | 'outdoorQuality' | 'indoorQuality' | 'commuting' | 'wardrobeImpact' | 'mindfulUpgrades' | 'durability' | 'wasteComposition' | 'localvsseasonal' | 'consumptionFrequency' | 'brandLoyalty';
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
              description: 'Smart thermostats, LED lights, and energy-efficient appliances'
            },
            {
              value: 'B',
              icon: <Zap className="h-6 w-6" />,
              title: 'Mixed Efficiency',
              description: 'Some energy-efficient features but room for improvement'
            },
            {
              value: 'C',
              icon: <Home className="h-6 w-6" />,
              title: 'Standard Home',
              description: 'Traditional appliances and lighting systems'
            }
          ];
        } else {
          return [
            {
              value: 'A',
              icon: <Wind className="h-6 w-6" />,
              title: 'Renewable Energy',
              description: 'Solar panels or renewable energy provider'
            },
            {
              value: 'B',
              icon: <Zap className="h-6 w-6" />,
              title: 'Mixed Sources',
              description: 'Combination of renewable and traditional energy'
            },
            {
              value: 'C',
              icon: <Home className="h-6 w-6" />,
              title: 'Traditional Grid',
              description: 'Standard utility provider without renewable options'
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
              description: 'Walking or cycling for most trips'
            },
            {
              value: 'B',
              icon: <Bus className="h-6 w-6" />,
              title: 'Public Transit',
              description: 'Regular use of buses, trains, or shared transport'
            },
            {
              value: 'C',
              icon: <Car className="h-6 w-6" />,
              title: 'Personal Vehicle',
              description: 'Primary use of personal car for transport'
            }
          ];
        } else {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Electric Vehicle',
              description: 'Zero-emission electric vehicle'
            },
            {
              value: 'B',
              icon: <Car className="h-6 w-6" />,
              title: 'Hybrid Vehicle',
              description: 'Hybrid or fuel-efficient vehicle'
            },
            {
              value: 'C',
              icon: <Car className="h-6 w-6" />,
              title: 'Standard Vehicle',
              description: 'Traditional gasoline/diesel vehicle'
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
              description: '100% plant-based foods'
            },
            {
              value: 'VEGETARIAN',
              icon: <Utensils className="h-6 w-6" />,
              title: 'Vegetarian',
              description: 'No meat, but includes dairy and eggs'
            },
            {
              value: 'FLEXITARIAN',
              icon: <Beef className="h-6 w-6" />,
              title: 'Flexitarian',
              description: 'Mostly plant-based with occasional meat'
            },
            {
              value: 'MEAT_MODERATE',
              icon: <Beef className="h-6 w-6" />,
              title: 'Moderate Meat',
              description: 'Regular meat consumption'
            }
          ];
        } else if (subCategory === 'localvsseasonal') {
          return [
            {
              value: 'A',
              icon: <Utensils className="h-6 w-6" />,
              title: 'Mostly Home-Cooked',
              description: 'I rarely eat out—I love preparing home-cooked meals and controlling ingredients.'
            },
            {
              value: 'B',
              icon: <Utensils className="h-6 w-6" />,
              title: 'Balanced',
              description: 'I enjoy a balance; I cook most days but treat myself to a restaurant occasionally.'
            },
            {
              value: 'C',
              icon: <ShoppingBag className="h-6 w-6" />,
              title: 'Frequently Dine Out',
              description: "I frequently dine out, as it's more convenient, even if I'm not always aware of its impact."
            }
          ];
        } else if (subCategory === 'plateProfile') {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Local & Seasonal',
              description: 'Primarily local, seasonal, and organic foods'
            },
            {
              value: 'B',
              icon: <Utensils className="h-6 w-6" />,
              title: 'Mixed Sources',
              description: 'Combination of local and imported foods'
            },
            {
              value: 'C',
              icon: <PackageCheck className="h-6 w-6" />,
              title: 'Conventional',
              description: 'Primarily conventional and imported foods'
            }
          ];
        } else {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Local & Seasonal',
              description: 'Primarily local, seasonal, and organic foods'
            },
            {
              value: 'B',
              icon: <Utensils className="h-6 w-6" />,
              title: 'Mixed Sources',
              description: 'Combination of local and imported foods'
            },
            {
              value: 'C',
              icon: <PackageCheck className="h-6 w-6" />,
              title: 'Conventional',
              description: 'Primarily conventional and imported foods'
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
              description: 'I always carry reusable bags, a water bottle, and containers—so I can refuse single-use items every time'
            },
            {
              value: 'B',
              icon: <Recycle className="h-6 w-6" />,
              title: 'Consistent Reuser',
              description: 'I bring my reusables most days, but sometimes I grab disposables if I forget'
            },
            {
              value: 'C',
              icon: <Trash2 className="h-6 w-6" />,
              title: 'Occasional Reuser',
              description: 'I occasionally use reusable items but often rely on whatever is convenient'
            },
            {
              value: 'D',
              icon: <PackageX className="h-6 w-6" />,
              title: 'Basic Disposer',
              description: 'I rarely think about reusables until I see the trash piling up'
            }
          ];
        } else if (subCategory === 'shopping') {
          return [
            {
              value: 'A',
              icon: <ShoppingBag className="h-6 w-6" />,
              title: 'Conscious Consumer',
              description: 'I always opt for reusable products, consciously avoiding single-use items and packaging'
            },
            {
              value: 'B',
              icon: <ShoppingCart className="h-6 w-6" />,
              title: 'Balanced Shopper',
              description: 'I try to choose eco-friendly products, though sometimes convenience prevails'
            },
            {
              value: 'C',
              icon: <Store className="h-6 w-6" />,
              title: 'Convenience Shopper',
              description: 'I rarely consider the waste factor—I usually buy what is readily available'
            }
          ];
        } else if (subCategory === 'wasteManagement') {
          return [
            {
              value: 'A',
              icon: <Recycle className="h-6 w-6" />,
              title: 'Dedicated Recycler',
              description: 'I carefully sort, recycle, and even repurpose items to keep waste to a minimum'
            },
            {
              value: 'B',
              icon: <PackageCheck className="h-6 w-6" />,
              title: 'Casual Recycler',
              description: 'I recycle when possible, but I might not always sort everything correctly'
            },
            {
              value: 'C',
              icon: <Trash2 className="h-6 w-6" />,
              title: 'Basic Disposer',
              description: 'I typically dispose of everything in the same bin, without much thought for separation'
            }
          ];
        } else if (subCategory === 'management') {
          return [
            {
              value: 'A',
              icon: <Recycle className="h-6 w-6" />,
              title: 'Advanced Management',
              description: 'I have a comprehensive waste management system with composting and recycling'
            },
            {
              value: 'B',
              icon: <PackageCheck className="h-6 w-6" />,
              title: 'Basic Management',
              description: 'I separate recyclables and try to minimize waste'
            },
            {
              value: 'C',
              icon: <Trash2 className="h-6 w-6" />,
              title: 'Limited Management',
              description: 'I dispose of waste without much separation or management'
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
              description: 'I plan my trips to steer clear of heavy traffic and high-pollution areas'
            },
            {
              value: 'B',
              icon: <Timer className="h-6 w-6" />,
              title: 'Sometimes Considerate',
              description: 'I adjust my schedule or route if I know the air is bad'
            },
            {
              value: 'C',
              icon: <Car className="h-6 w-6" />,
              title: 'Not Considered',
              description: 'I do not consider air quality when I am out and about'
            },
            {
              value: 'D',
              icon: <Info className="h-6 w-6" />,
              title: 'Never Thought About It',
              description: 'I have not thought about air quality during commuting'
            }
          ];
        } else if (subCategory === 'indoorQuality') {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Air Purifiers & Plants',
              description: 'I use air purifiers and maintain indoor plants for optimal air quality'
            },
            {
              value: 'B',
              icon: <Wind className="h-6 w-6" />,
              title: 'Natural Ventilation',
              description: 'I regularly open windows and use natural ventilation'
            },
            {
              value: 'C',
              icon: <Cloud className="h-6 w-6" />,
              title: 'Basic Management',
              description: 'No special steps for indoor air quality'
            },
            {
              value: 'D',
              icon: <Info className="h-6 w-6" />,
              title: 'Not Considered',
              description: 'I have not thought about indoor air quality management'
            }
          ];
        } else if (subCategory === 'outdoorQuality') {
          return [
            {
              value: 'A',
              icon: <Wind className="h-6 w-6" />,
              title: 'Fresh and Clean',
              description: 'It feels crisp, clean, and refreshing—like a breath of pure air'
            },
            {
              value: 'B',
              icon: <Sun className="h-6 w-6" />,
              title: 'Generally Clear',
              description: 'It is generally clear, though I notice a little haze on busy days'
            },
            {
              value: 'C',
              icon: <Cloud className="h-6 w-6" />,
              title: 'Sometimes Polluted',
              description: 'It is often a bit smoggy or polluted, especially during rush hours'
            },
            {
              value: 'D',
              icon: <Info className="h-6 w-6" />,
              title: 'Not Sure',
              description: 'I rarely pay attention to the air quality'
            }
          ];
        } else if (subCategory === 'monitoring') {
          return [
            {
              value: 'A',
              icon: <CloudSun className="h-6 w-6" />,
              title: 'Active Monitoring',
              description: 'Regular air quality monitoring and filtration'
            },
            {
              value: 'B',
              icon: <Wind className="h-6 w-6" />,
              title: 'Basic Awareness',
              description: 'Occasional monitoring of air quality'
            },
            {
              value: 'C',
              icon: <Wind className="h-6 w-6" />,
              title: 'No Monitoring',
              description: 'No air quality monitoring systems'
            }
          ];
        } else {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Low Impact',
              description: 'Use of air-friendly products and practices'
            },
            {
              value: 'B',
              icon: <Wind className="h-6 w-6" />,
              title: 'Moderate Impact',
              description: 'Some consideration for air quality'
            },
            {
              value: 'C',
              icon: <Wind className="h-6 w-6" />,
              title: 'High Impact',
              description: 'Limited consideration for air quality'
            }
          ];
        }

      case 'clothing':
        if (subCategory === 'wardrobeImpact') {
          return [
            {
              value: 'A',
              icon: <Shirt className="h-6 w-6" />,
              title: 'Minimal Wardrobe',
              description: 'Small, curated collection of essential items'
            },
            {
              value: 'B',
              icon: <Shirt className="h-6 w-6" />,
              title: 'Balanced Collection',
              description: 'Moderate number of items with regular rotation'
            },
            {
              value: 'C',
              icon: <Shirt className="h-6 w-6" />,
              title: 'Extensive Wardrobe',
              description: 'Large collection with many rarely worn items'
            }
          ];
        } else if (subCategory === 'mindfulUpgrades') {
          return [
            {
              value: 'A',
              icon: <Leaf className="h-6 w-6" />,
              title: 'Sustainable Brands',
              description: 'Primarily shop from eco-friendly and ethical brands'
            },
            {
              value: 'B',
              icon: <ShoppingBag className="h-6 w-6" />,
              title: 'Mixed Approach',
              description: 'Mix of sustainable and conventional brands'
            },
            {
              value: 'C',
              icon: <Store className="h-6 w-6" />,
              title: 'Conventional Shopping',
              description: 'Mainly shop from conventional retail stores'
            }
          ];
        } else if (subCategory === 'durability') {
          return [
            {
              value: 'A',
              icon: <PackageCheck className="h-6 w-6" />,
              title: 'Long-lasting Items',
              description: 'Focus on quality and durability when purchasing'
            },
            {
              value: 'B',
              icon: <ShoppingCart className="h-6 w-6" />,
              title: 'Mixed Quality',
              description: 'Mix of durable and regular quality items'
            },
            {
              value: 'C',
              icon: <PackageX className="h-6 w-6" />,
              title: 'Fast Fashion',
              description: 'Regular purchases of trend-based items'
            }
          ];
        } else if (subCategory === 'consumptionFrequency') {
          return [
            {
              value: 'A',
              icon: <Timer className="h-6 w-6" />,
              title: 'Infrequent Shopper',
              description: 'Shop for clothes only when necessary'
            },
            {
              value: 'B',
              icon: <Timer className="h-6 w-6" />,
              title: 'Seasonal Shopper',
              description: 'Shop a few times per season'
            },
            {
              value: 'C',
              icon: <Timer className="h-6 w-6" />,
              title: 'Frequent Shopper',
              description: 'Regular shopping trips for new items'
            }
          ];
        } else if (subCategory === 'brandLoyalty') {
          return [
            {
              value: 'A',
              icon: <FileText className="h-6 w-6" />,
              title: 'Brand Conscious',
              description: 'Stick to trusted sustainable brands'
            },
            {
              value: 'B',
              icon: <FileText className="h-6 w-6" />,
              title: 'Flexible Shopper',
              description: 'Mix of favorite brands and new options'
            },
            {
              value: 'C',
              icon: <FileText className="h-6 w-6" />,
              title: 'Variety Seeker',
              description: 'Try many different brands and styles'
            }
          ];
        }
        return [];

      default:
        return [];
    }
  };

  const options = getTileOptions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(options || []).map((option) => (
        <QuestionTile
          key={option.value}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
          icon={option.icon}
          title={option.title}
          description={option.description}
        />
      ))}
    </div>
  );
}; 