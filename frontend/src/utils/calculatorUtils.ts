
import { CalculatorState } from '../types/calculator';
import { EMISSION_FACTORS } from '../constants/emissionFactors';

export const calculateHomeEmissions = (state: CalculatorState): number => {
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

export const calculateTransportEmissions = (state: CalculatorState): number => {
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

export const calculateFoodEmissions = (state: CalculatorState): number => {
  let emissions = EMISSION_FACTORS.diet[state.dietType];
  
  // Apply modifiers
  if (state.buysLocalFood) emissions *= 0.9;
  if (state.followsSustainableDiet) emissions *= 0.8;
  if (state.growsOwnFood) emissions *= 0.7;
  if (state.compostsFood) emissions *= 0.95;
  if (state.usesMealPlanning) emissions *= 0.9;
  
  return emissions;
};

export const calculateWasteEmissions = (state: CalculatorState): number => {
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

export const calculateFashionEmissions = (state: CalculatorState): number => {
  let emissions = EMISSION_FACTORS.fashion[state.fashionConsumption];
  
  // Apply modifiers
  if (state.buysEthicalFashion) emissions *= 0.7;
  if (state.buysSecondHandClothing) emissions *= 0.5;
  if (state.avoidsFastFashion) emissions *= 0.6;
  if (state.investsInQuality) emissions *= 0.8;
  
  return emissions;
};
