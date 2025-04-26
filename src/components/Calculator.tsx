import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YesNoToggle } from '@/components/ui/yes-no-toggle';
import { cn } from '@/lib/utils';
import { 
  User,
  Home, 
  Car, 
  Utensils,
  Recycle,
  ArrowLeft, 
  ArrowRight, 
  Check,
  PackageX,
  Trash2,
  Apple,
  FileText,
  Battery,
  Shirt,
  ShoppingBag,
  Wrench,
  Info,
  ShoppingCart,
  Plane,
  LifeBuoy,
  Bus,
  Train,
  Leaf,
  MapPin,
  Sprout,
  CalendarCheck,
  Scale,
  DollarSign,
  ChefHat,
  Zap,
  Bike,
  Store,
  Timer,
  CircleDot,
  Gauge,
  Salad,
  Repeat,
  PackageCheck,
  Mail,
  Briefcase,
  Wind,
  Sun,
  Cloud,
  Droplets
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import ResultsDisplay from './ResultsDisplay';
import { Label } from '@/components/ui/label';

interface BaseCalculatorState {
  // Demographics
  name: string;
  email: string;
  age: string;
  gender: string;
  profession: string;
  location: string;
  householdSize: string;
  
  // Home Energy
  homeSize: string;
  homeEfficiency: "" | "A" | "B" | "C";
  energyManagement: "" | "A" | "B" | "C";
  electricityKwh: string;
  naturalGasTherm: string;
  heatingOilGallons: string;
  propaneGallons: string;
  usesRenewableEnergy: boolean;
  hasEnergyEfficiencyUpgrades: boolean;
  hasSmartThermostats: boolean;
  hasEnergyStarAppliances: boolean;
  
  // Transportation
  primaryTransportMode: "" | "A" | "B" | "C" | "D";
  carProfile: "" | "A" | "B" | "C" | "D" | "E";
  annualMileage: string;
  costPerMile: string;
  longDistanceTravel: "" | "A" | "B" | "C";
  
  // Food & Diet
  dietType: "VEGAN" | "VEGETARIAN" | "FLEXITARIAN" | "MEAT_MODERATE" | "MEAT_HEAVY";
  plateProfile: "" | "A" | "B" | "C";
  diningStyle: "" | "A" | "B" | "C";
  buysLocalFood: boolean;
  followsSustainableDiet: boolean;
  growsOwnFood: boolean;
  compostsFood: boolean;
  usesMealPlanning: boolean;
  plantBasedMealsPerWeek: string;
  
  // Waste
  waste: {
    wastePrevention: "" | "A" | "B" | "C" | "D";
    wasteComposition: "" | "A" | "B" | "C" | "D" | "E";
    shoppingApproach: "" | "A" | "B" | "C";
    wasteManagement: "" | "A" | "B" | "C";
    repairsItems: boolean;
    wasteLbs: string;
    recyclingPercentage: string;
    minimizesWaste: boolean;
    avoidsPlastic: boolean;
    evaluatesLifecycle: boolean;
    consciousPurchasing: string;
  };

  // Air Quality
  airQuality: {
    outdoorAirQuality: "" | "A" | "B" | "C" | "D";
    aqiMonitoring: "" | "A" | "B" | "C" | "D";
    indoorAirQuality: "" | "A" | "B" | "C" | "D";
    airQualityCommuting: "" | "A" | "B" | "C" | "D";
    airQualityImpact: "" | "A" | "B" | "C" | "D";
  };

  // Calculation Results
  calculationResults?: {
    score: number;
    emissions: number;
    categoryEmissions: {
      home: number;
      transport: number;
      food: number;
      waste: number;
    };
    recommendations: Array<{
      category: string;
      title: string;
      description: string;
      impact: string;
      difficulty: 'Easy' | 'Medium';
      completed: boolean;
    }>;
  };
}

type CalculatorState = BaseCalculatorState;

interface CalculationResults {
  score: number;
  emissions: number;
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    impact: string;
    difficulty: 'Easy' | 'Medium';
    completed: boolean;
  }>;
  categoryEmissions: {
    home: number;
    transport: number;
    food: number;
    waste: number;
  };
}

interface CalculatorProps {
  state: CalculatorState;
  onUpdate: (update: Partial<CalculatorState>) => void;
  onCalculate: () => void;
  onBack: () => void;
  onNext: () => void;
  onStepChange: (step: number) => void;
  currentStep: number;
}

