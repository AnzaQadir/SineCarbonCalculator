
import { useState, useMemo } from 'react';
import {
  calculateHomeEmissions,
  calculateTransportEmissions,
  calculateFoodEmissions,
  calculateWasteEmissions,
  calculateTotalFootprint,
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

interface CalculatorState {
  step: number;
  // Home energy
  electricityKwh: number;
  naturalGasTherm: number;
  heatingOilGallons: number;
  propaneGallons: number;
  // Transportation
  carType: CarType;
  carMiles: number;
  flightType: FlightType;
  flightMiles: number;
  transitType: TransitType;
  transitMiles: number;
  // Food
  dietType: DietType;
  // Waste
  wasteLbs: number;
  recyclingPercentage: number;
}

interface FootprintResults {
  homeEmissions: number;
  transportEmissions: number;
  foodEmissions: number;
  wasteEmissions: number;
  totalFootprint: number;
  comparedToUS: number; // Percentage compared to US average
  comparedToGlobal: number; // Percentage compared to global average
  comparedToTarget: number; // Percentage compared to sustainability target
}

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    step: 1,
    // Home energy
    electricityKwh: 500, // monthly
    naturalGasTherm: 30, // monthly
    heatingOilGallons: 0, // monthly
    propaneGallons: 0, // monthly
    // Transportation
    carType: 'MEDIUM',
    carMiles: 1000, // monthly
    flightType: 'MEDIUM',
    flightMiles: 5000, // yearly
    transitType: 'BUS',
    transitMiles: 100, // monthly
    // Food
    dietType: 'AVERAGE',
    // Waste
    wasteLbs: 30, // monthly
    recyclingPercentage: 30, // percentage
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
      annualPropane
    );

    const transportEmissions = calculateTransportEmissions(
      state.carType,
      annualCarMiles,
      state.flightType,
      state.flightMiles,
      state.transitType,
      annualTransitMiles
    );

    const foodEmissions = calculateFoodEmissions(state.dietType);

    const wasteEmissions = calculateWasteEmissions(
      annualWasteLbs,
      state.recyclingPercentage
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

    return {
      homeEmissions,
      transportEmissions,
      foodEmissions,
      wasteEmissions,
      totalFootprint,
      comparedToUS,
      comparedToGlobal,
      comparedToTarget,
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
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  // Reset the calculator
  const resetCalculator = () => {
    setState({
      step: 1,
      electricityKwh: 500,
      naturalGasTherm: 30,
      heatingOilGallons: 0,
      propaneGallons: 0,
      carType: 'MEDIUM',
      carMiles: 1000,
      flightType: 'MEDIUM',
      flightMiles: 5000,
      transitType: 'BUS',
      transitMiles: 100,
      dietType: 'AVERAGE',
      wasteLbs: 30,
      recyclingPercentage: 30,
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
