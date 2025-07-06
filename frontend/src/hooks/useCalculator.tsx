import { useState } from 'react';

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

export interface CalculatorState {
  // Demographics
  name: string;
  email: string;
  age: string;
  gender: string;
  profession: string;
  location: string;
  country: string;
  householdSize: number;

  // Home Energy
  homeSize: string;
  homeEfficiency: "" | "A" | "B" | "C";
  energyManagement: "" | "A" | "B" | "C";
  electricityKwh: number;
  naturalGasTherm: number;
  heatingOilGallons: number;
  propaneGallons: number;
  usesRenewableEnergy: boolean;
  hasEnergyEfficiencyUpgrades: boolean;
  hasSmartThermostats: boolean;
  hasEnergyStarAppliances: boolean;

  // Transportation
  primaryTransportMode: "" | "A" | "B" | "C" | "D";
  carProfile: "" | "A" | "B" | "C" | "D" | "E";
  weeklyKm: number;
  costPerMile: number;
  longDistanceTravel: "" | "A" | "B" | "C";

  // Food & Diet
  dietType: "" | "VEGAN" | "VEGETARIAN" | "FLEXITARIAN" | "MEAT_MODERATE" | "MEAT_HEAVY";
  plateProfile: "" | "A" | "B" | "C";
  monthlyDiningOut: "" | "A" | "B" | "C" | "D";
  plantBasedMealsPerWeek: number;
  buysLocalFood: boolean;
  followsSustainableDiet: boolean;
  growsOwnFood: boolean;
  compostsFood: boolean;
  usesMealPlanning: boolean;
  diningOutFrequency: 'RARELY' | 'SOMETIMES' | 'FREQUENTLY';
  usesReusableContainers: boolean;

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