const Calculator = ({
  state,
  onUpdate,
  onCalculate,
  onBack,
  onNext,
  onStepChange,
  currentStep
}: CalculatorProps): JSX.Element => {
  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleCalculate = () => {
    const totalEmissions = calculateTotalEmissions();
    const score = calculateScore();
    const categoryEmissions = {
      home: calculateHomeEmissions(),
      transport: calculateTransportEmissions(),
      food: calculateFoodEmissions(),
      waste: calculateWasteEmissions()
    };
    
    const recommendations = generateRecommendations();
    
    onUpdate({
      calculationResults: {
        score,
        emissions: totalEmissions,
        categoryEmissions,
        recommendations
      }
    });
  };

  const handleReset = () => {
    onUpdate({
      name: '',
      email: '',
      age: '',
      gender: '',
      profession: '',
      location: '',
      householdSize: '',
      homeSize: '',
      homeEfficiency: '',
      energyManagement: '',
      electricityKwh: '',
      naturalGasTherm: '',
      heatingOilGallons: '',
      propaneGallons: '',
      usesRenewableEnergy: false,
      hasEnergyEfficiencyUpgrades: false,
      hasSmartThermostats: false,
      hasEnergyStarAppliances: false,
      primaryTransportMode: '',
      carProfile: '',
      annualMileage: '',
      costPerMile: '',
      longDistanceTravel: '',
      dietType: 'MEAT_MODERATE',
      plateProfile: '',
      diningStyle: '',
      buysLocalFood: false,
      followsSustainableDiet: false,
      growsOwnFood: false,
      compostsFood: false,
      usesMealPlanning: false,
      plantBasedMealsPerWeek: '',
      waste: {
        wastePrevention: '',
        wasteComposition: '',
        shoppingApproach: '',
        wasteManagement: '',
        repairsItems: false,
        wasteLbs: '',
        recyclingPercentage: '',
        minimizesWaste: false,
        avoidsPlastic: false,
        evaluatesLifecycle: false,
        consciousPurchasing: ''
      },
      airQuality: {
        outdoorAirQuality: 'A',
        aqiMonitoring: 'A',
        indoorAirQuality: 'A',
        airQualityCommuting: 'A',
        airQualityImpact: 'A'
      }
    });
  };

  const calculateHomeEmissions = () => {
    let emissions = 0;
    
    // Base emissions from electricity
    if (state.electricityKwh) {
      emissions += parseFloat(state.electricityKwh) * 0.4; // 0.4 kg CO2e per kWh
    }
    
    // Natural gas emissions
    if (state.naturalGasTherm) {
      emissions += parseFloat(state.naturalGasTherm) * 5.3; // 5.3 kg CO2e per therm
    }
    
    // Heating oil emissions
    if (state.heatingOilGallons) {
      emissions += parseFloat(state.heatingOilGallons) * 10.2; // 10.2 kg CO2e per gallon
    }
    
    // Propane emissions
    if (state.propaneGallons) {
      emissions += parseFloat(state.propaneGallons) * 5.8; // 5.8 kg CO2e per gallon
    }
    
    // Apply efficiency factors
    if (state.homeEfficiency === "A") {
      emissions *= 0.7; // 30% reduction for high efficiency
    } else if (state.homeEfficiency === "C") {
      emissions *= 1.3; // 30% increase for low efficiency
    }
    
    // Apply energy management factors
    if (state.energyManagement === "A") {
      emissions *= 0.8; // 20% reduction for active management
    } else if (state.energyManagement === "C") {
      emissions *= 1.2; // 20% increase for minimal management
    }
    
    // Apply renewable energy factor
    if (state.usesRenewableEnergy) {
      emissions *= 0.5; // 50% reduction for renewable energy
    }
    
    // Convert to metric tons
    return emissions / 1000;
  };

  const calculateTransportEmissions = () => {
    let emissions = 0;
    
    // Base transport emissions based on primary mode
    switch (state.primaryTransportMode) {
      case "A": // Walk, bike, or public transit
        emissions += 0.5; // Minimal emissions
        break;
      case "B": // Mixed transport
        emissions += 2.0;
        break;
      case "C": // Car dependent
        emissions += 4.0;
        break;
      case "D": // Frequent flyer
        emissions += 6.0;
        break;
    }
    
    // Car-specific emissions
    if (state.annualMileage && state.costPerMile) {
      const miles = parseFloat(state.annualMileage);
      const costPerMile = parseFloat(state.costPerMile);
      if (!isNaN(miles) && !isNaN(costPerMile)) {
        emissions += miles * costPerMile * 0.4; // 0.4 kg CO2e per mile
      }
    }
    
    // Long distance travel impact
    switch (state.longDistanceTravel) {
      case "A": // Rail and bus
        emissions *= 0.8;
        break;
      case "B": // Balanced
        emissions *= 1.2;
        break;
      case "C": // Frequent flyer
        emissions *= 1.5;
        break;
    }
    
    return emissions;
  };

  const calculateFoodEmissions = () => {
    let emissions = 0;
    
    // Base diet emissions
    const dietFactors = {
      VEGAN: 1.5,
      VEGETARIAN: 2.0,
      FLEXITARIAN: 2.5,
      MEAT_MODERATE: 3.0,
      MEAT_HEAVY: 4.0
    };
    
    emissions += dietFactors[state.dietType] * 365; // Daily emissions * days
    
    // Adjust for plant-based meals
    if (state.plantBasedMealsPerWeek) {
      const plantBasedMeals = parseFloat(state.plantBasedMealsPerWeek);
      if (!isNaN(plantBasedMeals)) {
        emissions *= (1 - (plantBasedMeals / 21) * 0.3); // 30% reduction per plant-based meal
      }
    }
    
    // Apply modifiers
    if (state.buysLocalFood) emissions *= 0.9;
    if (state.growsOwnFood) emissions *= 0.95;
    if (state.compostsFood) emissions *= 0.95;
    if (state.usesMealPlanning) emissions *= 0.9;
    
    return emissions;
  };

  const calculateWasteEmissions = () => {
    let emissions = 0;
    
    // Base waste emissions
    if (state.waste.wasteLbs) {
      const wasteLbs = parseFloat(state.waste.wasteLbs);
      if (!isNaN(wasteLbs)) {
        emissions += wasteLbs * 0.5; // 0.5 kg CO2e per pound
      }
    }
    
    // Apply recycling reduction
    if (state.waste.recyclingPercentage) {
      const recyclingRate = parseFloat(state.waste.recyclingPercentage);
      if (!isNaN(recyclingRate)) {
        emissions *= (1 - (recyclingRate / 100) * 0.5); // 50% reduction for recycled materials
      }
    }
    
    // Apply waste prevention factors
    switch (state.waste.wastePrevention) {
      case "A":
        emissions *= 0.7;
        break;
      case "B":
        emissions *= 0.85;
        break;
      case "C":
        emissions *= 1.0;
        break;
      case "D":
        emissions *= 1.2;
        break;
    }
    
    // Apply additional modifiers
    if (state.waste.minimizesWaste) emissions *= 0.8;
    if (state.waste.avoidsPlastic) emissions *= 0.9;
    if (state.waste.repairsItems) emissions *= 0.95;
    
    return emissions;
  };

  const calculateTotalEmissions = () => {
    const homeEmissions = calculateHomeEmissions();
    const transportEmissions = calculateTransportEmissions();
    const foodEmissions = calculateFoodEmissions();
    const wasteEmissions = calculateWasteEmissions();
    
    return homeEmissions + transportEmissions + foodEmissions + wasteEmissions;
  };

  const calculateScore = () => {
    const totalEmissions = calculateTotalEmissions();
    const maxEmissions = 20; // Maximum expected emissions in metric tons
    
    // Calculate score (lower emissions = higher score)
    let score = 100 - (totalEmissions / maxEmissions * 100);
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    return Math.round(score);
  };

  const generateRecommendations = () => {
    const recommendations = [];
    // Add recommendations based on user's inputs
    if (state.usesRenewableEnergy === false) {
      recommendations.push({
        category: 'Home Energy',
        title: 'Switch to Renewable Energy',
        description: 'Consider switching to a renewable energy provider or installing solar panels.',
        impact: 'Could reduce your home emissions by up to 50%',
        difficulty: 'Medium',
        completed: false
      });
    }
    // Add more recommendations based on other factors
    return recommendations;
  };

  const renderResults = () => (
          <div className="animate-fade-in">
            <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary mb-2">Your Carbon Footprint Results</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Here's your personalized carbon footprint analysis and recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
        {state.calculationResults ? (
          <ResultsDisplay
            score={state.calculationResults.score}
            emissions={state.calculationResults.emissions}
            categoryEmissions={state.calculationResults.categoryEmissions}
            recommendations={state.calculationResults.recommendations}
            isVisible={true}
            onReset={handleReset}
            state={state}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Calculating your results...</p>
                  </div>
        )}
      </CardContent>
    </div>
  );

  const renderDemographics = () => (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Help Us Know You Better</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your answers will help us provide more personalized recommendations and track your eco-journey.
        </p>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label className="text-lg">Tell Us About Yourself</Label>
          <p className="text-sm text-muted-foreground">
            We'd love to get to know you! What name should we use when we chat about your eco-journey?
          </p>
          <Input
            type="text"
            placeholder="Enter your name"
            value={state.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="h-12 text-lg"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="text-lg">Stay Connected</Label>
          <p className="text-sm text-muted-foreground">
            Where can we send your personalized tips, progress updates, and eco-rewards? We respect your privacy and only use this to keep you in the loop!
          </p>
          <Input
            type="email"
            placeholder="Enter your email"
            value={state.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="h-12 text-lg"
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label className="text-lg">Your Age</Label>
          <p className="text-sm text-muted-foreground">
            How many years young are you?
          </p>
          <Input
                    type="number"
            placeholder="Enter your age"
            value={state.age}
            onChange={(e) => onUpdate({ age: e.target.value })}
            className="h-12 text-lg"
            min="1"
            max="120"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label className="text-lg">Your Identity</Label>
          <p className="text-sm text-muted-foreground">
            Which gender do you identify with? Your answer helps us understand our community better.
          </p>
          <Select
            value={state.gender}
            onValueChange={(value) => onUpdate({ gender: value })}
          >
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
                </div>

        {/* Profession */}
        <div className="space-y-2">
          <Label className="text-lg">Your Work & Lifestyle</Label>
          <p className="text-sm text-muted-foreground">
            What's your profession or what field are you studying? Your daily activities help us tailor our insights for you.
          </p>
          <Input
            type="text"
            placeholder="Enter your profession or field of study"
            value={state.profession}
            onChange={(e) => onUpdate({ profession: e.target.value })}
            className="h-12 text-lg"
          />
                  </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-lg">Your Neighborhood</Label>
          <p className="text-sm text-muted-foreground">
            Where do you call home? (City, Country) – This helps us see local trends in our eco-community.
          </p>
          <Input
            type="text"
            placeholder="Enter your location"
            value={state.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            className="h-12 text-lg"
          />
        </div>

        {/* Household Size */}
        <div className="space-y-2">
          <Label className="text-lg">Your Tribe at Home</Label>
          <p className="text-sm text-muted-foreground">
            How many people, including you, share your home? Every household is a team effort towards a better planet.
          </p>
          <Input
                    type="number"
            placeholder="Enter number of people"
            value={state.householdSize}
            onChange={(e) => onUpdate({ householdSize: e.target.value })}
            className="h-12 text-lg"
            min="1"
            max="20"
          />
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
          <h3 className="text-lg font-semibold text-primary mb-2">What's Next?</h3>
          <p className="text-muted-foreground">
            With your information, we can:
          </p>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Provide personalized eco-tips based on your lifestyle
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Track your progress and celebrate your achievements
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Connect you with local sustainability initiatives
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Help you find eco-friendly alternatives in your area
            </li>
          </ul>
                </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Your information is secure and will only be used to improve your experience.
          </p>
          <Button
            size="lg"
            className="w-full md:w-auto"
            onClick={() => {
              // Handle form submission
              alert('Thank you for completing the calculator!');
            }}
          >
            Complete & Get Started
          </Button>
        </div>
      </div>
    </div>
  );

  const renderHomeEnergy = () =>
          <div className="animate-fade-in">
      <CardHeader className="pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Home className="h-6 w-6 text-primary" />
              </div>
                <div>
            <CardTitle className="text-2xl">Your Home's Impact</CardTitle>
            <CardDescription className="text-base mt-1">
              Tell us about your home's energy profile and management.
              </CardDescription>
          </div>
        </div>
            </CardHeader>
      <CardContent className="space-y-8">
        {/* Home Size Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Home className="h-5 w-5 text-primary" />
            </div>
                <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How many bedrooms does your home have?
                    </label>
              <p className="text-muted-foreground text-sm">Whether it's cozy or spacious, every bit counts!</p>
                  </div>
          </div>
          <Select
            value={state.homeSize}
            onValueChange={(value) => onUpdate({ homeSize: value as "" | "1" | "2" | "3" | "4" | "5" | "6" | "7+" })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select number of bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4 Bedrooms</SelectItem>
              <SelectItem value="5">5 Bedrooms</SelectItem>
              <SelectItem value="6">6 Bedrooms</SelectItem>
              <SelectItem value="7+">7+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
                </div>

        {/* Home Efficiency Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Battery className="h-5 w-5 text-primary" />
            </div>
                <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Your home is your sanctuary—how would you describe its energy and sustainability efforts?
                    </label>
              <p className="text-muted-foreground text-sm">Choose the option that best describes your home's energy efficiency.</p>
                  </div>
          </div>
          <Select
            value={state.homeEfficiency}
            onValueChange={(value) => onUpdate({ homeEfficiency: value as "" | "A" | "B" | "C" })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your home's energy efficiency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Highly Efficient</div>
                  <div className="text-sm text-muted-foreground">Energy-efficient appliances and renewable solutions</div>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Moderately Efficient</div>
                  <div className="text-sm text-muted-foreground">Mindful energy use, some room for optimization</div>
                </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Basic Efficiency</div>
                  <div className="text-sm text-muted-foreground">Standard practices without eco upgrades</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
                </div>
                
        {/* Energy Management Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Zap className="h-5 w-5 text-primary" />
            </div>
                    <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How do you manage your energy use on a day-to-day basis?
                  </label>
              <p className="text-muted-foreground text-sm">Tell us about your daily energy management practices.</p>
                    </div>
                  </div>
          <Select
            value={state.energyManagement}
            onValueChange={(value) => onUpdate({ energyManagement: value as "" | "A" | "B" | "C" })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your energy management approach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Active Management</div>
                  <div className="text-sm text-muted-foreground">Smart thermostats and efficient lighting systems</div>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Basic Management</div>
                  <div className="text-sm text-muted-foreground">Occasional energy conservation measures</div>
              </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Minimal Management</div>
                  <div className="text-sm text-muted-foreground">Standard routine without special measures</div>
          </div>
              </SelectItem>
            </SelectContent>
          </Select>
                </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
                  </div>
            <div>
              <h4 className="text-lg font-medium text-blue-900 mb-2">Why this matters</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                Home energy use accounts for about 20% of the average carbon footprint in the US. 
                Making sustainable choices in your home can significantly reduce your environmental impact 
                and lead to substantial energy cost savings.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Energy-efficient homes can reduce emissions by up to 30%
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Smart energy management can save 10-15% on utility bills
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Home size directly impacts heating and cooling efficiency
                </li>
              </ul>
                </div>
          </div>
        </div>
      </CardContent>
    </div>;

  const renderTransportationStep = () =>
          <div className="animate-fade-in">
      <CardHeader className="pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Car className="h-6 w-6 text-primary" />
              </div>
                <div>
            <CardTitle className="text-2xl">Your Travel Impact</CardTitle>
            <CardDescription className="text-base mt-1">
              Tell us about your transportation habits and travel patterns.
              </CardDescription>
          </div>
        </div>
            </CardHeader>
      <CardContent className="space-y-8">
        {/* Daily Commute Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Car className="h-5 w-5 text-primary" />
            </div>
                <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Every day, your journey shapes your environmental story. Which best describes your usual mode of travel for work, school, or errands?
                  </label>
              <p className="text-muted-foreground text-sm">Your daily commute has a significant impact on your carbon footprint.</p>
            </div>
          </div>
          <Select
            value={state.primaryTransportMode}
            onValueChange={(value) => onUpdate({ primaryTransportMode: value as "" | "A" | "B" | "C" | "D" })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your primary mode of transport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Walk, Cycle, or Public Transit</div>
                  <div className="text-sm text-muted-foreground">I use sustainable transport as my primary option</div>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Mixed Transport</div>
                  <div className="text-sm text-muted-foreground">I mostly drive but sometimes share rides</div>
                </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Car Dependent</div>
                  <div className="text-sm text-muted-foreground">I rely on my personal car for most trips</div>
                </div>
              </SelectItem>
              <SelectItem value="D">
                <div className="py-1">
                  <div className="font-medium">Frequent Flyer</div>
                  <div className="text-sm text-muted-foreground">I frequently travel by air for longer journeys</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
                </div>

        {/* Long Distance Travel Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Plane className="h-5 w-5 text-primary" />
            </div>
                <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                When you head out on vacation or business trips, what's your travel style?
                    </label>
              <p className="text-muted-foreground text-sm">Your choice of long-distance travel methods affects your overall emissions.</p>
                  </div>
          </div>
          <Select
            value={state.longDistanceTravel}
            onValueChange={(value) => onUpdate({ longDistanceTravel: value as "" | "A" | "B" | "C" })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your long-distance travel style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Rail and Bus Traveler</div>
                  <div className="text-sm text-muted-foreground">I choose high-speed rail or bus travel whenever possible</div>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Balanced Traveler</div>
                  <div className="text-sm text-muted-foreground">I opt for flights occasionally but try to balance with other methods</div>
                </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Frequent Flyer</div>
                  <div className="text-sm text-muted-foreground">I often fly without considering offset options or alternatives</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
                </div>

        {/* Car Profile Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Zap className="h-5 w-5 text-primary" />
            </div>
                <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Your car is more than just wheels—it's a choice that affects your wallet and the planet. Which scenario best describes your ride?
                  </label>
              <p className="text-muted-foreground text-sm">Balance between purchase price, fuel source, and sustainability.</p>
            </div>
          </div>
          <Select
            value={state.carProfile}
            onValueChange={(value) => onUpdate({ carProfile: value as "" | "A" | "B" | "C" | "D" | "E" })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your car's green profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Solar-Powered Commuter</div>
                  <div className="text-sm text-muted-foreground">Electric vehicle charged with home solar—near-zero emissions</div>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Grid-Charged EV</div>
                  <div className="text-sm text-muted-foreground">Electric vehicle charged from the grid—emissions vary by location</div>
                </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Hybrid Economist</div>
                  <div className="text-sm text-muted-foreground">Plug-in hybrid optimizing between electricity and gasoline</div>
                </div>
              </SelectItem>
              <SelectItem value="D">
                <div className="py-1">
                  <div className="font-medium">Efficient Traditionalist</div>
                  <div className="text-sm text-muted-foreground">Modern gas/diesel car with 30+ mpg efficiency</div>
                </div>
              </SelectItem>
              <SelectItem value="E">
                <div className="py-1">
                  <div className="font-medium">Budget Driver</div>
                  <div className="text-sm text-muted-foreground">Older petrol/diesel car with higher emissions</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
                </div>

        {/* Annual Mileage Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Gauge className="h-5 w-5 text-primary" />
            </div>
                <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Let's talk distance! How many miles does your trusty vehicle cover in a year?
                    </label>
              <p className="text-muted-foreground text-sm">Include all trips: daily commutes, weekend adventures, and everything in between.</p>
                  </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Button
                variant={state.annualMileage === "5000" ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => onUpdate({ annualMileage: "5000" })}
              >
                <span className="font-medium">Light Use</span>
                <span className="text-sm text-muted-foreground">~5,000 mi</span>
              </Button>
              <Button
                variant={state.annualMileage === "12000" ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => onUpdate({ annualMileage: "12000" })}
              >
                <span className="font-medium">Average</span>
                <span className="text-sm text-muted-foreground">~12,000 mi</span>
              </Button>
              <Button
                variant={state.annualMileage === "20000" ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => onUpdate({ annualMileage: "20000" })}
              >
                <span className="font-medium">Frequent</span>
                <span className="text-sm text-muted-foreground">~20,000 mi</span>
              </Button>
              <Button
                variant={state.annualMileage === "30000" ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => onUpdate({ annualMileage: "30000" })}
              >
                <span className="font-medium">Heavy Use</span>
                <span className="text-sm text-muted-foreground">30,000+ mi</span>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">Or enter custom mileage:</div>
              <Input
                    type="number"
                placeholder="Enter annual miles"
                className="max-w-[200px]"
                value={state.annualMileage || ''}
                onChange={(e) => onUpdate({ annualMileage: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Cost Per Mile Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                What's the cost of your journey? Let's calculate your average cost per mile.
              </label>
              <p className="text-muted-foreground text-sm">Include fuel/charging costs for a complete picture.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Button
                variant={state.costPerMile === "0.10" ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => onUpdate({ costPerMile: "0.10" })}
              >
                <span className="font-medium">Electric</span>
                <span className="text-sm text-muted-foreground">~$0.10/mi</span>
              </Button>
              <Button
                variant={state.costPerMile === "0.15" ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => onUpdate({ costPerMile: "0.15" })}
              >
                <span className="font-medium">Hybrid</span>
                <span className="text-sm text-muted-foreground">~$0.15/mi</span>
              </Button>
              <Button
                variant={state.costPerMile === "0.20" ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => onUpdate({ costPerMile: "0.20" })}
              >
                <span className="font-medium">Efficient Gas</span>
                <span className="text-sm text-muted-foreground">~$0.20/mi</span>
              </Button>
              <Button
                variant={state.costPerMile === "0.25" ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => onUpdate({ costPerMile: "0.25" })}
              >
                <span className="font-medium">Standard Gas</span>
                <span className="text-sm text-muted-foreground">~$0.25/mi</span>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">Or enter custom cost per mile:</div>
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={state.costPerMile || ''}
                  onChange={(e) => onUpdate({ costPerMile: e.target.value })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">/mile</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-blue-900 mb-2">Why this matters</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                Transportation accounts for about 29% of greenhouse gas emissions in the US. 
                Your travel choices can significantly impact your carbon footprint and help create 
                a more sustainable future.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Different power sources carry unique carbon footprints
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Renewable-powered charging offers more predictable costs
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Your choices inspire community-wide sustainable transport
                </li>
              </ul>
                </div>
                </div>
              </div>
            </CardContent>
    </div>;

  const renderFood = () =>
    <div className="animate-fade-in">
      <CardHeader className="pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Utensils className="h-6 w-6 text-primary" />
          </div>
                <div>
            <CardTitle className="text-2xl">Your Food Impact</CardTitle>
            <CardDescription className="text-base mt-1">
              Tell us about your eating habits and food choices.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* The Story on Your Plate */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Salad className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Every meal tells a story about our planet. Which option best reflects your typical eating habits?
                  </label>
              <p className="text-muted-foreground text-sm">Your food choices have a significant impact on your carbon footprint.</p>
            </div>
          </div>
          <Select
            value={state.plateProfile}
            onValueChange={(value) => onUpdate({ plateProfile: value as "" | "A" | "B" | "C" })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your typical eating habits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Plant-Based Pioneer</div>
                  <div className="text-sm text-muted-foreground">I enjoy mostly plant-based meals and favor local, seasonal produce</div>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Balanced Flexitarian</div>
                  <div className="text-sm text-muted-foreground">I mix plant-based options with meat and dairy, depending on the day</div>
                </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Traditional Consumer</div>
                  <div className="text-sm text-muted-foreground">My diet is largely meat-heavy or leans toward processed choices</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
                </div>

        {/* Home-Cooked Versus Dining Out */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <ChefHat className="h-5 w-5 text-primary" />
            </div>
                <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How do you usually choose between cooking at home and dining out?
                    </label>
              <p className="text-muted-foreground text-sm">Your cooking and dining choices affect both your health and the environment.</p>
                  </div>
                </div>
          <Select
            value={state.diningStyle}
            onValueChange={(value) => onUpdate({ diningStyle: value as "" | "A" | "B" | "C" })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your dining habits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Home Chef Enthusiast</div>
                  <div className="text-sm text-muted-foreground">I rarely eat out—I love preparing home-cooked meals</div>
              </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Balanced Diner</div>
                  <div className="text-sm text-muted-foreground">I cook most days but treat myself to restaurants occasionally</div>
          </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Convenience Diner</div>
                  <div className="text-sm text-muted-foreground">I frequently dine out for convenience</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Existing Diet Type Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Apple className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                What best describes your diet type?
              </label>
              <p className="text-muted-foreground text-sm">Different diets have varying environmental impacts.</p>
            </div>
          </div>
          <Select
            value={state.dietType}
            onValueChange={(value) => onUpdate({ dietType: value as 'VEGAN' | 'VEGETARIAN' | 'FLEXITARIAN' | 'MEAT_MODERATE' | 'MEAT_HEAVY' })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VEGAN">
                <div className="py-1">
                  <div className="font-medium">Vegan</div>
                  <div className="text-sm text-muted-foreground">Plant-based only, no animal products</div>
                </div>
              </SelectItem>
              <SelectItem value="VEGETARIAN">
                <div className="py-1">
                  <div className="font-medium">Vegetarian</div>
                  <div className="text-sm text-muted-foreground">No meat, but includes dairy and eggs</div>
                </div>
              </SelectItem>
              <SelectItem value="FLEXITARIAN">
                <div className="py-1">
                  <div className="font-medium">Flexitarian</div>
                  <div className="text-sm text-muted-foreground">Mostly plant-based with occasional meat</div>
                </div>
              </SelectItem>
              <SelectItem value="MEAT_MODERATE">
                <div className="py-1">
                  <div className="font-medium">Moderate Meat Consumer</div>
                  <div className="text-sm text-muted-foreground">Regular meat consumption but in moderation</div>
                </div>
              </SelectItem>
              <SelectItem value="MEAT_HEAVY">
                <div className="py-1">
                  <div className="font-medium">Meat-Centric</div>
                  <div className="text-sm text-muted-foreground">Meat with most meals</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sustainable Practices Grid */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Which sustainable food practices do you follow?
              </label>
              <p className="text-muted-foreground text-sm">Select all that apply to your regular habits.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={state.buysLocalFood ? "default" : "outline"}
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              onClick={() => onUpdate({ buysLocalFood: !state.buysLocalFood })}
            >
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Buy Local Food</span>
            </Button>
            <Button
              variant={state.growsOwnFood ? "default" : "outline"}
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              onClick={() => onUpdate({ growsOwnFood: !state.growsOwnFood })}
            >
              <Sprout className="h-5 w-5" />
              <span className="font-medium">Grow Own Food</span>
            </Button>
            <Button
              variant={state.compostsFood ? "default" : "outline"}
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              onClick={() => onUpdate({ compostsFood: !state.compostsFood })}
            >
              <Recycle className="h-5 w-5" />
              <span className="font-medium">Compost Food Waste</span>
            </Button>
            <Button
              variant={state.usesMealPlanning ? "default" : "outline"}
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              onClick={() => onUpdate({ usesMealPlanning: !state.usesMealPlanning })}
            >
              <CalendarCheck className="h-5 w-5" />
              <span className="font-medium">Plan Meals</span>
            </Button>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-blue-900 mb-2">Why this matters</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                Food choices account for about 25% of global greenhouse gas emissions. 
                Your dietary decisions can significantly impact both your health and the planet's wellbeing.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Plant-based meals can reduce your food emissions by up to 70%
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Home cooking typically has a lower carbon footprint than dining out
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Local, seasonal food can reduce transport emissions by up to 50%
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </div>;

  const renderWaste = () => (
          <div className="animate-fade-in">
      <CardHeader className="pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Recycle className="h-6 w-6 text-primary" />
              </div>
          <div>
            <CardTitle className="text-2xl">Your Waste Impact</CardTitle>
            <CardDescription className="text-base mt-1">
              Tell us about your waste management and consumption habits.
              </CardDescription>
          </div>
        </div>
            </CardHeader>
      <CardContent className="space-y-8">
        {/* Waste Prevention Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <PackageX className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Imagine a typical day—how do you stop waste from ever reaching your bin?
              </label>
              <p className="text-muted-foreground text-sm">Preventing waste before it starts is the most effective way to reduce your environmental impact.</p>
            </div>
          </div>
          <Select
            value={state.waste.wastePrevention}
            onValueChange={(value) => onUpdate({ waste: { ...state.waste, wastePrevention: value as "" | "A" | "B" | "C" | "D" } })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your waste prevention approach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Zero Waste Champion</div>
                  <div className="text-sm text-muted-foreground">I always carry reusable bags, a water bottle, and containers—so I can refuse single-use items every time</div>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Consistent Reuser</div>
                  <div className="text-sm text-muted-foreground">I bring my reusables most days, but sometimes I grab disposables if I forget</div>
                </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Occasional Reuser</div>
                  <div className="text-sm text-muted-foreground">I occasionally use reusable items but often rely on whatever's convenient</div>
                </div>
              </SelectItem>
              <SelectItem value="D">
                <div className="py-1">
                  <div className="font-medium">Basic Disposer</div>
                  <div className="text-sm text-muted-foreground">I rarely think about reusables until I see the trash piling up</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Waste Composition Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Trash2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                We all have items that seem to appear in our trash most often—what tends to fill your bin the most?
              </label>
              <p className="text-muted-foreground text-sm">Understanding your waste composition helps identify reduction opportunities.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => onUpdate({ waste: { ...state.waste, wasteComposition: "A" } })}
                  className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                state.waste.wasteComposition === "A" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 hover:border-primary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Apple className="h-5 w-5 text-primary" />
                  </div>
                <div>
                  <h3 className="font-medium text-foreground">Food Scraps</h3>
                  <p className="text-sm text-muted-foreground mt-1">Kitchen leftovers and organic waste</p>
                </div>
              </div>
            </button>
                
            <button
              onClick={() => onUpdate({ waste: { ...state.waste, wasteComposition: "B" } })}
                  className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                state.waste.wasteComposition === "B" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 hover:border-primary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <PackageX className="h-5 w-5 text-primary" />
                  </div>
                <div>
                  <h3 className="font-medium text-foreground">Single-Use Packaging</h3>
                  <p className="text-sm text-muted-foreground mt-1">Plastic wrappers and takeout containers</p>
                </div>
              </div>
            </button>
                
            <button
              onClick={() => onUpdate({ waste: { ...state.waste, wasteComposition: "C" } })}
                  className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                state.waste.wasteComposition === "C" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 hover:border-primary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  </div>
                <div>
                  <h3 className="font-medium text-foreground">Paper & Cardboard</h3>
                  <p className="text-sm text-muted-foreground mt-1">Mail, boxes, and receipts</p>
                </div>
              </div>
            </button>
                
            <button
              onClick={() => onUpdate({ waste: { ...state.waste, wasteComposition: "D" } })}
                  className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                state.waste.wasteComposition === "D" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 hover:border-primary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Battery className="h-5 w-5 text-primary" />
                  </div>
                <div>
                  <h3 className="font-medium text-foreground">Electronics</h3>
                  <p className="text-sm text-muted-foreground mt-1">Broken devices and batteries</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onUpdate({ waste: { ...state.waste, wasteComposition: "E" } })}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                state.waste.wasteComposition === "E" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 hover:border-primary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shirt className="h-5 w-5 text-primary" />
              </div>
                <div>
                  <h3 className="font-medium text-foreground">Textiles</h3>
                  <p className="text-sm text-muted-foreground mt-1">Old garments and linens</p>
          </div>
              </div>
            </button>
          </div>
        </div>

        {/* Smart Shopping & Waste Choices */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Every purchase and disposal shapes the waste we create. Which option best describes your everyday approach?
              </label>
              <p className="text-muted-foreground text-sm">Your shopping choices significantly impact waste generation.</p>
            </div>
          </div>
          <Select
            value={state.waste.shoppingApproach}
            onValueChange={(value) => onUpdate({ waste: { ...state.waste, shoppingApproach: value as "" | "A" | "B" | "C" } })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your shopping approach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Conscious Consumer</div>
                  <div className="text-sm text-muted-foreground">I always opt for reusable products, consciously avoiding single-use items and packaging</div>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Balanced Shopper</div>
                  <div className="text-sm text-muted-foreground">I try to choose eco-friendly products, though sometimes convenience prevails</div>
                </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Convenience Shopper</div>
                  <div className="text-sm text-muted-foreground">I rarely consider the waste factor—I usually buy what's readily available</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Daily Trash Management */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <Trash2 className="h-5 w-5 text-primary" />
              </div>
              <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Think about how you manage your everyday waste—what best reflects your habits?
                  </label>
              <p className="text-muted-foreground text-sm">Proper waste management can significantly reduce your environmental impact.</p>
                </div>
          </div>
          <Select
            value={state.waste.wasteManagement}
            onValueChange={(value) => onUpdate({ waste: { ...state.waste, wasteManagement: value as "" | "A" | "B" | "C" } })}
          >
            <SelectTrigger className="w-full bg-background border-2 h-12">
              <SelectValue placeholder="Select your waste management approach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">
                <div className="py-1">
                  <div className="font-medium">Dedicated Recycler</div>
                  <div className="text-sm text-muted-foreground">I carefully sort, recycle, and even repurpose items to keep waste to a minimum</div>
                </div>
              </SelectItem>
              <SelectItem value="B">
                <div className="py-1">
                  <div className="font-medium">Casual Recycler</div>
                  <div className="text-sm text-muted-foreground">I recycle when possible, but I might not always sort everything correctly</div>
                </div>
              </SelectItem>
              <SelectItem value="C">
                <div className="py-1">
                  <div className="font-medium">Basic Disposer</div>
                  <div className="text-sm text-muted-foreground">I typically dispose of everything in the same bin, without much thought for separation</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
              </div>

        {/* Repair or Replace Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
              <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                When something breaks, do you try to repair it instead of replacing it right away?
                </label>
              <p className="text-muted-foreground text-sm">Repairing items can significantly reduce waste and resource consumption.</p>
            </div>
          </div>
          <div className="flex justify-center">
            <YesNoToggle
              value={state.waste.repairsItems}
              onChange={(value) => onUpdate({ waste: { ...state.waste, repairsItems: value } })}
              className="w-full max-w-md"
            />
                </div>
              </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-blue-900 mb-2">Why this matters</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                Waste management is crucial for reducing environmental impact. The average person generates about 4.5 pounds of waste per day, 
                but conscious choices can significantly reduce this amount.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Recycling can reduce waste-related emissions by up to 50%
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Repairing items instead of replacing them can save significant resources
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Conscious shopping choices can reduce packaging waste by up to 70%
                </li>
              </ul>
            </div>
          </div>
              </div>
            </CardContent>
          </div>
        );

  const renderAirQuality = () => (
    <div className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary mb-2">Air Quality Impact</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Understanding your relationship with air quality helps us assess your environmental awareness and habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Outdoor Air Quality */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Wind className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Breath of Fresh Air?</h3>
          </div>
          <p className="text-muted-foreground">
            Imagine stepping outside into your neighborhood. How would you describe the quality of the air you breathe?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: "A", label: "It feels crisp, clean, and refreshing—like a breath of pure air", icon: Wind },
              { value: "B", label: "It's generally clear, though I notice a little haze on busy days", icon: Sun },
              { value: "C", label: "It's often a bit smoggy or polluted, especially during rush hours", icon: Cloud },
              { value: "D", label: "I'm not sure—I rarely pay attention to the air quality", icon: Info }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdate({ airQuality: { ...state.airQuality, outdoorAirQuality: option.value as "A" | "B" | "C" | "D" } })}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all duration-200 text-left flex items-start gap-4",
                  state.airQuality.outdoorAirQuality === option.value
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50"
                )}
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{option.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AQI Monitoring */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Sun className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Keeping an Eye on the Air</h3>
          </div>
          <p className="text-muted-foreground">
            Do you check the Air Quality Index (AQI) in your area to plan your day or outdoor activities?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: "A", label: "Yes, I check it daily to make the best choices for my health", icon: CalendarCheck },
              { value: "B", label: "Sometimes, especially when I'm planning something outdoors", icon: Timer },
              { value: "C", label: "Rarely—I know it's there, but I don't usually look it up", icon: CircleDot },
              { value: "D", label: "Not at all—I haven't really thought about it", icon: Info }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdate({ airQuality: { ...state.airQuality, aqiMonitoring: option.value as "A" | "B" | "C" | "D" } })}
              className={cn(
                  "p-6 rounded-xl border-2 transition-all duration-200 text-left flex items-start gap-4",
                  state.airQuality.aqiMonitoring === option.value
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50"
                )}
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{option.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Indoor Air Quality */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Cloud className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Home Oasis: Indoor Air Quality</h3>
          </div>
          <p className="text-muted-foreground">
            How do you manage the air inside your home to keep it as fresh as possible?
          </p>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Basic</span>
              <span className="text-sm text-muted-foreground">Advanced</span>
            </div>
            <div className="relative h-12">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1 w-full bg-muted rounded-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-2">
                {[
                  { value: "D", icon: Info, label: "Not sure" },
                  { value: "C", icon: Cloud, label: "No special steps" },
                  { value: "B", icon: Wind, label: "Open windows" },
                  { value: "A", icon: Leaf, label: "Air purifiers & plants" }
                ].map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => onUpdate({ airQuality: { ...state.airQuality, indoorAirQuality: option.value as "A" | "B" | "C" | "D" } })}
                    className={cn(
                      "relative z-10 flex flex-col items-center gap-1 transition-all duration-200",
                      state.airQuality.indoorAirQuality === option.value
                        ? "scale-110"
                        : "hover:scale-105"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-full transition-all duration-200",
                      state.airQuality.indoorAirQuality === option.value
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary"
                    )}>
                      <option.icon className="h-5 w-5" />
            </div>
                    <span className={cn(
                      "text-xs font-medium transition-all duration-200",
                      state.airQuality.indoorAirQuality === option.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
              <div 
                className="absolute h-1 bg-primary/20 transition-all duration-300"
                style={{ 
                  left: state.airQuality.indoorAirQuality ? 
                    (state.airQuality.indoorAirQuality === "A" ? "75%" : 
                     state.airQuality.indoorAirQuality === "B" ? "50%" : 
                     state.airQuality.indoorAirQuality === "C" ? "25%" : "0%") : "0%",
                  width: state.airQuality.indoorAirQuality ? 
                    (state.airQuality.indoorAirQuality === "A" ? "25%" : 
                     state.airQuality.indoorAirQuality === "B" ? "25%" : 
                     state.airQuality.indoorAirQuality === "C" ? "25%" : "25%") : "0%"
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {state.airQuality.indoorAirQuality === "A" ? "You actively maintain excellent indoor air quality with purifiers and plants" :
                 state.airQuality.indoorAirQuality === "B" ? "You take basic steps to improve indoor air quality" :
                 state.airQuality.indoorAirQuality === "C" ? "You haven't taken specific steps for indoor air quality" :
                 "You haven't considered indoor air quality management"}
              </p>
            </div>
          </div>
        </div>

        {/* Air Quality Commuting */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Droplets className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Smart Commuter Choices</h3>
          </div>
          <p className="text-muted-foreground">
            While commuting or running errands, do you make an effort to avoid times or areas with particularly poor air quality?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: "A", label: "Absolutely—I plan my trips to steer clear of heavy traffic and high-pollution areas", icon: MapPin },
              { value: "B", label: "Sometimes, I adjust my schedule or route if I know the air is bad", icon: Timer },
              { value: "C", label: "I don't consider air quality when I'm out and about", icon: Car },
              { value: "D", label: "I haven't thought about it much", icon: Info }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdate({ airQuality: { ...state.airQuality, airQualityCommuting: option.value as "A" | "B" | "C" | "D" } })}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all duration-200 text-left flex items-start gap-4",
                  state.airQuality.airQualityCommuting === option.value
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50"
                )}
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{option.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Air Quality Impact */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Leaf className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Noticing the Difference</h3>
          </div>
          <p className="text-muted-foreground">
            Have you ever felt that changes in air quality affect your mood or energy levels?
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Low Awareness</span>
              <span>High Awareness</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute inset-0 bg-primary/20"
                style={{ width: state.airQuality.airQualityImpact ? 
                  (state.airQuality.airQualityImpact === "A" ? "100%" : 
                   state.airQuality.airQualityImpact === "B" ? "75%" : 
                   state.airQuality.airQualityImpact === "C" ? "50%" : "25%") : "0%" 
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[
                { value: "A", label: "Definitely affects me", icon: Zap, description: "Feel more energetic on clear days" },
                { value: "B", label: "Sometimes notice", icon: Gauge, description: "Notice on really bad days" },
                { value: "C", label: "Rarely notice", icon: CircleDot, description: "Haven't connected it" },
                { value: "D", label: "Never thought about it", icon: Info, description: "Just go with the flow" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onUpdate({ airQuality: { ...state.airQuality, airQualityImpact: option.value as "A" | "B" | "C" | "D" } })}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                    state.airQuality.airQualityImpact === option.value
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <option.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      </div>
    );

  const steps = [
    { title: 'Home Energy', icon: Home, content: renderHomeEnergy },
    { title: 'Transportation', icon: Car, content: renderTransportationStep },
    { title: 'Food & Diet', icon: Utensils, content: renderFood },
    { title: 'Waste', icon: Recycle, content: renderWaste },
    { title: 'Air Quality', icon: Leaf, content: renderAirQuality },
    { title: 'Results', icon: PackageCheck, content: renderResults },
    { title: 'Demographics', icon: User, content: renderDemographics },
  ];

  const CurrentStepIcon = steps[currentStep].icon;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderHomeEnergy();
      case 1:
        return renderTransportationStep();
      case 2:
        return renderFood();
      case 3:
        return renderWaste();
      case 4:
        return renderAirQuality();
      case 5:
        return renderResults();
      case 6:
        return renderDemographics();
      default:
        return renderHomeEnergy();
    }
  };

  const handleNext = () => {
    if (currentStep === 4) { // Air Quality step
      handleCalculate();
      onStepChange(5); // Go to results
    } else if (currentStep === 5) { // Results step
      onStepChange(6); // Go to demographics
    } else {
      onNext();
    }
  };

  return (
    <div 
      id="calculator" 
      className={cn(
        "w-full max-w-3xl mx-auto transition-opacity duration-500 py-10",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {!showResults ? (
        <Card variant="elevated">
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

            {renderStep()}

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
                <Button 
                  onClick={handleCalculate}
                  className="bg-primary hover:bg-primary/90"
                >
                  Calculate Impact
                  <Check className="ml-2 h-4 w-4" />
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
