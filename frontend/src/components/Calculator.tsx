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

// Section color mapping for Calculator steps
const sectionColors = [
  'zerrah-red',      // Home
  'zerrah-orange',   // Transport
  'zerrah-yellow',   // Food
  'zerrah-lightgreen', // Clothing
  'zerrah-green',    // Waste
  'zerrah-blue',     // Air Quality
  'zerrah-deepgreen',// Results
  'zerrah-deepblue', // Demographics
];

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
  weeklyKm: string;
  costPerMile: string;
  longDistanceTravel: "" | "A" | "B" | "C";
  
  // Food & Diet
  dietType: "" | "VEGAN" | "VEGETARIAN" | "FLEXITARIAN" | "MEAT_MODERATE" | "MEAT_HEAVY";
  plateProfile: "" | "A" | "B" | "C";
  monthlyDiningOut: "" | "A" | "B" | "C" | "D";
  plantBasedMealsPerWeek: string;
  
  // Waste
  waste: {
    prevention: "" | "A" | "B" | "C" | "D";
    smartShopping: "" | "A" | "B" | "C";
    dailyWaste: "" | "A" | "B" | "C" | "D";
    management: "" | "A" | "B" | "C";
    repairOrReplace: "" | "A" | "B" | "C";
  };

  // Air Quality
  airQuality: {
    outdoorAirQuality: "" | "A" | "B" | "C" | "D" | "E";
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
    consumptionFrequency: string;
    brandLoyalty: string;
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
    prevention: '' as '' | 'A' | 'B' | 'C' | 'D',
    smartShopping: '' as '' | 'A' | 'B' | 'C',
    dailyWaste: '' as '' | 'A' | 'B' | 'C' | 'D',
    management: '' as '' | 'A' | 'B' | 'C',
    repairOrReplace: '' as '' | 'A' | 'B' | 'C',
  };
  const defaultAirQuality = {
    outdoorAirQuality: '' as '' | 'A' | 'B' | 'C' | 'D' | 'E',
    aqiMonitoring: '' as '' | 'A' | 'B' | 'C' | 'D',
    indoorAirQuality: '' as '' | 'A' | 'B' | 'C' | 'D',
    airQualityCommuting: '' as '' | 'A' | 'B' | 'C' | 'D',
    airQualityImpact: '' as '' | 'A' | 'B' | 'C' | 'D',
  };
  const defaultClothing = {
    wardrobeImpact: '',
    mindfulUpgrades: '',
    durability: '',
    consumptionFrequency: '',
    brandLoyalty: '',
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
          difficulty: r.difficulty === 'Easy' || r.difficulty === 'Medium' ? r.difficulty : 'Medium' as 'Easy' | 'Medium'
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
      weeklyKm: '',
      costPerMile: '',
      longDistanceTravel: '',
      dietType: '',
      plateProfile: '',
      monthlyDiningOut: '',
      plantBasedMealsPerWeek: '',
      waste: { 
        ...defaultWaste,
        repairOrReplace: ''
      },
      airQuality: { 
        ...defaultAirQuality,
        outdoorAirQuality: ''
      },
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
    
    // Car-specific emissions - convert weekly km to annual miles for calculation
    if (state.weeklyKm && state.costPerMile) {
      const weeklyKm = parseFloat(state.weeklyKm);
      const costPerMile = parseFloat(state.costPerMile);
      if (!isNaN(weeklyKm) && !isNaN(costPerMile)) {
        const annualMiles = (weeklyKm * 52) / 1.60934; // Convert weekly km to annual miles
        emissions += annualMiles * costPerMile * 0.4; // 0.4 kg CO2e per mile
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
      MEAT_HEAVY: 4.5 // Updated for heavy meat consumption
    };
    if (!state.dietType || !(state.dietType in dietFactors)) {
      return 0;
    }
    emissions += dietFactors[state.dietType as keyof typeof dietFactors] * 365; // Daily emissions * days
    // Adjust for plant-based meals
    if (state.plantBasedMealsPerWeek) {
      const plantBasedMeals = parseFloat(state.plantBasedMealsPerWeek);
      if (!isNaN(plantBasedMeals)) {
        emissions *= (1 - (plantBasedMeals / 21) * 0.3); // 30% reduction per plant-based meal
      }
    }
    // Adjust for dining out frequency
    switch (state.monthlyDiningOut) {
      case "A": // <1 a month
        emissions *= 0.95;
        break;
      case "B": // 1-4 times a month
        emissions *= 1.0;
        break;
      case "C": // 5-10 times a month
        emissions *= 1.1;
        break;
      case "D": // >10 times a month
        emissions *= 1.2;
        break;
    }
    return emissions;
  };

  const calculateWasteEmissions = () => {
    let emissions = 0;
    
    // Base waste emissions
    if (state.waste.dailyWaste) {
      const dailyWaste = parseFloat(state.waste.dailyWaste);
      if (!isNaN(dailyWaste)) {
        emissions += dailyWaste * 0.5; // 0.5 kg CO2e per pound
      }
    }
    
    // Apply recycling reduction
    if (state.waste.smartShopping) {
      const shoppingRate = parseFloat(state.waste.smartShopping);
      if (!isNaN(shoppingRate)) {
        emissions *= (1 - (shoppingRate / 100) * 0.5); // 50% reduction for recycled materials
      }
    }
    
    // Apply waste prevention factors
    switch (state.waste.prevention) {
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
    
    // Apply repair/replace factors
    switch (state.waste.repairOrReplace) {
      case "A": // Always repair
        emissions *= 0.9;
        break;
      case "B": // Sometimes repair
        emissions *= 0.95;
        break;
      case "C": // Usually replace
        emissions *= 1.0;
        break;
    }
    
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
            gender={state.gender === 'female' ? 'girl' : 'boy'}
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
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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

        {/* Weekly Kilometers Question - Updated */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How many kilometers do you drive weekly?
              </label>
              <p className="text-muted-foreground text-sm">This helps us calculate your transportation emissions.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={state.weeklyKm === "50" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-1"
              onClick={() => onUpdate({ weeklyKm: "50" })}
            >
              <span className="font-medium">Light</span>
              <span className="text-sm text-muted-foreground">~50 km/week</span>
            </Button>
            <Button
              variant={state.weeklyKm === "100" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-1"
              onClick={() => onUpdate({ weeklyKm: "100" })}
            >
              <span className="font-medium">Moderate</span>
              <span className="text-sm text-muted-foreground">~100 km/week</span>
            </Button>
            <Button
              variant={state.weeklyKm === "200" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-1"
              onClick={() => onUpdate({ weeklyKm: "200" })}
            >
              <span className="font-medium">Regular</span>
              <span className="text-sm text-muted-foreground">~200 km/week</span>
            </Button>
            <Button
              variant={state.weeklyKm === "300" ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-1"
              onClick={() => onUpdate({ weeklyKm: "300" })}
            >
              <span className="font-medium">Frequent</span>
              <span className="text-sm text-muted-foreground">~300 km/week</span>
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-sm text-muted-foreground">Or enter custom weekly km:</div>
            <Input
              type="number"
              placeholder="Enter weekly km"
              className="max-w-[200px]"
              value={state.weeklyKm || ''}
              onChange={(e) => onUpdate({ weeklyKm: e.target.value })}
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
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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
            onChange={(value) => onUpdate({ dietType: value as "" | "VEGAN" | "VEGETARIAN" | "FLEXITARIAN" | "MEAT_MODERATE" | "MEAT_HEAVY" })}
          />
        </div>

        {/* Plate Profile Question */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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

        {/* Monthly Dining Out Question - Updated */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Utensils className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How many times a month do you choose dining out/takeout over cooking at home?
              </label>
              <p className="text-muted-foreground text-sm">
                Tell us about your typical meal preparation and dining habits.
              </p>
            </div>
          </div>
          <QuestionTiles
            category="food"
            subCategory="monthlyDiningOut"
            value={state.monthlyDiningOut}
            onChange={(value) => onUpdate({ monthlyDiningOut: value as "" | "A" | "B" | "C" | "D" })}
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
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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
                consumptionFrequency: state.clothing?.consumptionFrequency ?? '',
                brandLoyalty: state.clothing?.brandLoyalty ?? '',
              },
            })}
          />
        </div>
        {/* Mindful Upgrades */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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
                ...defaultClothing,
                ...(state.clothing ?? {}),
                mindfulUpgrades: value,
                consumptionFrequency: state.clothing?.consumptionFrequency ?? '',
                brandLoyalty: state.clothing?.brandLoyalty ?? '',
              },
            })}
          />
        </div>
        {/* Durability */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
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
                ...defaultClothing,
                ...(state.clothing ?? {}),
                durability: value,
                consumptionFrequency: state.clothing?.consumptionFrequency ?? '',
                brandLoyalty: state.clothing?.brandLoyalty ?? '',
              },
            })}
          />
        </div>
        {/* Consumption Frequency */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How often do you buy new clothes?
              </label>
              <p className="text-muted-foreground text-sm">Your shopping frequency impacts sustainability.</p>
            </div>
          </div>
          <QuestionTiles
            category="clothing"
            subCategory="consumptionFrequency"
            value={state.clothing?.consumptionFrequency || ''}
            onChange={(value) => onUpdate({
              clothing: {
                ...defaultClothing,
                ...(state.clothing ?? {}),
                consumptionFrequency: value,
              },
            })}
          />
        </div>
        {/* Brand Loyalty */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
            <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
          </div>
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <label className="text-lg font-medium text-foreground block mb-2">
                How do you choose your clothing brands?
              </label>
              <p className="text-muted-foreground text-sm">Brand choices reflect your values and impact.</p>
            </div>
          </div>
          <QuestionTiles
            category="clothing"
            subCategory="brandLoyalty"
            value={state.clothing?.brandLoyalty || ''}
            onChange={(value) => onUpdate({
              clothing: {
                ...defaultClothing,
                ...(state.clothing ?? {}),
                brandLoyalty: value,
              },
            })}
          />
        </div>
      </CardContent>
    </div>
  );

  const renderWaste = (): JSX.Element => {
    // Ensure waste state is initialized
    const wasteState = state.waste || defaultWaste;

    return (
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
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
              <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
            </div>
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
              value={wasteState.prevention}
              onChange={(value) => {
                onUpdate({ 
                  waste: { 
                    ...wasteState,
                    prevention: value as "" | "A" | "B" | "C" | "D" 
                  } 
                });
              }}
            />
          </div>

          {/* Smart Shopping Question */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
              <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
            </div>
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
              value={wasteState.smartShopping}
              onChange={(value) => {
                onUpdate({ 
                  waste: { 
                    ...wasteState,
                    smartShopping: value as "" | "A" | "B" | "C" 
                  } 
                });
              }}
            />
          </div>

          {/* Daily Waste Question */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
              <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
            </div>
            <div className="flex items-start gap-4 mb-5">
              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <Trash2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <label className="text-lg font-medium text-foreground block mb-2">
                  How much waste do you typically generate in a day?
                </label>
                <p className="text-muted-foreground text-sm">Understanding your daily waste generation helps identify reduction opportunities.</p>
              </div>
            </div>
            <QuestionTiles
              category="waste"
              subCategory="wasteManagement"
              value={wasteState.dailyWaste}
              onChange={(value) => {
                onUpdate({ 
                  waste: { 
                    ...wasteState,
                    dailyWaste: value as "" | "A" | "B" | "C" | "D" 
                  } 
                });
              }}
            />
          </div>

          {/* Waste Management Question */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
              <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
            </div>
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
              subCategory="management"
              value={wasteState.management}
              onChange={(value) => {
                onUpdate({ 
                  waste: { 
                    ...wasteState,
                    management: value as "" | "A" | "B" | "C" 
                  } 
                });
              }}
            />
          </div>

          {/* Repair or Replace Question - Updated with Sometimes option */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 py-10 mt-8 mb-12 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1 w-8 bg-emerald-200 rounded-full"></span>
              <span className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">Choose one</span>
            </div>
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
            <QuestionTiles
              category="waste"
              subCategory="repairOrReplace"
              value={wasteState.repairOrReplace}
              onChange={(value) => {
                onUpdate({ 
                  waste: { 
                    ...wasteState,
                    repairOrReplace: value as "" | "A" | "B" | "C" 
                  } 
                });
              }}
            />
          </div>
        </CardContent>
      </div>
    );
  };

  const renderAirQuality = () => (
    <div className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary mb-2">Air Quality Impact</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Understanding your relationship with air quality helps us assess your environmental awareness and habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Outdoor Air Quality - Updated with Mostly Polluted option */}
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
            onChange={(value) => onUpdate({ airQuality: { ...state.airQuality, outdoorAirQuality: value as "" | "A" | "B" | "C" | "D" | "E" } })}
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
  const currentSectionColor = sectionColors[currentStep] || 'zerrah-green';

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
        "max-w-4xl w-full mx-auto transition-opacity duration-500 py-10",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {!showResults ? (
        <Card variant="elevated">
          <CardContent className="p-6 max-w-4xl w-full mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className={`rounded-full p-2 bg-${currentSectionColor} bg-opacity-20`}>
                  <CurrentStepIcon className={`h-5 w-5 text-${currentSectionColor}`} />
                </span>
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
                  className={`bg-${currentSectionColor} hover:bg-${currentSectionColor}/90 text-white`}
                >
                  Calculate Impact
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  className={`bg-white text-${currentSectionColor} border-2 border-${currentSectionColor} hover:bg-${currentSectionColor}/10`} 
                  onClick={handleNext}
                >
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
          gender={state.gender === 'female' ? 'girl' : 'boy'}
        />
      ) : null}
    </div>
  );
};

export default Calculator;
