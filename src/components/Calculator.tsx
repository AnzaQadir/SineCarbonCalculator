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
  onCalculate: (results?: any) => void;
  onBack: () => void;
  onNext: () => void;
  onStepChange: (step: number) => void;
  currentStep: number;
}

const YesNoToggle = ({ 
  value, 
  onChange, 
  className 
}: { 
  value: boolean; 
  onChange: (value: boolean) => void;
  className?: string;
}) => (
  <div className={cn("flex items-center justify-center w-full space-x-4 mt-4", className)}>
    <label className="inline-flex items-center">
      <input
        type="radio"
        className="peer sr-only"
        checked={!value}
        onChange={() => onChange(false)}
      />
      <div className={cn(
        "w-32 h-12 rounded-2xl bg-secondary/50 text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
        !value && "bg-primary/10 text-primary border-2 border-primary/50"
      )}>
        No
      </div>
    </label>
    <label className="inline-flex items-center">
      <input
        type="radio"
        className="peer sr-only"
        checked={value}
        onChange={() => onChange(true)}
      />
      <div className={cn(
        "w-32 h-12 rounded-2xl bg-secondary/50 text-muted-foreground flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary/80",
        value && "bg-primary/10 text-primary border-2 border-primary/50"
      )}>
        Yes
      </div>
    </label>
  </div>
);

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
  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState<{
    score: number;
    emissions: number;
    categoryEmissions: {
      home: number;
      transport: number;
      food: number;
      waste: number;
    };
    recommendations: {
      category: string;
      title: string;
      description: string;
      impact: string;
      difficulty: 'Easy' | 'Medium';
    }[];
  } | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onNext();
    } else {
      // Calculate results when reaching the last step
      const results = calculateScore(state);
      onCalculate(results);
    }
  };

  const handleCalculate = () => {
    const results = calculateScore(state);
    onCalculate(results);
  };

  const handleReset = () => {
    setShowResults(false);
    setCalculationResults(null);
    onStepChange(0); // Reset to first step
  };

  const calculateScore = (state: CalculatorState) => {
    let score = 0;
    let emissions = 0;
    let homeEmissions = 0;
    let transportEmissions = 0;
    let foodEmissions = 0;
    let wasteEmissions = 0;

    // Home energy score and emissions
    homeEmissions += (state.electricityKwh * 0.0005);
    homeEmissions += (state.naturalGasTherm * 0.005);
    homeEmissions += (state.heatingOilGallons * 0.01);
    homeEmissions += (state.propaneGallons * 0.005);
    
    // Add points for energy-saving practices
    if (state.usesRenewableEnergy) score += 10;
    if (state.hasEnergyEfficiencyUpgrades) score += 5;
    if (state.hasSmartThermostats) score += 3;
    if (state.hasEnergyStarAppliances) score += 2;

    // Transportation score and emissions
    switch (state.primaryTransportMode) {
      case 'WALK_BIKE':
        score += 15;
        transportEmissions += 0;
        break;
      case 'PUBLIC':
        score += 12;
        transportEmissions += 1.5;
        break;
      case 'HYBRID':
      case 'ELECTRIC':
        score += 10;
        transportEmissions += 2;
        break;
      case 'SMALL_CAR':
        score += 6;
        transportEmissions += 3;
        break;
      case 'MEDIUM_CAR':
        score += 4;
        transportEmissions += 4;
        break;
      case 'LARGE_CAR':
        score += 2;
        transportEmissions += 5;
        break;
    }

    // Add points for sustainable transport practices
    if (state.offsetsTravelEmissions) score += 5;
    if (state.usesActiveTransport) score += 5;
    if (state.hasElectricVehicle) score += 8;

    // Diet score and emissions
    switch (state.dietType) {
      case 'VEGAN':
        score += 15;
        foodEmissions += 1.5;
        break;
      case 'VEGETARIAN':
        score += 12;
        foodEmissions += 1.9;
        break;
      case 'MEAT_MODERATE':
        score += 6;
        foodEmissions += 2.5;
        break;
      case 'MEAT_HEAVY':
        score += 2;
        foodEmissions += 3.3;
        break;
    }

    // Add points for sustainable food practices
    if (state.buysLocalFood) score += 3;
    if (state.followsSustainableDiet) score += 3;
    if (state.growsOwnFood) score += 4;
    if (state.compostsFood) score += 3;
    if (state.usesMealPlanning) score += 2;
    score += state.plantBasedMealsPerWeek;

    // Waste score and emissions
    // Convert monthly waste to annual and calculate base emissions
    // Base conversion: 1 lb of waste = 0.0005 tons CO2e
    const monthlyWaste = state.waste.wasteLbs || 0;
    const annualWaste = monthlyWaste * 12;
    wasteEmissions = annualWaste * 0.0005;
    
    // Apply recycling reduction
    if (state.waste.recyclingPercentage > 0) {
      const recyclingReduction = (state.waste.recyclingPercentage / 100) * 0.5; // Up to 50% reduction based on recycling
      wasteEmissions *= (1 - recyclingReduction);
      score += Math.min(10, state.waste.recyclingPercentage / 10);
    }
    
    // Apply waste minimization reduction
    if (state.waste.minimizesWaste) {
      wasteEmissions *= 0.8; // 20% reduction for waste minimization efforts
      score += 5;
    }
    
    // Add points for waste reduction practices
    if (state.waste.avoidsPlastic) score += 4;
    if (state.waste.evaluatesLifecycle) score += 3;
    score += state.waste.consciousPurchasing * 2;

    // Total emissions
    emissions = homeEmissions + transportEmissions + foodEmissions + wasteEmissions;

    // Normalize score to 0-100 range
    // Maximum possible score is around 120, so we'll normalize to 100
    const normalizedScore = Math.min(100, Math.max(0, (score / 120) * 100));

    return {
      score: normalizedScore,
      emissions: emissions,
      categoryEmissions: {
        home: homeEmissions,
        transport: transportEmissions,
        food: foodEmissions,
        waste: wasteEmissions
      },
      recommendations: generateRecommendations(normalizedScore, state)
    };
  };

  const generateRecommendations = (score: number, state: CalculatorState) => {
    const recommendations: Array<{
      category: string;
      title: string;
      description: string;
      impact: string;
      difficulty: 'Easy' | 'Medium';
    }> = [];

    // Add waste-related recommendations
    if (!state.waste.minimizesWaste || state.waste.recyclingPercentage < 50) {
      recommendations.push({
        category: 'Waste',
        title: 'Increase Recycling Efforts',
        description: 'Increasing your recycling rate and composting organic waste can significantly reduce methane emissions from landfills.',
        impact: 'Could save up to 0.5 tons CO2e per year',
        difficulty: 'Easy'
      });
    }

    // Add energy-related recommendations
    if (!state.usesRenewableEnergy) {
      recommendations.push({
        category: 'Energy',
        title: 'Switch to Renewable Energy',
        description: 'Check if your utility offers renewable energy options or consider installing solar panels.',
        impact: 'Could save up to 3 tons CO2e per year',
        difficulty: 'Medium'
      });
    }

    // Add general recommendations
    recommendations.push({
      category: 'General',
      title: 'Reduce, Reuse, Recycle',
      description: 'Follow the waste hierarchy: reduce what you consume, reuse items when possible, and recycle what can\'t be reused.',
      impact: 'Could save up to 1 ton CO2e per year',
      difficulty: 'Easy'
    });

    return recommendations;
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
            <div className="bg-muted/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Sun className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium">Do you use renewable energy sources at home?</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Do you use renewable energy sources at home (e.g., solar panels, wind energy)?</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center justify-center">
                <YesNoToggle
                  value={state.usesRenewableEnergy}
                  onChange={(value) => onUpdate({ usesRenewableEnergy: value })}
                />
              </div>
            </div>

            <div className="bg-muted/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium">Have you implemented energy efficiency measures?</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Have you implemented energy efficiency measures (insulation, smart thermostats, energy-efficient appliances)?</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center justify-center">
                <YesNoToggle
                  value={state.hasEnergyEfficiencyUpgrades}
                  onChange={(value) => onUpdate({ hasEnergyEfficiencyUpgrades: value })}
                />
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

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Leaf className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Do you offset your travel emissions?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Do you offset your travel emissions through carbon credits or other means?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center justify-center">
            <YesNoToggle
              value={state.offsetsTravelEmissions}
              onChange={(value) => onUpdate({ offsetsTravelEmissions: value })}
                  />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  className={cn(
              "flex items-start space-x-2 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
              state.dietType === 'MEAT_HEAVY' ? "border-primary bg-primary/5" : "border-gray-200"
                  )}
            onClick={() => onUpdate({ dietType: 'MEAT_HEAVY' })}
                >
            <CircleDot className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
                    <h3 className="font-medium">Meat Heavy</h3>
              <p className="text-sm text-gray-600">Red meat and dairy multiple times per day</p>
              <p className="text-xs text-muted-foreground">Highest carbon footprint impact</p>
                  </div>
                </div>
                
                <div 
                  className={cn(
              "flex items-start space-x-2 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
              state.dietType === 'MEAT_MODERATE' ? "border-primary bg-primary/5" : "border-gray-200"
                  )}
            onClick={() => onUpdate({ dietType: 'MEAT_MODERATE' })}
                >
            <ThumbsUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
                    <h3 className="font-medium">Average</h3>
              <p className="text-sm text-gray-600">Meat several times per week</p>
              <p className="text-xs text-muted-foreground">Moderate carbon footprint impact</p>
                  </div>
                </div>
                
                <div 
                  className={cn(
              "flex items-start space-x-2 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
              state.dietType === 'VEGETARIAN' ? "border-primary bg-primary/5" : "border-gray-200"
                  )}
            onClick={() => onUpdate({ dietType: 'VEGETARIAN' })}
                >
            <Apple className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
                    <h3 className="font-medium">Vegetarian</h3>
              <p className="text-sm text-gray-600">No meat, but includes dairy and eggs</p>
              <p className="text-xs text-muted-foreground">Lower carbon footprint impact</p>
                  </div>
                </div>
                
                <div 
                  className={cn(
              "flex items-start space-x-2 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
              state.dietType === 'VEGAN' ? "border-primary bg-primary/5" : "border-gray-200"
                  )}
            onClick={() => onUpdate({ dietType: 'VEGAN' })}
                >
            <Leaf className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
                    <h3 className="font-medium">Vegan</h3>
              <p className="text-sm text-gray-600">No animal products whatsoever</p>
              <p className="text-xs text-muted-foreground">Lowest carbon footprint impact</p>
                  </div>
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Leaf className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Do you prioritize local and organic food choices?</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Local food reduces transportation emissions by up to 50%, while organic farming uses fewer chemical inputs.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center justify-center">
              <YesNoToggle
                value={state.buysLocalFood}
                onChange={(value) => onUpdate({ buysLocalFood: value })}
              />
            </div>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <PackageX className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Do you plan meals to minimize food waste?</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Food waste contributes to 8% of global emissions. Planning can reduce waste by 25%.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center justify-center">
              <YesNoToggle
                value={state.usesMealPlanning}
                onChange={(value) => onUpdate({ usesMealPlanning: value })}
              />
            </div>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Store className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">How often do you eat at restaurants?</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Restaurant meals typically have 3x larger carbon footprint than home cooking.</p>
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
                <SelectValue placeholder="Select your dining frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RARELY">Rarely (1-2 times/month)</SelectItem>
                <SelectItem value="SOMETIMES">Sometimes (1-2 times/week)</SelectItem>
                <SelectItem value="FREQUENTLY">Frequently (3+ times/week)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <PackageCheck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Do you use reusable containers and bags for food storage and shopping?</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Using reusable containers can prevent up to 150 disposable items per year.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center justify-center">
              <YesNoToggle
                value={state.usesReusableContainers}
                onChange={(value) => onUpdate({ usesReusableContainers: value })}
              />
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
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Trash2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">How many pounds of trash do you produce per month?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>The average person produces about 30-40 lbs of trash per month. Reducing this can significantly lower your environmental impact.</p>
              </TooltipContent>
            </Tooltip>
                </div>
          <Input
                  type="number"
            value={state.waste.wasteLbs}
            onChange={(e) => onUpdate({ waste: { ...state.waste, wasteLbs: parseFloat(e.target.value) || 0 } })}
            placeholder="Enter pounds of trash per month"
          />
              </div>

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Recycle className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">What percentage of your waste do you recycle?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Recycling helps reduce landfill waste and conserves resources. The average recycling rate in the US is around 32%.</p>
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

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Recycle className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Do you actively recycle and minimize waste?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Active recycling and composting can reduce your waste-related emissions by up to 40%. Avoiding single-use plastics further reduces your impact.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center justify-center">
            <YesNoToggle
              value={state.waste.minimizesWaste}
              onChange={(value) => onUpdate({ waste: { ...state.waste, minimizesWaste: value } })}
            />
          </div>
        </div>

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Timer className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">How often do you replace your items?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Extending product lifespans reduces waste and manufacturing emissions. Each year of additional use can reduce an item's carbon footprint by 20-30%.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={state.waste.productLifespan}
            onValueChange={(value: 'FREQUENT' | 'MODERATE' | 'LONG') => 
              onUpdate({ waste: { ...state.waste, productLifespan: value } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your replacement frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FREQUENT">Every 1-2 years (High impact)</SelectItem>
              <SelectItem value="MODERATE">Every 3-5 years (Medium impact)</SelectItem>
              <SelectItem value="LONG">More than 5 years (Low impact)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Scale className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">How environmentally conscious are you when making purchases?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Conscious purchasing considers environmental impact, packaging, and product longevity. This can reduce your consumption-related emissions by up to 50%.</p>
              </TooltipContent>
            </Tooltip>
          </div>
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

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <PackageCheck className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Do you evaluate product lifecycles before purchasing?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Considering a product's full lifecycle (production, use, disposal) helps make environmentally responsible choices. This can reduce your purchase-related emissions by 30-40%.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center justify-center">
            <YesNoToggle
              value={state.waste.evaluatesLifecycle}
              onChange={(value) => onUpdate({ waste: { ...state.waste, evaluatesLifecycle: value } })}
            />
                </div>
              </div>

              <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
            Waste Impact & Insights
                </h4>
                <p className="text-sm text-muted-foreground">
            Your waste and consumption habits have a significant impact on your carbon footprint. 
            Making conscious choices about purchases, recycling, and product lifecycles can help 
            reduce waste-related emissions.
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Recycling can reduce waste emissions by up to 40%</li>
              <li>Extending product life reduces manufacturing emissions</li>
              <li>Conscious purchasing reduces consumption-related impact</li>
              <li>Evaluating lifecycles helps make sustainable choices</li>
              <li>Minimizing waste helps conserve resources and energy</li>
            </ul>
          </div>
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
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">How often do you buy new clothes?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Frequent clothing purchases increase your fashion footprint. The average person buys 60% more clothes than 15 years ago.</p>
              </TooltipContent>
            </Tooltip>
          </div>
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
              <SelectItem value="MINIMAL">Few new items per year (Low impact)</SelectItem>
              <SelectItem value="MODERATE">Seasonal updates (Medium impact)</SelectItem>
              <SelectItem value="FREQUENT">Regular new purchases (High impact)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Timer className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">How long do you typically keep your clothes?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Extending clothing lifespan by 9 months reduces carbon, water, and waste footprints by 20-30%.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={state.clothingLifespan}
            onValueChange={(value: 'SHORT' | 'MEDIUM' | 'LONG') => 
              onUpdate({ clothingLifespan: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your typical clothing lifespan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SHORT">Less than 1 year (High impact)</SelectItem>
              <SelectItem value="MEDIUM">1-3 years (Medium impact)</SelectItem>
              <SelectItem value="LONG">More than 3 years (Low impact)</SelectItem>
            </SelectContent>
          </Select>
            </div>

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Store className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Do you prioritize buying from ethical and sustainable fashion brands?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sustainable fashion brands typically produce 50% fewer emissions and use 95% less water than fast fashion.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center justify-center">
            <YesNoToggle
              value={state.buysEthicalFashion}
              onChange={(value) => onUpdate({ buysEthicalFashion: value })}
            />
          </div>
        </div>

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Repeat className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Do you regularly buy second-hand or vintage clothing?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Buying second-hand extends clothing life cycles and can reduce your fashion footprint by up to 80%.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center justify-center">
            <YesNoToggle
              value={state.buysSecondHandClothing}
              onChange={(value) => onUpdate({ buysSecondHandClothing: value })}
            />
          </div>
        </div>

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <PackageX className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Do you avoid buying from fast fashion brands?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fast fashion produces 10% of global carbon emissions and is the second-largest consumer of water worldwide.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center justify-center">
            <YesNoToggle
              value={state.avoidsFastFashion}
              onChange={(value) => onUpdate({ avoidsFastFashion: value })}
            />
          </div>
        </div>

        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <PackageCheck className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Do you invest in high-quality, long-lasting clothing?</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quality clothing lasts 5-10 times longer than fast fashion, significantly reducing your long-term environmental impact.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center justify-center">
            <YesNoToggle
              value={state.investsInQuality}
              onChange={(value) => onUpdate({ investsInQuality: value })}
            />
          </div>
        </div>

        <div className="mt-6 bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Fashion Impact & Insights
          </h4>
          <p className="text-sm text-muted-foreground">
            The fashion industry is responsible for 10% of global carbon emissions. 
            Making sustainable fashion choices can significantly reduce your environmental impact.
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Fast fashion produces 10% of global carbon emissions</li>
              <li>Second-hand shopping reduces fashion footprint by up to 80%</li>
              <li>Sustainable brands use 95% less water than fast fashion</li>
              <li>Extending clothing life by 9 months reduces impact by 20-30%</li>
              <li>Quality items last 5-10 times longer than fast fashion</li>
            </ul>
          </div>
        </div>
      </CardContent>
      </div>
    );

  const steps = [
    { title: 'Demographics', icon: User, content: renderDemographics },
    { title: 'Home Energy', icon: Home, content: renderHomeEnergy },
    { title: 'Transportation', icon: Car, content: renderTransportationStep },
    { title: 'Food & Diet', icon: Utensils, content: renderFood },
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
      {!showResults ? (
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
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleCalculate}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  Calculate Impact
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
      </Card>
      ) : calculationResults ? (
        <ResultsDisplay
          score={calculationResults.score}
          emissions={calculationResults.emissions}
          recommendations={calculationResults.recommendations}
          categoryEmissions={calculationResults.categoryEmissions}
          isVisible={showResults}
          onReset={handleReset}
          state={state}
        />
      ) : null}
    </div>
  );
};

export default Calculator;
