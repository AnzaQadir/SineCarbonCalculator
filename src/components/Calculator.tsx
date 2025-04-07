import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Car, 
  Plane, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle,
  ThumbsUp,
  PlugZap,
  Flame,
  Wind,
  LifeBuoy,
  Bus,
  Train,
  Apple,
  Beef,
  Leaf,
  Info,
  User,
  Mail,
  Briefcase,
  Sun,
  Zap,
  Bike,
  Battery,
  ShoppingBag,
  Recycle,
  PackageX,
  Utensils,
  Shirt,
  Repeat,
  PackageCheck,
  Store,
  Timer,
  Scale,
  Check,
  CircleDot
} from 'lucide-react';
import { CalculatorState } from '@/hooks/useCalculator';
import ResultsDisplay from './ResultsDisplay';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalculatorProps {
  state: CalculatorState;
  onUpdate: (updates: Partial<CalculatorState>) => void;
  onCalculate: () => void;
  onBack: () => void;
  onNext: () => void;
  onStepChange: (step: number) => void;
  currentStep: number;
}

const Calculator: React.FC<CalculatorProps> = ({
  state,
  onUpdate,
  onCalculate,
  onBack,
  onNext,
  onStepChange,
  currentStep
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNext = () => {
    if (currentStep < 5) {
      onNext();
    } else {
      onCalculate();
    }
  };

  const calculateScore = () => {
    let score = 0;

    // Diet score
    switch (state.dietType) {
      case 'VEGAN':
        score += 10;
        break;
      case 'VEGETARIAN':
        score += 8;
        break;
      case 'FLEXITARIAN':
        score += 6;
        break;
      case 'MEAT_MODERATE':
        score += 4;
        break;
      case 'MEAT_HEAVY':
        score += 2;
        break;
      default:
        score += 4; // Default to moderate
    }

    // ... rest of the score calculation ...
    return score;
  };

  const renderDemographics = () => (
    <div className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>Your Information</CardTitle>
        </div>
        <CardDescription>
          Tell us a bit about yourself to help personalize your carbon footprint calculation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 text-primary mr-2" />
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
            </div>
            <input
              id="name"
              type="text"
              value={state.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 text-primary mr-2" />
              <label htmlFor="age" className="text-sm font-medium">
                Age
              </label>
            </div>
            <input
              id="age"
              type="number"
              min="0"
              value={state.age || ''}
              onChange={(e) => onUpdate({ age: Number(e.target.value) || 0 })}
              className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Enter your age"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 text-primary mr-2" />
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
            </div>
            <input
              id="email"
              type="email"
              value={state.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 text-primary mr-2" />
              <label htmlFor="gender" className="text-sm font-medium">
                Gender
              </label>
            </div>
            <select
              id="gender"
              value={state.gender}
              onChange={(e) => onUpdate({ gender: e.target.value })}
              className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Briefcase className="h-4 w-4 text-primary mr-2" />
              <label htmlFor="profession" className="text-sm font-medium">
                Profession
              </label>
            </div>
            <input
              id="profession"
              type="text"
              value={state.profession}
              onChange={(e) => onUpdate({ profession: e.target.value })}
              className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Enter your profession"
            />
          </div>
        </div>
      </CardContent>
    </div>
  );

  const renderHomeEnergy = () => (
    <div className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Home className="h-5 w-5 text-primary" />
          <CardTitle>Home Energy</CardTitle>
        </div>
        <CardDescription>
          Enter your average monthly usage for each energy source.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <PlugZap className="h-4 w-4 text-primary mr-2" />
              <label htmlFor="electricity" className="text-sm font-medium">
                Electricity (kWh/month)
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">You can find this on your electricity bill. The average US household uses about 900 kWh per month.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <input
              id="electricity"
              type="number"
              min="0"
              value={state.electricityKwh}
              onChange={(e) => onUpdate({ electricityKwh: Number(e.target.value) || 0 })}
              className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Average US household: 900 kWh/month
            </p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Flame className="h-4 w-4 text-primary mr-2" />
              <label htmlFor="naturalGas" className="text-sm font-medium">
                Natural Gas (therms/month)
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Check your gas bill for this information. The average US home uses 50 therms per month.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <input
              id="naturalGas"
              type="number"
              min="0"
              value={state.naturalGasTherm}
              onChange={(e) => onUpdate({ naturalGasTherm: Number(e.target.value) || 0 })}
              className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Average US household: 50 therms/month
            </p>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Wind className="h-4 w-4 text-primary mr-2" />
              <label htmlFor="heatingOil" className="text-sm font-medium">
                Heating Oil (gallons/month)
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Most common in Northeastern US. Leave as 0 if you don't use heating oil.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <input
              id="heatingOil"
              type="number"
              min="0"
              value={state.heatingOilGallons}
              onChange={(e) => onUpdate({ heatingOilGallons: Number(e.target.value) || 0 })}
              className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <LifeBuoy className="h-4 w-4 text-primary mr-2" />
              <label htmlFor="propane" className="text-sm font-medium">
                Propane (gallons/month)
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Used for heating, cooking, or water heating in some homes. Leave as 0 if not applicable.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <input
              id="propane"
              type="number"
              min="0"
              value={state.propaneGallons}
              onChange={(e) => onUpdate({ propaneGallons: Number(e.target.value) || 0 })}
              className="w-full border border-input bg-transparent rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium">Do you use renewable energy sources at home?</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Do you use renewable energy sources at home (e.g., solar panels, wind energy)?</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="peer sr-only"
                    checked={!state.usesRenewableEnergy}
                    onChange={() => onUpdate({ usesRenewableEnergy: false })}
                  />
                  <div className="w-20 h-8 rounded-full bg-secondary peer-checked:bg-primary/20 peer-checked:text-primary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80">
                    No
                  </div>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="peer sr-only"
                    checked={state.usesRenewableEnergy}
                    onChange={() => onUpdate({ usesRenewableEnergy: true })}
                  />
                  <div className="w-20 h-8 rounded-full bg-secondary peer-checked:bg-primary/20 peer-checked:text-primary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80">
                    Yes
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium">Have you implemented energy efficiency measures ?</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Have you implemented energy efficiency measures (insulation, smart thermostats, energy-efficient appliances)?</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="peer sr-only"
                    checked={!state.hasEnergyEfficiencyUpgrades}
                    onChange={() => onUpdate({ hasEnergyEfficiencyUpgrades: false })}
                  />
                  <div className="w-20 h-8 rounded-full bg-secondary peer-checked:bg-primary/20 peer-checked:text-primary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80">
                    No
                  </div>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="peer sr-only"
                    checked={state.hasEnergyEfficiencyUpgrades}
                    onChange={() => onUpdate({ hasEnergyEfficiencyUpgrades: true })}
                  />
                  <div className="w-20 h-8 rounded-full bg-secondary peer-checked:bg-primary/20 peer-checked:text-primary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80">
                    Yes
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-1">Why this matters</h4>
                <p className="text-xs text-blue-600">
                  Home energy use accounts for about 20% of the average carbon footprint in the US. Using renewable energy can reduce this by up to 80%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );

  const renderTransportationStep = () => (
    <div className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Car className="h-5 w-5 text-primary" />
          <CardTitle>Transportation</CardTitle>
        </div>
        <CardDescription>
          Tell us about your daily commute and travel habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Primary Commute Mode</Label>
          <Select
            value={state.primaryTransportMode}
            onValueChange={(value: 'WALK_BIKE' | 'PUBLIC' | 'HYBRID' | 'ELECTRIC' | 'SMALL_CAR' | 'MEDIUM_CAR' | 'LARGE_CAR') => 
              onUpdate({ primaryTransportMode: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="What is your primary mode of transportation?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WALK_BIKE">Walking/Biking (Zero emissions)</SelectItem>
              <SelectItem value="PUBLIC">Public Transit (Low emissions)</SelectItem>
              <SelectItem value="HYBRID">Hybrid Vehicle (Medium emissions)</SelectItem>
              <SelectItem value="ELECTRIC">Electric Vehicle (Low emissions)</SelectItem>
              <SelectItem value="SMALL_CAR">Small Car (Medium emissions)</SelectItem>
              <SelectItem value="MEDIUM_CAR">Medium Car (High emissions)</SelectItem>
              <SelectItem value="LARGE_CAR">Large Car (Very high emissions)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Weekly Travel Distance (miles)</Label>
          <Input
            type="number"
            value={state.weeklyCommuteDistance}
            onChange={(e) => onUpdate({ weeklyCommuteDistance: parseFloat(e.target.value) || 0 })}
            placeholder="Enter your weekly travel distance"
          />
        </div>

        <div>
          <Label>Vehicle Efficiency (MPG)</Label>
          <Input
            type="number"
            value={state.vehicleEfficiency}
            onChange={(e) => onUpdate({ vehicleEfficiency: parseFloat(e.target.value) || 0 })}
            placeholder="Enter your vehicle's fuel efficiency"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave blank if you don't use a personal vehicle
          </p>
        </div>

        <div>
          <Label>Long-Distance Travel</Label>
          <Select
            value={state.flightType}
            onValueChange={(value: 'NONE' | 'RARE' | 'OCCASIONAL' | 'FREQUENT') => 
              onUpdate({ flightType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="How often do you travel by air?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">Never (No air travel)</SelectItem>
              <SelectItem value="RARE">Rarely (1-2 times per year)</SelectItem>
              <SelectItem value="OCCASIONAL">Occasionally (3-5 times per year)</SelectItem>
              <SelectItem value="FREQUENT">Frequently (6+ times per year)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-primary" />
            <label className="text-sm font-medium">Carbon Offset</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Do you offset your travel emissions through carbon credits or other means?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center space-x-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="peer sr-only"
                checked={!state.offsetsTravelEmissions}
                onChange={() => onUpdate({ offsetsTravelEmissions: false })}
              />
              <div className={cn(
                "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                !state.offsetsTravelEmissions && "bg-primary/20 text-primary"
              )}>
                No
              </div>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="peer sr-only"
                checked={state.offsetsTravelEmissions}
                onChange={() => onUpdate({ offsetsTravelEmissions: true })}
              />
              <div className={cn(
                "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                state.offsetsTravelEmissions && "bg-primary/20 text-primary"
              )}>
                Yes
              </div>
            </label>
          </div>
        </div>

        <div className="mt-6 bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Transportation Impact
          </h4>
          <p className="text-sm text-muted-foreground">
            Transportation accounts for a significant portion of personal carbon emissions. 
            Choosing sustainable modes of transport, reducing travel distance, and offsetting 
            emissions can help lower your environmental impact.
          </p>
        </div>
      </CardContent>
    </div>
  );

  const renderFoodStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <Label>Diet Type</Label>
          <Select
            value={state.dietType}
            onValueChange={(value: 'VEGAN' | 'VEGETARIAN' | 'FLEXITARIAN' | 'MEAT_MODERATE' | 'MEAT_HEAVY') => 
              onUpdate({ dietType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VEGAN">Vegan</SelectItem>
              <SelectItem value="VEGETARIAN">Vegetarian</SelectItem>
              <SelectItem value="FLEXITARIAN">Flexitarian</SelectItem>
              <SelectItem value="MEAT_MODERATE">Moderate Meat</SelectItem>
              <SelectItem value="MEAT_HEAVY">Heavy Meat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Plant-Based Meals per Week</Label>
          <Input
            type="number"
            value={state.plantBasedMealsPerWeek}
            onChange={(e) => onUpdate({ plantBasedMealsPerWeek: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Sustainable Diet</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you follow a sustainable diet with reduced meat consumption?</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.followsSustainableDiet}
                  onChange={() => onUpdate({ followsSustainableDiet: false })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.followsSustainableDiet && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.followsSustainableDiet}
                  onChange={() => onUpdate({ followsSustainableDiet: true })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.followsSustainableDiet && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFood = () => (
    <div className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <CardTitle>Food & Diet</CardTitle>
        </div>
        <CardDescription className="text-gray-600">
          Your diet has a significant impact on your carbon footprint.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={cn(
              "flex items-center space-x-3 p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50",
              state.dietType === 'MEAT_HEAVY' ? "border-primary bg-primary/5" : "border-gray-200"
            )}
            onClick={() => onUpdate({ dietType: 'MEAT_HEAVY' })}
          >
            <div className="flex-shrink-0">
              <CircleDot className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Meat Heavy</h3>
              <p className="text-gray-600">
                Red meat and dairy multiple times per day
              </p>
            </div>
          </div>
          
          <div
            className={cn(
              "flex items-center space-x-3 p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50",
              state.dietType === 'MEAT_MODERATE' ? "border-primary bg-primary/5" : "border-gray-200"
            )}
            onClick={() => onUpdate({ dietType: 'MEAT_MODERATE' })}
          >
            <div className="flex-shrink-0">
              <ThumbsUp className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Average</h3>
              <p className="text-gray-600">
                Meat several times per week
              </p>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center space-x-3 p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50",
              state.dietType === 'VEGETARIAN' ? "border-primary bg-primary/5" : "border-gray-200"
            )}
            onClick={() => onUpdate({ dietType: 'VEGETARIAN' })}
          >
            <div className="flex-shrink-0">
              <Apple className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Vegetarian</h3>
              <p className="text-gray-600">
                No meat, but includes dairy and eggs
              </p>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center space-x-3 p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50",
              state.dietType === 'VEGAN' ? "border-primary bg-primary/5" : "border-gray-200"
            )}
            onClick={() => onUpdate({ dietType: 'VEGAN' })}
          >
            <div className="flex-shrink-0">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Vegan</h3>
              <p className="text-gray-600">
                No animal products whatsoever
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Local & Organic Choices</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choosing local and organic foods reduces transportation emissions and chemical inputs. 
                     This choice provides a bonus to your sustainability score.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.buysLocalFood}
                  onChange={() => onUpdate({ buysLocalFood: false })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.buysLocalFood && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.buysLocalFood}
                  onChange={() => onUpdate({ buysLocalFood: true })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.buysLocalFood && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PackageX className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Food Waste Management</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reducing food waste through meal planning and using leftovers helps lower the 
                     indirect carbon costs of food production. This provides a positive modifier to your score.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.usesMealPlanning}
                  onChange={() => onUpdate({ usesMealPlanning: false })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.usesMealPlanning && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.usesMealPlanning}
                  onChange={() => onUpdate({ usesMealPlanning: true })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.usesMealPlanning && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <Store className="h-4 w-4 text-primary" />
              <Label>Dining Habits</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home-cooked meals typically have lower energy use and waste compared to dining out. 
                     Your dining habits affect your overall food emissions profile.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={state.diningOutFrequency}
              onValueChange={(value: 'RARELY' | 'SOMETIMES' | 'FREQUENTLY') => 
                onUpdate({ diningOutFrequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="How often do you dine out?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RARELY">Rarely (Mostly home-cooked, lowest impact)</SelectItem>
                <SelectItem value="SOMETIMES">Sometimes (2-3 times/week, moderate impact)</SelectItem>
                <SelectItem value="FREQUENTLY">Frequently (4+ times/week, highest impact)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PackageCheck className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Reusable Practices</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Using reusable containers and bags reduces single-use plastic waste and related emissions. 
                     This provides an additional bonus to your food/diet section score.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.usesReusableContainers}
                  onChange={() => onUpdate({ usesReusableContainers: false })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.usesReusableContainers && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.usesReusableContainers}
                  onChange={() => onUpdate({ usesReusableContainers: true })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.usesReusableContainers && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Food Impact & Insights
          </h4>
          <p className="text-sm text-muted-foreground">
            Your food choices significantly impact your carbon footprint. While students and young 
            professionals often choose plant-based meals, frequent dining out can increase emissions. 
            Consider the environmental cost of restaurant meals versus home cooking.
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Plant-based meals can reduce your food emissions by up to 70%</li>
              <li>Local food choices reduce transportation emissions</li>
              <li>Meal planning reduces food waste and associated emissions</li>
              <li>Home cooking typically has a lower carbon footprint than dining out</li>
              <li>Reusable containers help reduce plastic waste and packaging emissions</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </div>
  );

  const renderWaste = () => (
    <div className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Trash2 className="h-5 w-5 text-primary" />
          <CardTitle>Waste & Consumption</CardTitle>
        </div>
        <CardDescription>
          Tell us about your waste management and consumption habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center space-x-2">
            <Trash2 className="h-4 w-4 text-primary" />
            <Label>Pounds of trash per month</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Average person produces about 30-40 lbs per month</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            type="number"
            value={state.waste.wasteLbs}
            onChange={(e) => onUpdate({ waste: { ...state.waste, wasteLbs: parseFloat(e.target.value) || 0 } })}
            placeholder="Enter pounds of trash per month"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Average person produces about 30-40 lbs per month
          </p>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Recycle className="h-4 w-4 text-primary" />
            <Label>What percentage of your waste do you recycle?</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move the slider to indicate your recycling percentage</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="pt-4 pb-2">
            <Slider
              value={[state.waste.recyclingPercentage]}
              onValueChange={(value) => onUpdate({ waste: { ...state.waste, recyclingPercentage: value[0] } })}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Recycle className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Recycling & Waste Minimization</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you actively recycle, compost, and avoid single-use plastics?</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.waste.minimizesWaste}
                  onChange={() => onUpdate({ waste: { ...state.waste, minimizesWaste: false } })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.waste.minimizesWaste && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.waste.minimizesWaste}
                  onChange={() => onUpdate({ waste: { ...state.waste, minimizesWaste: true } })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.waste.minimizesWaste && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>

          <div>
            <Label>Product Lifespan & Upgrade Frequency</Label>
            <Select
              value={state.waste.productLifespan}
              onValueChange={(value: 'FREQUENT' | 'MODERATE' | 'LONG') => 
                onUpdate({ waste: { ...state.waste, productLifespan: value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="How frequently do you replace items?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREQUENT">Frequent (Every 1-2 years)</SelectItem>
                <SelectItem value="MODERATE">Moderate (Every 3-5 years)</SelectItem>
                <SelectItem value="LONG">Long (More than 5 years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Conscious Purchasing</Label>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Not Conscious</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => onUpdate({ waste: { ...state.waste, consciousPurchasing: value } })}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                      state.waste.consciousPurchasing === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Very Conscious</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PackageCheck className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Lifecycle Evaluation</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you evaluate a product's lifecycle or carbon footprint before making significant purchases?</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.waste.evaluatesLifecycle}
                  onChange={() => onUpdate({ waste: { ...state.waste, evaluatesLifecycle: false } })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.waste.evaluatesLifecycle && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.waste.evaluatesLifecycle}
                  onChange={() => onUpdate({ waste: { ...state.waste, evaluatesLifecycle: true } })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.waste.evaluatesLifecycle && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Waste Impact
          </h4>
          <p className="text-sm text-muted-foreground">
            Your waste and consumption habits significantly impact your carbon footprint. 
            Recycling, conscious purchasing, and evaluating product lifecycles can help 
            reduce waste-related emissions.
          </p>
        </div>
      </CardContent>
    </div>
  );

  const renderFashion = () => (
    <div className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Shirt className="h-5 w-5 text-primary" />
          <CardTitle>Fashion & Apparel</CardTitle>
        </div>
        <CardDescription>
          Tell us about your clothing and fashion habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Fashion Consumption Level</Label>
          <Select
            value={state.fashionConsumption}
            onValueChange={(value: 'MINIMAL' | 'MODERATE' | 'FREQUENT') => 
              onUpdate({ fashionConsumption: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your fashion consumption level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MINIMAL">Minimal (Few new items per year)</SelectItem>
              <SelectItem value="MODERATE">Moderate (Seasonal updates)</SelectItem>
              <SelectItem value="FREQUENT">Frequent (Regular new purchases)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Clothing Lifespan</Label>
          <Select
            value={state.clothingLifespan}
            onValueChange={(value: 'SHORT' | 'MEDIUM' | 'LONG') => 
              onUpdate({ clothingLifespan: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="How long do you typically keep your clothes?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SHORT">Short (Less than 1 year)</SelectItem>
              <SelectItem value="MEDIUM">Medium (1-3 years)</SelectItem>
              <SelectItem value="LONG">Long (More than 3 years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Ethical Fashion</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you prioritize buying from ethical and sustainable fashion brands?</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.buysEthicalFashion}
                  onChange={() => onUpdate({ buysEthicalFashion: false })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.buysEthicalFashion && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.buysEthicalFashion}
                  onChange={() => onUpdate({ buysEthicalFashion: true })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.buysEthicalFashion && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Repeat className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Second-Hand Shopping</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you regularly buy second-hand or vintage clothing?</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.buysSecondHandClothing}
                  onChange={() => onUpdate({ buysSecondHandClothing: false })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.buysSecondHandClothing && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.buysSecondHandClothing}
                  onChange={() => onUpdate({ buysSecondHandClothing: true })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.buysSecondHandClothing && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PackageX className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Fast Fashion Avoidance</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you avoid buying from fast fashion brands?</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.avoidsFastFashion}
                  onChange={() => onUpdate({ avoidsFastFashion: false })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.avoidsFastFashion && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.avoidsFastFashion}
                  onChange={() => onUpdate({ avoidsFastFashion: true })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.avoidsFastFashion && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PackageCheck className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Quality Investment</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you invest in high-quality, long-lasting clothing items?</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={!state.investsInQuality}
                  onChange={() => onUpdate({ investsInQuality: false })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  !state.investsInQuality && "bg-primary/20 text-primary"
                )}>
                  No
                </div>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={state.investsInQuality}
                  onChange={() => onUpdate({ investsInQuality: true })}
                />
                <div className={cn(
                  "w-20 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
                  state.investsInQuality && "bg-primary/20 text-primary"
                )}>
                  Yes
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Fashion Impact
          </h4>
          <p className="text-sm text-muted-foreground">
            The fashion industry is responsible for 10% of global carbon emissions. 
            Choosing sustainable fashion options, buying second-hand, and investing in 
            quality pieces can significantly reduce your fashion footprint.
          </p>
        </div>
      </CardContent>
    </div>
  );

  const steps = [
    { title: 'Demographics', icon: User, content: renderDemographics },
    { title: 'Home Energy', icon: Home, content: renderHomeEnergy },
    { title: 'Transportation', icon: Car, content: renderTransportationStep },
    { title: 'Food & Diet', icon: Utensils, content: renderFoodStep },
    { title: 'Waste', icon: Recycle, content: renderWaste },
    { title: 'Fashion', icon: Shirt, content: renderFashion },
  ];

  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <div 
      id="calculator" 
      className={cn(
        "w-full max-w-3xl mx-auto transition-opacity duration-500 py-10",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <Card variant="elevated" className={currentStep === 5 ? 'w-full' : ''}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CurrentStepIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          {steps[currentStep].content()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button onClick={onCalculate}>
                Calculate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
