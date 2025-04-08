
import { useState, useMemo } from 'react';
import { CalculatorState, FootprintResults } from '../types/calculator';
import { 
  calculateHomeEmissions, 
  calculateTransportEmissions, 
  calculateFoodEmissions,
  calculateWasteEmissions,
  calculateFashionEmissions 
} from '../utils/calculatorUtils';

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

  const results = useMemo<FootprintResults>(() => {
    const homeEmissions = calculateHomeEmissions(state);
    const transportEmissions = calculateTransportEmissions(state);
    const foodEmissions = calculateFoodEmissions(state);
    const wasteEmissions = calculateWasteEmissions(state);
    const fashionEmissions = calculateFashionEmissions(state);
    
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
      // Reset to initial state with all default values
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
