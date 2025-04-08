
// CO2 emission factors in kg CO2e
export const EMISSION_FACTORS = {
  // Home energy
  ELECTRICITY_KWH: 0.429, // kg CO2e per kWh
  NATURAL_GAS_THERM: 5.3, // kg CO2e per therm
  HEATING_OIL_GALLON: 10.16, // kg CO2e per gallon
  PROPANE_GALLON: 5.76, // kg CO2e per gallon
  RENEWABLE_ENERGY_REDUCTION: 0.7, // 70% reduction for renewable energy
  ENERGY_EFFICIENCY_REDUCTION: 0.15, // 15% reduction for energy efficiency measures

  // Transportation
  CAR_MILE: {
    SMALL: 0.26, // kg CO2e per mile (small car)
    MEDIUM: 0.35, // kg CO2e per mile (medium car)
    LARGE: 0.44, // kg CO2e per mile (large car/SUV)
    HYBRID: 0.19, // kg CO2e per mile (hybrid)
    ELECTRIC: 0.10, // kg CO2e per mile (electric - based on grid mix)
  },
  FLIGHT_MILE: {
    SHORT: 0.26, // kg CO2e per mile (short flights < 300 miles)
    MEDIUM: 0.18, // kg CO2e per mile (medium flights 300-2300 miles)
    LONG: 0.21, // kg CO2e per mile (long flights > 2300 miles)
  },
  PUBLIC_TRANSIT_MILE: {
    BUS: 0.055, // kg CO2e per mile
    SUBWAY: 0.03, // kg CO2e per mile
    TRAIN: 0.08, // kg CO2e per mile
  },
  ACTIVE_TRANSPORT_REDUCTION: 0.2, // 20% reduction for active transport
  EV_REDUCTION: 0.3, // 30% reduction for electric vehicles

  // Waste
  WASTE_LB: 0.94, // kg CO2e per pound of waste
  RECYCLING_REDUCTION: 0.3, // 30% reduction for recycling
  WASTE_MINIMIZATION_REDUCTION: 0.25, // 25% reduction for waste minimization efforts
  PLASTIC_AVOIDANCE_REDUCTION: 0.15, // 15% reduction for plastic avoidance

  // Food
  FOOD_DIET: {
    MEAT_HEAVY: 3.3, // kg CO2e per day
    AVERAGE: 2.5, // kg CO2e per day
    VEGETARIAN: 1.7, // kg CO2e per day
    VEGAN: 1.5, // kg CO2e per day
  },
  LOCAL_FOOD_REDUCTION: 0.1, // 10% reduction for buying local food
  SUSTAINABLE_DIET_REDUCTION: 0.15, // 15% reduction for sustainable diet

  // General conversion factors
  KG_TO_METRIC_TONS: 0.001,
  LBS_TO_KG: 0.453592,
  KWH_TO_MWH: 0.001,
};

export const calculateHomeEmissions = (
  electricityKwh: number,
  naturalGasTherm: number,
  heatingOilGallons: number,
  propaneGallons: number,
  usesRenewableEnergy: boolean = false,
  hasEnergyEfficiencyUpgrades: boolean = false
): number => {
  let emissions = (
    electricityKwh * EMISSION_FACTORS.ELECTRICITY_KWH +
    naturalGasTherm * EMISSION_FACTORS.NATURAL_GAS_THERM +
    heatingOilGallons * EMISSION_FACTORS.HEATING_OIL_GALLON +
    propaneGallons * EMISSION_FACTORS.PROPANE_GALLON
  );

  // Apply reductions for sustainable practices
  if (usesRenewableEnergy) {
    emissions *= (1 - EMISSION_FACTORS.RENEWABLE_ENERGY_REDUCTION);
  }

  if (hasEnergyEfficiencyUpgrades) {
    emissions *= (1 - EMISSION_FACTORS.ENERGY_EFFICIENCY_REDUCTION);
  }

  return emissions;
};

export const calculateTransportEmissions = (
  carType: keyof typeof EMISSION_FACTORS.CAR_MILE,
  carMiles: number,
  flightType: keyof typeof EMISSION_FACTORS.FLIGHT_MILE,
  flightMiles: number,
  transitType: keyof typeof EMISSION_FACTORS.PUBLIC_TRANSIT_MILE,
  transitMiles: number,
  usesActiveTransport: boolean = false,
  hasElectricVehicle: boolean = false
): number => {
  let emissions = (
    carMiles * EMISSION_FACTORS.CAR_MILE[carType] +
    flightMiles * EMISSION_FACTORS.FLIGHT_MILE[flightType] +
    transitMiles * EMISSION_FACTORS.PUBLIC_TRANSIT_MILE[transitType]
  );

  // Apply reductions for sustainable practices
  if (usesActiveTransport) {
    emissions *= (1 - EMISSION_FACTORS.ACTIVE_TRANSPORT_REDUCTION);
  }

  if (hasElectricVehicle) {
    emissions *= (1 - EMISSION_FACTORS.EV_REDUCTION);
  }

  return emissions;
};

