import { useState, useMemo } from 'react';

// Emission factors and constants
const EMISSION_FACTORS = {
  electricity: {
    LOW: 0.3,
    MEDIUM: 0.4,
    HIGH: 0.5,
  },
  heating: {
    ELECTRIC: 0.4,
    GAS: 0.2,
    OIL: 0.7,
    RENEWABLE: 0.05,
  },
  transport: {
    WALK_BIKE: 0,
    PUBLIC: 0.14,
    HYBRID: 0.1,
    ELECTRIC: 0.05,
    SMALL_CAR: 0.15,
    MEDIUM_CAR: 0.2,
    LARGE_CAR: 0.3,
  },
  diet: {
    VEGAN: 1.5,
    VEGETARIAN: 2.0,
    FLEXITARIAN: 2.5,
    MEAT_MODERATE: 3.0,
    MEAT_HEAVY: 4.0,
  },
  waste: {
    LOW: 0.1,
    MEDIUM: 0.2,
    HIGH: 0.3,
  },
  fashion: {
    MINIMAL: 0.5,
    MODERATE: 1.0,
    FREQUENT: 2.0,
  }
};

interface FootprintResults {
  total: number;
  home: number;
  transport: number;
  food: number;
  waste: number;
  fashion: number;
  comparedToUS: number;
  comparedToGlobal: number;
  comparedToTarget: number;
}

export interface CalculatorState {
  // Demographics
  name: string;
  email: string;
  age: number;
  gender: string;
  profession: string;
  location: string;
  householdSize: number;

  // Home Energy
  electricityConsumption: 'LOW' | 'MEDIUM' | 'HIGH';
  electricityKwh: number;
  heatingSource: 'ELECTRIC' | 'GAS' | 'OIL' | 'RENEWABLE';
  naturalGasTherm: number;
  heatingOilGallons: number;
  propaneGallons: number;
  usesRenewableEnergy: boolean;
  hasEnergyEfficiencyUpgrades: boolean;
  hasSmartThermostats: boolean;
  hasEnergyStarAppliances: boolean;
  homeSize: 'SMALL' | 'MEDIUM' | 'LARGE';

  // Transportation
  primaryTransportMode: 'WALK_BIKE' | 'PUBLIC' | 'HYBRID' | 'ELECTRIC' | 'SMALL_CAR' | 'MEDIUM_CAR' | 'LARGE_CAR';
  weeklyCommuteDistance: number;
  vehicleEfficiency: number;
  flightType: 'NONE' | 'RARE' | 'OCCASIONAL' | 'FREQUENT';
  offsetsTravelEmissions: boolean;
  carType: string;
  carMiles: number;
  usesActiveTransport: boolean;
  hasElectricVehicle: boolean;
  flightMiles: number;
  transitType: string;
  transitMiles: number;

  // Food & Diet
  dietType: 'VEGAN' | 'VEGETARIAN' | 'FLEXITARIAN' | 'MEAT_MODERATE' | 'MEAT_HEAVY';
  plantBasedMealsPerWeek: number;
  buysLocalFood: boolean;
  followsSustainableDiet: boolean;
  growsOwnFood: boolean;
  compostsFood: boolean;
  usesMealPlanning: boolean;
  diningOutFrequency: 'RARELY' | 'SOMETIMES' | 'FREQUENTLY';
  usesReusableContainers: boolean;

  // Waste & Consumption
  recyclingPercentage: number;
  wasteLbs: number;
  minimizesWaste: boolean;
  avoidsPlastic: boolean;
  repairsItems: boolean;
  buysSecondHand: boolean;
  usesRecycledProducts: boolean;
  wasteAuditFrequency: 'NEVER' | 'SOMETIMES' | 'REGULARLY';

  // Fashion & Clothing
  fashionConsumption: 'MINIMAL' | 'MODERATE' | 'FREQUENT';
  buysEthicalFashion: boolean;
  buysSecondHandClothing: boolean;
  avoidsFastFashion: boolean;
  investsInQuality: boolean;
  clothingLifespan: 'SHORT' | 'MEDIUM' | 'LONG';

