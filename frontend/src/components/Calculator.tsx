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
import { QuestionTiles } from './QuestionTiles';
import { AgeTiles } from '@/components/AgeTiles';
import { Country, State, City } from 'country-state-city';

interface BaseCalculatorState {
  // Demographics
  name: string;
  email: string;
  age: string;
  gender: string;
  profession: string;
  location: string;
  country: string;
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

  // Clothing
  clothing?: {
    wardrobeImpact: string;
    mindfulUpgrades: string;
    durability: string;
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

  // 1. Define default objects for nested state
  const defaultWaste = {
    wastePrevention: '' as '' | 'A' | 'B' | 'C' | 'D',
    wasteComposition: '' as '' | 'A' | 'B' | 'C' | 'D' | 'E',
    shoppingApproach: '' as '' | 'A' | 'B' | 'C',
    wasteManagement: '' as '' | 'A' | 'B' | 'C',
    repairsItems: false,
    wasteLbs: '',
    recyclingPercentage: '',
    minimizesWaste: false,
    avoidsPlastic: false,
    evaluatesLifecycle: false,
    consciousPurchasing: ''
  };
  const defaultAirQuality = {
    outdoorAirQuality: '' as '' | 'A' | 'B' | 'C' | 'D',
    aqiMonitoring: '' as '' | 'A' | 'B' | 'C' | 'D',
    indoorAirQuality: '' as '' | 'A' | 'B' | 'C' | 'D',
    airQualityCommuting: '' as '' | 'A' | 'B' | 'C' | 'D',
    airQualityImpact: '' as '' | 'A' | 'B' | 'C' | 'D',
  };
  const defaultClothing = {
    wardrobeImpact: '',
    mindfulUpgrades: '',
    durability: ''
  };

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
    
    const payload = {
      calculationResults: {
        score,
        emissions: totalEmissions,
        categoryEmissions,
        recommendations: recommendations.map(r => ({
          ...r,
          difficulty: r.difficulty === 'Easy' || r.difficulty === 'Medium' ? r.difficulty : 'Medium'
        }))
      }
    };
    console.log('Payload sent to onUpdate in handleCalculate:', payload);
    onUpdate(payload);
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
      waste: { ...defaultWaste },
      airQuality: { ...defaultAirQuality },
      clothing: { ...defaultClothing },
      calculationResults: undefined
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
          <AgeTiles
            value={state.age}
            onChange={(value) => onUpdate({ age: value })}
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
          <Select
            value={state.profession}
            onValueChange={(value) => onUpdate({ profession: value })}
          >
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Select your profession" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  type="search"
                  placeholder="Search professions..."
                  className="h-9 mb-2"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const items = document.querySelectorAll('[role="option"]');
                    items.forEach(item => {
                      const text = item.textContent?.toLowerCase() || '';
                      if (text.includes(searchTerm)) {
                        item.removeAttribute('hidden');
                      } else {
                        item.setAttribute('hidden', '');
                      }
                    });
                  }}
                />
              </div>
              <SelectItem value="student">Student (School / College / University)</SelectItem>
              <SelectItem value="education">Education (Teacher, Lecturer, Academic)</SelectItem>
              <SelectItem value="business">Business & Management</SelectItem>
              <SelectItem value="engineering">Engineering & Technology</SelectItem>
              <SelectItem value="health">Health & Medicine</SelectItem>
              <SelectItem value="science">Science & Research</SelectItem>
              <SelectItem value="law">Law & Policy</SelectItem>
              <SelectItem value="environment">Environment & Sustainability</SelectItem>
              <SelectItem value="arts">Arts, Design & Creative Fields</SelectItem>
              <SelectItem value="media">Media & Communications</SelectItem>
              <SelectItem value="social">Social Sciences & Humanities</SelectItem>
              <SelectItem value="it">IT & Software Development</SelectItem>
              <SelectItem value="government">Government & Public Sector</SelectItem>
              <SelectItem value="hospitality">Hospitality, Travel & Tourism</SelectItem>
              <SelectItem value="trades">Skilled Trades (e.g., Electrician, Plumber, Mechanic)</SelectItem>
              <SelectItem value="retail">Retail, Sales & Customer Service</SelectItem>
              <SelectItem value="logistics">Logistics, Transport & Delivery</SelectItem>
              <SelectItem value="caregiving">Home & Caregiving (e.g., Stay-at-home parent, Care worker)</SelectItem>
              <SelectItem value="unemployed">Currently Unemployed or Exploring Options</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer Not to Say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-lg">Your Neighborhood</Label>
          <p className="text-sm text-muted-foreground">
            Where do you call home? This helps us connect you with local sustainability initiatives.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground mb-2">Country</Label>
              <Select
                value={state.country}
                onValueChange={(value) => {
                  onUpdate({ country: value, location: '' }); // Reset city when country changes
                }}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      type="search"
                      placeholder="Search countries..."
                      className="h-9 mb-2"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const items = document.querySelectorAll('[role="option"]');
                        items.forEach(item => {
                          const text = item.textContent?.toLowerCase() || '';
                          if (text.includes(searchTerm)) {
                            item.removeAttribute('hidden');
                          } else {
                            item.setAttribute('hidden', '');
                          }
                        });
                      }}
                    />
                  </div>
                  {Country.getAllCountries().map((country) => (
                    <SelectItem key={country.isoCode} value={country.isoCode}>
                      {country.flag} {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground mb-2">City</Label>
              <Select
                value={state.location}
                onValueChange={(value) => onUpdate({ location: value })}
                disabled={!state.country}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder={state.country ? "Select your city" : "Select a country first"} />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      type="search"
                      placeholder="Search cities..."
                      className="h-9 mb-2"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const items = document.querySelectorAll('[role="option"]');
                        items.forEach(item => {
                          const text = item.textContent?.toLowerCase() || '';
                          if (text.includes(searchTerm)) {
                            item.removeAttribute('hidden');
                          } else {
                            item.setAttribute('hidden', '');
                          }
                        });
                      }}
                    />
                  </div>
                  {state.country && City.getCitiesOfCountry(state.country)?.map((city) => (
                    <SelectItem key={`${city.name}-${city.stateCode}`} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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

  const renderHomeEnergy = () => (
    <div className="animate-fade-in">
      <CardHeader className="pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Your Home Energy Impact</CardTitle>
            <CardDescription className="text-base mt-1">
              Tell us about your home energy usage and efficiency.
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
              <p className="text-muted-foreground text-sm">This helps us estimate your energy usage more accurately.</p>
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
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How energy efficient is your home?
              </label>
              <p className="text-muted-foreground text-sm">Consider your appliances, lighting, and overall energy management.</p>
            </div>
          </div>
          <QuestionTiles
            category="homeEnergy"
            subCategory="efficiency"
            value={state.homeEfficiency}
            onChange={(value) => onUpdate({ homeEfficiency: value as "" | "A" | "B" | "C" })}
          />
        </div>

        {/* Energy Management Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Wind className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How do you manage your energy sources?
              </label>
              <p className="text-muted-foreground text-sm">Tell us about your energy sources and management practices.</p>
            </div>
          </div>
          <QuestionTiles
            category="homeEnergy"
            subCategory="management"
            value={state.energyManagement}
            onChange={(value) => onUpdate({ energyManagement: value as "" | "A" | "B" | "C" })}
          />
        </div>
      </CardContent>
    </div>
  );

  const renderTransportationStep = () => (
    <div className="animate-fade-in">
      <CardHeader className="pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Your Transportation Impact</CardTitle>
            <CardDescription className="text-base mt-1">
              Tell us about your daily commute and travel habits.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Primary Transport Mode Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Bus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                What's your primary mode of transportation?
              </label>
              <p className="text-muted-foreground text-sm">Tell us how you usually get around.</p>
            </div>
          </div>
          <QuestionTiles
            category="transport"
            subCategory="primary"
            value={state.primaryTransportMode}
            onChange={(value) => onUpdate({ primaryTransportMode: value as "" | "A" | "B" | "C" | "D" })}
          />
        </div>

        {/* Car Profile Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                What's your car profile?
              </label>
              <p className="text-muted-foreground text-sm">Tell us about your vehicle and its efficiency.</p>
            </div>
          </div>
          <QuestionTiles
            category="transport"
            subCategory="carProfile"
            value={state.carProfile}
            onChange={(value) => onUpdate({ carProfile: value as "" | "A" | "B" | "C" | "D" | "E" })}
          />
        </div>

        {/* Annual Mileage Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How many miles do you drive annually?
              </label>
              <p className="text-muted-foreground text-sm">This helps us calculate your transportation emissions.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={state.annualMileage === "5000" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-1"
              onClick={() => onUpdate({ annualMileage: "5000" })}
            >
              <span className="font-medium">Light</span>
              <span className="text-sm text-muted-foreground">~5,000 mi</span>
            </Button>
            <Button
              variant={state.annualMileage === "10000" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-1"
              onClick={() => onUpdate({ annualMileage: "10000" })}
            >
              <span className="font-medium">Moderate</span>
              <span className="text-sm text-muted-foreground">~10,000 mi</span>
            </Button>
            <Button
              variant={state.annualMileage === "15000" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-1"
              onClick={() => onUpdate({ annualMileage: "15000" })}
            >
              <span className="font-medium">Regular</span>
              <span className="text-sm text-muted-foreground">~15,000 mi</span>
            </Button>
            <Button
              variant={state.annualMileage === "20000" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-1"
              onClick={() => onUpdate({ annualMileage: "20000" })}
            >
              <span className="font-medium">Frequent</span>
              <span className="text-sm text-muted-foreground">~20,000 mi</span>
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4">
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
      </CardContent>
    </div>
  );

  const renderFood = () => (
    <div className="animate-fade-in">
      <CardHeader className="pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Utensils className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Your Food Impact</CardTitle>
            <CardDescription className="text-base mt-1">
              Tell us about your dietary choices and food habits.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Diet Type Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Apple className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                What's your diet type?
              </label>
              <p className="text-muted-foreground text-sm">Your dietary choices have a significant impact on your carbon footprint.</p>
            </div>
          </div>
          <QuestionTiles
            category="food"
            subCategory="diet"
            value={state.dietType}
            onChange={(value) => onUpdate({ dietType: value as "VEGAN" | "VEGETARIAN" | "FLEXITARIAN" | "MEAT_MODERATE" | "MEAT_HEAVY" })}
          />
        </div>

        {/* Plate Profile Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How do you source your food?
              </label>
              <p className="text-muted-foreground text-sm">Tell us about your food sourcing and preparation habits.</p>
            </div>
          </div>
          <QuestionTiles
            category="food"
            subCategory="plateProfile"
            value={state.plateProfile}
            onChange={(value) => onUpdate({ plateProfile: value as "" | "A" | "B" | "C" })}
          />
        </div>

        {/* Dining Style Question (NEW) */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Utensils className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How do you usually choose between cooking at home and dining out?
              </label>
              <p className="text-muted-foreground text-sm">
                Tell us about your typical meal preparation and dining habits.
              </p>
            </div>
          </div>
          <QuestionTiles
            category="food"
            subCategory="localvsseasonal"
            value={state.diningStyle}
            onChange={(value) => onUpdate({ diningStyle: value as "" | "A" | "B" | "C" })}
          />
        </div>
      </CardContent>
    </div>
  );

  const renderClothing = () => (
    <div className="animate-fade-in">
      <CardHeader className="pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Clothes & Fashion</CardTitle>
            <CardDescription className="text-base mt-1">
              Tell us about your clothing and fashion habits.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Wardrobe Impact */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How do you approach shopping for clothes?
              </label>
              <p className="text-muted-foreground text-sm">Your shopping habits can have a big impact on sustainability.</p>
            </div>
          </div>
          <QuestionTiles
            category="clothing"
            subCategory="wardrobeImpact"
            value={state.clothing?.wardrobeImpact || ''}
            onChange={(value) => onUpdate({
              clothing: {
                ...defaultClothing,
                ...(state.clothing ?? {}),
                wardrobeImpact: value,
              },
            })}
          />
        </div>
        {/* Mindful Upgrades */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <PackageCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                When you upgrade your wardrobe, what do you consider?
              </label>
              <p className="text-muted-foreground text-sm">Thinking about durability and environmental impact is key.</p>
            </div>
          </div>
          <QuestionTiles
            category="clothing"
            subCategory="mindfulUpgrades"
            value={state.clothing?.mindfulUpgrades || ''}
            onChange={(value) => onUpdate({
              clothing: {
                wardrobeImpact: state.clothing?.wardrobeImpact ?? '',
                mindfulUpgrades: value,
                durability: state.clothing?.durability ?? '',
              },
            })}
          />
        </div>
        {/* Durability */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Timer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How long do your clothes typically last?
              </label>
              <p className="text-muted-foreground text-sm">Durability is a sign of mindful fashion choices.</p>
            </div>
          </div>
          <QuestionTiles
            category="clothing"
            subCategory="durability"
            value={state.clothing?.durability || ''}
            onChange={(value) => onUpdate({
              clothing: {
                wardrobeImpact: state.clothing?.wardrobeImpact ?? '',
                mindfulUpgrades: state.clothing?.mindfulUpgrades ?? '',
                durability: value,
              },
            })}
          />
        </div>
      </CardContent>
    </div>
  );

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
          <QuestionTiles
            category="waste"
            subCategory="prevention"
            value={state.waste.wastePrevention}
            onChange={(value) => onUpdate({ waste: { ...state.waste, wastePrevention: value as "" | "A" | "B" | "C" | "D" } })}
          />
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
          <QuestionTiles
            category="waste"
            subCategory="wasteComposition"
            value={state.waste.wasteComposition}
            onChange={(value) => onUpdate({ waste: { ...state.waste, wasteComposition: value as "" | "A" | "B" | "C" | "D" | "E" } })}
          />
        </div>
        {/* Shopping Approach Question */}
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
          <QuestionTiles
            category="waste"
            subCategory="shopping"
            value={state.waste.shoppingApproach}
            onChange={(value) => onUpdate({ waste: { ...state.waste, shoppingApproach: value as "" | "A" | "B" | "C" } })}
          />
        </div>
        {/* Waste Management Question */}
        <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-colors">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Recycle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                Think about how you manage your everyday waste—what best reflects your habits?
              </label>
              <p className="text-muted-foreground text-sm">Proper waste management can significantly reduce your environmental impact.</p>
            </div>
          </div>
          <QuestionTiles
            category="waste"
            subCategory="wasteManagement"
            value={state.waste.wasteManagement}
            onChange={(value) => onUpdate({ waste: { ...state.waste, wasteManagement: value as "" | "A" | "B" | "C" } })}
          />
        </div>
        {/* Repairs Items Question */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 rounded-full p-3 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-semibold text-gray-900">
                When something breaks, do you try to repair it instead of replacing it right away?
              </div>
              <div className="text-gray-500 text-sm mt-1">
                Repairing items can significantly reduce waste and resource consumption.
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <YesNoToggle
              value={state.waste.repairsItems}
              onChange={(value) => onUpdate({ waste: { ...state.waste, repairsItems: value } })}
              className="w-full max-w-md"
            />
          </div>
        </div>
        {/* Evaluates Lifecycle Question */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 rounded-full p-3 flex items-center justify-center">
              <Info className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-semibold text-gray-900">
                Do you consider the lifecycle of products before buying?
              </div>
              <div className="text-gray-500 text-sm mt-1">
                Thinking about what happens to an item after use is key to sustainability.
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <YesNoToggle
              value={state.waste.evaluatesLifecycle}
              onChange={(value) => onUpdate({ waste: { ...state.waste, evaluatesLifecycle: value } })}
              className="w-full max-w-md"
            />
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
          <QuestionTiles
            category="airQuality"
            subCategory="outdoorQuality"
            value={state.airQuality.outdoorAirQuality}
            onChange={(value) => onUpdate({ airQuality: { ...state.airQuality, outdoorAirQuality: value as "" | "A" | "B" | "C" | "D" } })}
          />
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
          <QuestionTiles
            category="airQuality"
            subCategory="monitoring"
            value={state.airQuality.aqiMonitoring}
            onChange={(value) => onUpdate({ airQuality: { ...state.airQuality, aqiMonitoring: value as "" | "A" | "B" | "C" | "D" } })}
          />
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
          <QuestionTiles
            category="airQuality"
            subCategory="indoorQuality"
            value={state.airQuality.indoorAirQuality}
            onChange={(value) => onUpdate({ airQuality: { ...state.airQuality, indoorAirQuality: value as "" | "A" | "B" | "C" | "D" } })}
          />
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
          <QuestionTiles
            category="airQuality"
            subCategory="commuting"
            value={state.airQuality.airQualityCommuting}
            onChange={(value) => onUpdate({ airQuality: { ...state.airQuality, airQualityCommuting: value as "" | "A" | "B" | "C" | "D" } })}
          />
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
          <QuestionTiles
            category="airQuality"
            subCategory="impact"
            value={state.airQuality.airQualityImpact}
            onChange={(value) => onUpdate({ airQuality: { ...state.airQuality, airQualityImpact: value as "" | "A" | "B" | "C" | "D" } })}
          />
        </div>
      </CardContent>
    </div>
  );

  const steps = [
    { title: 'Home Energy', icon: Home, content: renderHomeEnergy },
    { title: 'Transportation', icon: Car, content: renderTransportationStep },
    { title: 'Food & Diet', icon: Utensils, content: renderFood },
    { title: 'Clothes & Fashion', icon: ShoppingBag, content: renderClothing },
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
        return renderClothing();
      case 4:
        return renderWaste();
      case 5:
        return renderAirQuality();
      case 6:
        return renderResults();
      case 7:
        return renderDemographics();
      default:
        return renderHomeEnergy();
    }
  };

  const handleNext = () => {
    if (currentStep === 5) { // Air Quality step (now index 5)
      handleCalculate();
      onStepChange(6); // Go to results
    } else if (currentStep === 6) { // Results step
      onStepChange(7); // Go to demographics
    } else {
      onNext();
    }
  };

  return (
    <div 
      id="calculator" 
      className={cn(
        "w-max mx-auto transition-opacity duration-500 py-10",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {!showResults ? (
        <Card variant="elevated">
          <CardContent className="p-6 w-max" >
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
