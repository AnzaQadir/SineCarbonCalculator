
import { useState, useMemo } from 'react';
import {
  calculateHomeEmissions,
  calculateTransportEmissions,
  calculateFoodEmissions,
  calculateWasteEmissions,
  calculateTotalFootprint,
  generateInsights,
  US_AVERAGE_FOOTPRINT,
  GLOBAL_AVERAGE_FOOTPRINT,
  SUSTAINABILITY_TARGET,
  EMISSION_FACTORS
} from '../utils/calculations';

// Define the calculator state types
export type CarType = keyof typeof EMISSION_FACTORS.CAR_MILE;
export type FlightType = keyof typeof EMISSION_FACTORS.FLIGHT_MILE;
export type TransitType = keyof typeof EMISSION_FACTORS.PUBLIC_TRANSIT_MILE;
export type DietType = keyof typeof EMISSION_FACTORS.FOOD_DIET;

export interface CalculatorState {
  step: number;
  // Demographics
  name: string;
  age: number;
  email: string;
  gender: string;
  profession: string;
  // Home energy
  electricityKwh: number;
  naturalGasTherm: number;
  heatingOilGallons: number;
  propaneGallons: number;
  usesRenewableEnergy: boolean;
  hasEnergyEfficiencyUpgrades: boolean;
  // Transportation
  carType: CarType;
  carMiles: number;
  flightType: FlightType;
  flightMiles: number;
  transitType: TransitType;
  transitMiles: number;
  usesActiveTransport: boolean;
  hasElectricVehicle: boolean;
  // Food
  dietType: DietType;
  buysLocalFood: boolean;
  followsSustainableDiet: boolean;
  // Waste
  wasteLbs: number;
  recyclingPercentage: number;
  minimizesWaste: boolean;
  avoidsPlastic: boolean;
}

export interface FootprintResults {
  homeEmissions: number;
  transportEmissions: number;
  foodEmissions: number;
  wasteEmissions: number;
  totalFootprint: number;
  comparedToUS: number; // Percentage compared to US average
  comparedToGlobal: number; // Percentage compared to global average
  comparedToTarget: number; // Percentage compared to sustainability target
  insights: string[]; // Generated insights based on results
}

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    step: 0,
    // Demographics
    name: '',
    age: 0,
    email: '',
    gender: '',
    profession: '',
    // Home energy
    electricityKwh: 500, // monthly
    naturalGasTherm: 30, // monthly
    heatingOilGallons: 0, // monthly
    propaneGallons: 0, // monthly
    usesRenewableEnergy: false,
    hasEnergyEfficiencyUpgrades: false,
    // Transportation
    carType: 'MEDIUM',
    carMiles: 1000, // monthly
    flightType: 'MEDIUM',
    flightMiles: 5000, // yearly
    transitType: 'BUS',
    transitMiles: 100, // monthly
    usesActiveTransport: false,
    hasElectricVehicle: false,
    // Food
    dietType: 'AVERAGE',
    buysLocalFood: false,
    followsSustainableDiet: false,
    // Waste
    wasteLbs: 30, // monthly
    recyclingPercentage: 30, // percentage
    minimizesWaste: false,
    avoidsPlastic: false,
  });

  // Calculate results based on current state
  const results = useMemo<FootprintResults>(() => {
    // Convert monthly values to annual
    const annualElectricity = state.electricityKwh * 12;
    const annualNaturalGas = state.naturalGasTherm * 12;
    const annualHeatingOil = state.heatingOilGallons * 12;
    const annualPropane = state.propaneGallons * 12;
    const annualCarMiles = state.carMiles * 12;
    const annualTransitMiles = state.transitMiles * 12;
    const annualWasteLbs = state.wasteLbs * 12;
    
    // Flight miles are already annual

    // Calculate emissions by category
    const homeEmissions = calculateHomeEmissions(
      annualElectricity,
      annualNaturalGas,
      annualHeatingOil,
      annualPropane,
      state.usesRenewableEnergy,
      state.hasEnergyEfficiencyUpgrades
    );

    const transportEmissions = calculateTransportEmissions(
      state.carType,
      annualCarMiles,
      state.flightType,
      state.flightMiles,
      state.transitType,
      annualTransitMiles,
      state.usesActiveTransport,
      state.hasElectricVehicle
    );

    const foodEmissions = calculateFoodEmissions(
      state.dietType,
      state.buysLocalFood,
      state.followsSustainableDiet
    );

    const wasteEmissions = calculateWasteEmissions(
      annualWasteLbs,
      state.recyclingPercentage,
      state.minimizesWaste,
      state.avoidsPlastic
    );

    // Calculate total footprint
    const totalFootprint = calculateTotalFootprint(
      homeEmissions,
      transportEmissions,
      foodEmissions,
      wasteEmissions
    );

    // Calculate percentages compared to benchmarks
    const comparedToUS = (totalFootprint / US_AVERAGE_FOOTPRINT) * 100;
    const comparedToGlobal = (totalFootprint / GLOBAL_AVERAGE_FOOTPRINT) * 100;
    const comparedToTarget = (totalFootprint / SUSTAINABILITY_TARGET) * 100;

    // Generate insights based on the user's results
    const insights = generateInsights({
      homeEmissions,
      transportEmissions,
      foodEmissions,
      wasteEmissions,
      totalFootprint,
      comparedToUS
    });

    return {
      homeEmissions,
      transportEmissions,
      foodEmissions,
      wasteEmissions,
      totalFootprint,
      comparedToUS,
      comparedToGlobal,
      comparedToTarget,
      insights,
    };
  }, [state]);

  // Update calculator state
  const updateCalculator = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Move to the next step
  const nextStep = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  // Move to the previous step
  const prevStep = () => {
    setState(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  };

  // Reset the calculator
  const resetCalculator = () => {
    setState({
      step: 0,
      name: '',
      age: 0,
      email: '',
      gender: '',
      profession: '',
      electricityKwh: 500,
      naturalGasTherm: 30,
      heatingOilGallons: 0,
      propaneGallons: 0,
      usesRenewableEnergy: false,
      hasEnergyEfficiencyUpgrades: false,
      carType: 'MEDIUM',
      carMiles: 1000,
      flightType: 'MEDIUM',
      flightMiles: 5000,
      transitType: 'BUS',
      transitMiles: 100,
      usesActiveTransport: false,
      hasElectricVehicle: false,
      dietType: 'AVERAGE',
      buysLocalFood: false,
      followsSustainableDiet: false,
      wasteLbs: 30,
      recyclingPercentage: 30,
      minimizesWaste: false,
      avoidsPlastic: false,
    });
  };

  return {
    state,
    results,
    updateCalculator,
    nextStep,
    prevStep,
    resetCalculator,
  };
};