  // New waste and consumption properties
  waste: {
    wasteLbs: number;
    recyclingPercentage: number;
    minimizesWaste: boolean;
    avoidsPlastic: boolean;
    productLifespan: 'FREQUENT' | 'MODERATE' | 'LONG';
    consciousPurchasing: number;
    evaluatesLifecycle: boolean;
  };

}

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    // Initial state with default values
    name: '',
    email: '',
    age: 0,
    gender: '',
    profession: '',
    location: '',
    householdSize: 1,

    // Home Energy defaults
    electricityConsumption: 'MEDIUM',
    electricityKwh: 0,
    heatingSource: 'GAS',
    naturalGasTherm: 0,
    heatingOilGallons: 0,
    propaneGallons: 0,
    usesRenewableEnergy: false,
    hasEnergyEfficiencyUpgrades: false,
    hasSmartThermostats: false,
    hasEnergyStarAppliances: false,
    homeSize: 'MEDIUM',

    // Transportation defaults
    primaryTransportMode: 'SMALL_CAR',
    weeklyCommuteDistance: 0,
    vehicleEfficiency: 0,
    flightType: 'NONE',
    offsetsTravelEmissions: false,
    carType: 'MEDIUM',
    carMiles: 0,
    usesActiveTransport: false,
    hasElectricVehicle: false,
    flightMiles: 0,
    transitType: 'BUS',
    transitMiles: 0,

    // Food & Diet defaults
    dietType: 'MEAT_MODERATE',
    plantBasedMealsPerWeek: 0,
    buysLocalFood: false,
    followsSustainableDiet: false,
    growsOwnFood: false,
    compostsFood: false,
    usesMealPlanning: false,
    diningOutFrequency: 'SOMETIMES',
    usesReusableContainers: false,

    // Waste defaults
    recyclingPercentage: 0,
    wasteLbs: 0,
    minimizesWaste: false,
    avoidsPlastic: false,
    repairsItems: false,
    buysSecondHand: false,
    usesRecycledProducts: false,
    wasteAuditFrequency: 'NEVER',

    // Fashion defaults
    fashionConsumption: 'MODERATE',
    buysEthicalFashion: false,
    buysSecondHandClothing: false,
    avoidsFastFashion: false,
    investsInQuality: false,
    clothingLifespan: 'MEDIUM',

    // New waste and consumption properties
    waste: {
      wasteLbs: 0,
      recyclingPercentage: 0,
      minimizesWaste: false,
      avoidsPlastic: false,
      productLifespan: 'MODERATE',
      consciousPurchasing: 3,
      evaluatesLifecycle: false
    },
  });

  const calculateHomeEmissions = () => {
    let emissions = 0;
    
    // Base electricity emissions
    emissions += state.electricityKwh * EMISSION_FACTORS.electricity[state.electricityConsumption];
    
    // Heating emissions
    emissions += state.naturalGasTherm * EMISSION_FACTORS.heating[state.heatingSource];
    
    // Apply modifiers
    if (state.usesRenewableEnergy) emissions *= 0.2;
    if (state.hasEnergyEfficiencyUpgrades) emissions *= 0.8;
    if (state.hasSmartThermostats) emissions *= 0.9;
    if (state.hasEnergyStarAppliances) emissions *= 0.85;
    
    return emissions;
  };

  const calculateTransportEmissions = () => {
    let emissions = 0;
    
    // Base transport emissions
    emissions += state.weeklyCommuteDistance * 52 * EMISSION_FACTORS.transport[state.primaryTransportMode];
    
    // Flight emissions with offset consideration
    const flightEmissions = state.flightMiles * 0.18;
    emissions += state.offsetsTravelEmissions ? flightEmissions * 0.5 : flightEmissions;
    
    // Apply modifiers
    if (state.usesActiveTransport) emissions *= 0.9;
    if (state.hasElectricVehicle) emissions *= 0.7;
    
    return emissions;
  };

  const calculateFoodEmissions = () => {
    let emissions = EMISSION_FACTORS.diet[state.dietType];
    
    // Apply modifiers
    if (state.buysLocalFood) emissions *= 0.9;
    if (state.followsSustainableDiet) emissions *= 0.8;
    if (state.growsOwnFood) emissions *= 0.7;
    if (state.compostsFood) emissions *= 0.95;
    if (state.usesMealPlanning) emissions *= 0.9;
    
    return emissions;
  };

  const calculateWasteEmissions = () => {
    let emissions = state.waste.wasteLbs * 0.0005 * 12; // Convert monthly to annual
    
    // Apply recycling reduction
    if (state.waste.recyclingPercentage > 0) {
      const recyclingReduction = (state.waste.recyclingPercentage / 100) * 0.5;
      emissions *= (1 - recyclingReduction);
    }
    
    // Apply waste minimization reduction
    if (state.waste.minimizesWaste) {
      emissions *= 0.8;
    }
    
    return emissions;
  };

  const calculateFashionEmissions = () => {
    let emissions = EMISSION_FACTORS.fashion[state.fashionConsumption];
    
    // Apply modifiers
    if (state.buysEthicalFashion) emissions *= 0.7;
    if (state.buysSecondHandClothing) emissions *= 0.5;
    if (state.avoidsFastFashion) emissions *= 0.6;
    if (state.investsInQuality) emissions *= 0.8;
    
    return emissions;
  };

  const results = useMemo<FootprintResults>(() => {
    const homeEmissions = calculateHomeEmissions();
    const transportEmissions = calculateTransportEmissions();
    const foodEmissions = calculateFoodEmissions();
    const wasteEmissions = calculateWasteEmissions();
    const fashionEmissions = calculateFashionEmissions();
    
    const totalFootprint = homeEmissions + transportEmissions + foodEmissions + wasteEmissions + fashionEmissions;
    
    return {
      total: totalFootprint,
      home: homeEmissions,
      transport: transportEmissions,
      food: foodEmissions,
      waste: wasteEmissions,
      fashion: fashionEmissions,
      comparedToUS: (totalFootprint / 16) * 100,
      comparedToGlobal: (totalFootprint / 4.8) * 100,
      comparedToTarget: (totalFootprint / 2) * 100,
    };
  }, [state]);

  const updateCalculator = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetCalculator = () => {
    setState({
      // Reset to initial state
      name: '',
      email: '',
      age: 0,
      gender: '',
      profession: '',
      location: '',
      householdSize: 1,
      electricityConsumption: 'MEDIUM',
      electricityKwh: 0,
      heatingSource: 'GAS',
      naturalGasTherm: 0,
      heatingOilGallons: 0,
      propaneGallons: 0,
      usesRenewableEnergy: false,
      hasEnergyEfficiencyUpgrades: false,
      hasSmartThermostats: false,
      hasEnergyStarAppliances: false,
      homeSize: 'MEDIUM',
      primaryTransportMode: 'SMALL_CAR',
      weeklyCommuteDistance: 0,
      vehicleEfficiency: 0,
      flightType: 'NONE',
      offsetsTravelEmissions: false,
      carType: 'MEDIUM',
      carMiles: 0,
      usesActiveTransport: false,
      hasElectricVehicle: false,
      flightMiles: 0,
      transitType: 'BUS',
      transitMiles: 0,
      dietType: 'MEAT_MODERATE',
      plantBasedMealsPerWeek: 0,
      buysLocalFood: false,
      followsSustainableDiet: false,
      growsOwnFood: false,
      compostsFood: false,
      usesMealPlanning: false,
      diningOutFrequency: 'SOMETIMES',
      usesReusableContainers: false,
      recyclingPercentage: 0,
      wasteLbs: 0,
      minimizesWaste: false,
      avoidsPlastic: false,
      repairsItems: false,
      buysSecondHand: false,
      usesRecycledProducts: false,
      wasteAuditFrequency: 'NEVER',
      fashionConsumption: 'MODERATE',
      buysEthicalFashion: false,
      buysSecondHandClothing: false,
      avoidsFastFashion: false,
      investsInQuality: false,
      clothingLifespan: 'MEDIUM',
      waste: {
        wasteLbs: 0,
        recyclingPercentage: 0,
        minimizesWaste: false,
        avoidsPlastic: false,
        productLifespan: 'MODERATE',
        consciousPurchasing: 3,
        evaluatesLifecycle: false
      },
    });
  };

  return {
    state,
    results,
    updateCalculator,
    resetCalculator,
  };
};

export default useCalculator;