  // Clothing
  clothing?: {
    wardrobeImpact: string;
    mindfulUpgrades: string;
    durability: string;
    consumptionFrequency: string;
    brandLoyalty: string;
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

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    // Demographics
    name: '',
    email: '',
    age: '',
    gender: '',
    profession: '',
    location: '',
    country: '',
    householdSize: 1,

    // Home Energy defaults
    homeSize: '',
    homeEfficiency: '',
    energyManagement: '',
    electricityKwh: 0,
    naturalGasTherm: 0,
    heatingOilGallons: 0,
    propaneGallons: 0,
    usesRenewableEnergy: false,
    hasEnergyEfficiencyUpgrades: false,
    hasSmartThermostats: false,
    hasEnergyStarAppliances: false,

    // Transportation defaults
    primaryTransportMode: '',
    carProfile: '',
    weeklyKm: 0,
    costPerMile: 0,
    longDistanceTravel: '',

    // Food & Diet defaults
    dietType: '',
    plateProfile: '',
    monthlyDiningOut: '',
    plantBasedMealsPerWeek: 0,
    buysLocalFood: false,
    followsSustainableDiet: false,
    growsOwnFood: false,
    compostsFood: false,
    usesMealPlanning: false,
    diningOutFrequency: 'SOMETIMES',
    usesReusableContainers: false,

    // Waste defaults
    waste: {
      prevention: '',
      smartShopping: '',
      dailyWaste: '',
      management: '',
      repairOrReplace: ''
    },

    // Air Quality defaults
    airQuality: {
      outdoorAirQuality: '',
      aqiMonitoring: '',
      indoorAirQuality: '',
      airQualityCommuting: '',
      airQualityImpact: ''
    }
  });

  const calculateHomeEmissions = () => {
    // Base emissions for an average home (3 bedrooms, moderate efficiency)
    let emissions = 7.5; // Average annual home emissions in tons CO2e
    
    // Apply home size factor
    const homeSizeFactors = {
      '1': 0.6,  // Studio/1 bedroom
      '2': 0.8,  // 2 bedrooms
      '3': 1.0,  // 3 bedrooms (baseline)
      '4': 1.2,  // 4 bedrooms
      '5': 1.4,  // 5 bedrooms
      '6': 1.6,  // 6 bedrooms
      '7+': 1.8  // 7+ bedrooms
    };
    const homeSizeFactor = state.homeSize ? homeSizeFactors[state.homeSize as keyof typeof homeSizeFactors] || 1.0 : 1.0;
    emissions *= homeSizeFactor;

    // Apply home efficiency factor
    const efficiencyFactor = state.homeEfficiency ? {
      'A': 0.7,  // Highly efficient
      'B': 1.0,  // Moderately efficient (baseline)
      'C': 1.3   // Basic efficiency
    }[state.homeEfficiency] : 1.0;  // Default to baseline if not selected
    emissions *= efficiencyFactor;

    // Apply energy management factor
    const managementFactor = state.energyManagement ? {
      'A': 0.8,  // Active management
      'B': 1.0,  // Basic management (baseline)
      'C': 1.2   // Minimal management
    }[state.energyManagement] : 1.0;  // Default to baseline if not selected
    emissions *= managementFactor;
    
    return emissions;
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
      const weeklyKm = state.weeklyKm;
      const costPerMile = state.costPerMile;
      const annualMiles = (weeklyKm * 52) / 1.60934; // Convert weekly km to annual miles
      emissions += annualMiles * costPerMile * 0.4; // 0.4 kg CO2e per mile
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
      const plantBasedMeals = state.plantBasedMealsPerWeek;
      emissions *= (1 - (plantBasedMeals / 21) * 0.3); // 30% reduction per plant-based meal
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

  const calculateScore = () => {
    const homeEmissions = calculateHomeEmissions();
    const transportEmissions = calculateTransportEmissions();
    const foodEmissions = calculateFoodEmissions();
    const wasteEmissions = calculateWasteEmissions();
    
    const totalFootprint = homeEmissions + transportEmissions + foodEmissions + wasteEmissions;
    
    return {
      homeEmissions,
      transportEmissions,
      foodEmissions,
      wasteEmissions,
      totalFootprint,
      comparedToUS: (totalFootprint / 16) * 100,
      comparedToGlobal: (totalFootprint / 4.8) * 100,
      comparedToTarget: (totalFootprint / 2) * 100,
    };
  };

  const updateCalculator = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetCalculator = () => {
    setState({
      // Demographics
      name: '',
      email: '',
      age: '',
      gender: '',
      profession: '',
      location: '',
      country: '',
      householdSize: 1,

      // Home Energy defaults
      homeSize: '',
      homeEfficiency: '',
      energyManagement: '',
      electricityKwh: 0,
      naturalGasTherm: 0,
      heatingOilGallons: 0,
      propaneGallons: 0,
      usesRenewableEnergy: false,
      hasEnergyEfficiencyUpgrades: false,
      hasSmartThermostats: false,
      hasEnergyStarAppliances: false,

      // Transportation defaults
      primaryTransportMode: '',
      carProfile: '',
      weeklyKm: 0,
      costPerMile: 0,
      longDistanceTravel: '',

      // Food & Diet defaults
      dietType: '',
      plateProfile: '',
      monthlyDiningOut: '',
      plantBasedMealsPerWeek: 0,
      buysLocalFood: false,
      followsSustainableDiet: false,
      growsOwnFood: false,
      compostsFood: false,
      usesMealPlanning: false,
      diningOutFrequency: 'SOMETIMES',
      usesReusableContainers: false,

      // Waste defaults
      waste: {
        prevention: '',
        smartShopping: '',
        dailyWaste: '',
        management: '',
        repairOrReplace: ''
      },

      // Air Quality defaults
      airQuality: {
        outdoorAirQuality: '',
        aqiMonitoring: '',
        indoorAirQuality: '',
        airQualityCommuting: '',
        airQualityImpact: ''
      }
    });
  };

  return {
    state,
    setState,
    calculateHomeEmissions,
    calculateTransportEmissions,
    calculateFoodEmissions,
    calculateWasteEmissions,
    calculateScore,
    updateCalculator,
    resetCalculator
  };
};

export default useCalculator;