export const calculateFoodEmissions = (
  dietType: keyof typeof EMISSION_FACTORS.FOOD_DIET,
  buysLocalFood: boolean = false,
  followsSustainableDiet: boolean = false
): number => {
  // Annual emissions based on daily diet type
  let emissions = EMISSION_FACTORS.FOOD_DIET[dietType] * 365;

  // Apply reductions for sustainable practices
  if (buysLocalFood) {
    emissions *= (1 - EMISSION_FACTORS.LOCAL_FOOD_REDUCTION);
  }

  if (followsSustainableDiet) {
    emissions *= (1 - EMISSION_FACTORS.SUSTAINABLE_DIET_REDUCTION);
  }

  return emissions;
};

export const calculateWasteEmissions = (
  wasteLbs: number,
  recyclingPercentage: number,
  minimizesWaste: boolean = false,
  avoidsPlastic: boolean = false
): number => {
  // Apply recycling reduction factor
  let recyclingFactor = 1 - (recyclingPercentage / 100) * EMISSION_FACTORS.RECYCLING_REDUCTION;
  let emissions = wasteLbs * EMISSION_FACTORS.WASTE_LB * recyclingFactor;

  // Apply reductions for sustainable practices
  if (minimizesWaste) {
    emissions *= (1 - EMISSION_FACTORS.WASTE_MINIMIZATION_REDUCTION);
  }

  if (avoidsPlastic) {
    emissions *= (1 - EMISSION_FACTORS.PLASTIC_AVOIDANCE_REDUCTION);
  }

  return emissions;
};

export const convertToMetricTons = (kgCO2: number): number => {
  return kgCO2 * EMISSION_FACTORS.KG_TO_METRIC_TONS;
};

// Total carbon footprint calculation
export const calculateTotalFootprint = (
  homeEmissions: number,
  transportEmissions: number,
  foodEmissions: number,
  wasteEmissions: number
): number => {
  const totalKgCO2 = homeEmissions + transportEmissions + foodEmissions + wasteEmissions;
  return convertToMetricTons(totalKgCO2);
};

// US average for comparison (in metric tons CO2e)
export const US_AVERAGE_FOOTPRINT = 16; // metric tons per person per year

// Global average for comparison (in metric tons CO2e)
export const GLOBAL_AVERAGE_FOOTPRINT = 4.8; // metric tons per person per year

// Sustainability target (in metric tons CO2e)
export const SUSTAINABILITY_TARGET = 2.0; // metric tons per person per year

// Insights based on emissions data
export const generateInsights = (results: {
  homeEmissions: number,
  transportEmissions: number,
  foodEmissions: number,
  wasteEmissions: number,
  totalFootprint: number,
  comparedToUS: number,
}) => {
  const insights = [];
  
  // Home energy insights
  if (convertToMetricTons(results.homeEmissions) > 2) {
    insights.push("Your home energy usage is above average. Consider energy efficiency upgrades or renewable energy options.");
  } else {
    insights.push("Great job on managing your home energy emissions!");
  }
  
  // Transportation insights
  if (convertToMetricTons(results.transportEmissions) > 3) {
    insights.push("Your transportation emissions are significant. Consider carpooling, public transit, or an electric vehicle.");
  } else {
    insights.push("You're doing well on transportation emissions!");
  }
  
  // Food insights
  if (convertToMetricTons(results.foodEmissions) > 1.5) {
    insights.push("Consider reducing meat consumption and buying more local food to lower your diet emissions.");
  } else {
    insights.push("Your dietary choices are already helping the planet!");
  }
  
  // Waste insights
  if (convertToMetricTons(results.wasteEmissions) > 0.8) {
    insights.push("Focus on reducing waste, increasing recycling, and avoiding single-use plastics.");
  } else {
    insights.push("You're effectively managing your waste emissions!");
  }
  
  // Overall insights
  if (results.comparedToUS < 50) {
    insights.push("Your carbon footprint is well below the US average - great work!");
  } else if (results.comparedToUS > 120) {
    insights.push("Your carbon footprint is above the US average. There are several areas where you could reduce your impact.");
  }
  
  return insights;
};
