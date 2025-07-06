import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, Car, Utensils, Trash2, Wind,
  Zap, Leaf, Bus, Bike, Train,
  Apple, Beef, PackageCheck, Recycle,
  Battery, CloudSun, PackageX, ShoppingBag, ShoppingCart, Store,
  Sun, Cloud, Info, MapPin, Timer, FileText, Shirt, Wrench,
  Plane, Truck, Star
} from 'lucide-react';

interface QuestionTileProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const zerrahColors = [
  'zerrah-red',
  'zerrah-orange',
  'zerrah-yellow',
  'zerrah-lightgreen',
  'zerrah-green',
  'zerrah-blue',
];

const QuestionTile: React.FC<QuestionTileProps> = ({
  selected,
  onClick,
  icon,
  title,
  description,
  color
}) => {
  // Ripple effect state
  const [ripple, setRipple] = React.useState(false);
  return (
    <div
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      onClick={e => {
        setRipple(true);
        setTimeout(() => setRipple(false), 400);
        onClick();
      }}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={cn(
        "relative flex flex-col items-center p-8 rounded-3xl cursor-pointer transition-all duration-200 outline-none h-full min-h-[320px]",
        "border-2 shadow-md hover:shadow-xl hover:-translate-y-1 focus:ring-4",
        selected
          ? `${color} bg-opacity-20 border-${color} ring-2 ring-${color}`
          : "bg-white border-gray-200"
      )}
      style={{ minWidth: 220, maxWidth: 320 }}
    >
      {/* Ripple effect */}
      {ripple && (
        <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${color} opacity-30 rounded-full animate-ping pointer-events-none z-0`} />
      )}
      <div className={cn(
        "flex items-center justify-center mb-4 rounded-full transition-all duration-300",
        selected ? `${color} bg-opacity-30` : `${color} bg-opacity-10`
      )} style={{ width: 64, height: 64, fontSize: 36, position: 'relative', zIndex: 1 }}>
        <span className={selected ? `text-${color} transition-colors duration-300` : `text-gray-500 transition-colors duration-300`}>
          {icon}
        </span>
        {selected && (
          <span className={`absolute -top-2 -right-2 ${color} rounded-full p-1 shadow animate-bounce`}>
            <svg className="h-4 w-4 text-white animate-scale-in" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
          </span>
        )}
      </div>
      <h3 className="font-extrabold text-xl text-center mb-1 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-base text-center leading-snug">{description}</p>
    </div>
  );
};

interface QuestionTilesProps {
  category: 'homeEnergy' | 'transport' | 'food' | 'waste' | 'airQuality' | 'clothing';
  subCategory: 'efficiency' | 'management' | 'primary' | 'carProfile' | 'diet' | 'plateProfile' | 'prevention' | 'monitoring' | 'impact' | 'shopping' | 'wasteManagement' | 'outdoorQuality' | 'indoorQuality' | 'commuting' | 'wardrobeImpact' | 'mindfulUpgrades' | 'durability' | 'wasteComposition' | 'localvsseasonal' | 'consumptionFrequency' | 'brandLoyalty' | 'monthlyDiningOut' | 'repairOrReplace';
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
              icon: <Zap className="h-6 w-6" />,
              title: 'Energy Efficient Home',
              description: 'Smart thermostats, LED lights, and energy-efficient appliances'
            },
            {
              value: 'B',
              icon: <Battery className="h-6 w-6" />,
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
              icon: <Sun className="h-6 w-6" />,
              title: 'Mixed Sources',
              description: 'Combination of renewable and traditional energy'
            },
            {
              value: 'C',
              icon: <Zap className="h-6 w-6" />,
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
            },
            {
              value: 'D',
              icon: <Plane className="h-6 w-6" />,
              title: 'Frequent Flyer',
              description: 'Frequent air travel'
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
              icon: <Battery className="h-6 w-6" />,
              title: 'Hybrid Vehicle',
              description: 'Hybrid or fuel-efficient vehicle'
            },
            {
              value: 'C',
              icon: <Car className="h-6 w-6" />,
              title: 'Standard Vehicle',
              description: 'Traditional gasoline/diesel vehicle'
            },
            {
              value: 'D',
              icon: <Truck className="h-6 w-6" />,
              title: 'Large Vehicle',
              description: 'Large or heavy-duty vehicle'
            },
            {
              value: 'E',
              icon: <Star className="h-6 w-6" />,
              title: 'Luxury Vehicle',
              description: 'Luxury or high-end vehicle'
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
            },
            {
              value: 'MEAT_HEAVY',
              icon: <Beef className="h-6 w-6" />,
              title: 'Mostly Meat',
              description: 'Heavy meat consumption'
            }
          ];
        } else if (subCategory === 'monthlyDiningOut') {
          return [
            {
              value: 'A',
              icon: <Utensils className="h-6 w-6" />,
              title: 'Rarely Dine Out',
              description: 'Less than 1 time a month'
            },
            {
              value: 'B',
              icon: <Utensils className="h-6 w-6" />,
              title: 'Occasionally',
              description: '1-4 times a month'
            },
            {
              value: 'C',
              icon: <ShoppingBag className="h-6 w-6" />,
              title: 'Regularly',
              description: '5-10 times a month'
            },
            {
              value: 'D',
              icon: <ShoppingBag className="h-6 w-6" />,
              title: 'Frequently',
              description: 'More than 10 times a month'
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
              title: 'Mostly Imported',
              description: 'Primarily imported and conventional foods'
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
              title: 'Mostly Imported',
              description: 'Primarily imported and conventional foods'
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
        } else if (subCategory === 'repairOrReplace') {
          return [
            {
              value: 'A',
              icon: <Wrench className="h-6 w-6" />,
              title: 'Always Repair',
              description: 'I always try to repair items before considering replacement'
            },
            {
              value: 'B',
              icon: <Wrench className="h-6 w-6" />,
              title: 'Sometimes Repair',
              description: 'I sometimes repair items, depending on the situation and cost'
            },
            {
              value: 'C',
              icon: <PackageX className="h-6 w-6" />,
              title: 'Usually Replace',
              description: 'I usually replace broken items rather than repairing them'
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
            },
            {
              value: 'E',
              icon: <Cloud className="h-6 w-6" />,
              title: 'Mostly Polluted',
              description: 'The air quality is consistently poor and visibly polluted'
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
              description: 'I don\'t notice a difference in mood and energy levels'
            },
            {
              value: 'B',
              icon: <Wind className="h-6 w-6" />,
              title: 'Moderate Impact',
              description: 'My energy levels are a little lower and I sometimes feel irritable'
            },
            {
              value: 'C',
              icon: <Wind className="h-6 w-6" />,
              title: 'High Impact',
              description: 'My energy levels are significantly lower and I feel quite irritable'
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8 w-full">
      {(options || []).map((option, idx) => (
        <div key={option.value} className="mx-3 my-4">
          <QuestionTile
            selected={value === option.value}
            onClick={() => onChange(option.value)}
            icon={option.icon}
            title={option.title}
            description={option.description}
            color={zerrahColors[idx % zerrahColors.length]}
          />
        </div>
      ))}
    </div>
  );
}; 