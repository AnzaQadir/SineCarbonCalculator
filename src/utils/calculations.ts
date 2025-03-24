
// CO2 emission factors in kg CO2e
export const EMISSION_FACTORS = {
  // Home energy
  ELECTRICITY_KWH: 0.429, // kg CO2e per kWh
  NATURAL_GAS_THERM: 5.3, // kg CO2e per therm
  HEATING_OIL_GALLON: 10.16, // kg CO2e per gallon
  PROPANE_GALLON: 5.76, // kg CO2e per gallon

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

  // Waste
  WASTE_LB: 0.94, // kg CO2e per pound of waste
  RECYCLING_REDUCTION: 0.3, // 30% reduction for recycling

  // Food
  FOOD_DIET: {
    MEAT_HEAVY: 3.3, // kg CO2e per day
    AVERAGE: 2.5, // kg CO2e per day
    VEGETARIAN: 1.7, // kg CO2e per day
    VEGAN: 1.5, // kg CO2e per day
  },

  // General conversion factors
  KG_TO_METRIC_TONS: 0.001,
  LBS_TO_KG: 0.453592,
  KWH_TO_MWH: 0.001,
};

export const calculateHomeEmissions = (
  electricityKwh: number,
  naturalGasTherm: number,
  heatingOilGallons: number,
  propaneGallons: number
): number => {
  return (
    electricityKwh * EMISSION_FACTORS.ELECTRICITY_KWH +
    naturalGasTherm * EMISSION_FACTORS.NATURAL_GAS_THERM +
    heatingOilGallons * EMISSION_FACTORS.HEATING_OIL_GALLON +
    propaneGallons * EMISSION_FACTORS.PROPANE_GALLON
  );
};

export const calculateTransportEmissions = (
  carType: keyof typeof EMISSION_FACTORS.CAR_MILE,
  carMiles: number,
  flightType: keyof typeof EMISSION_FACTORS.FLIGHT_MILE,
  flightMiles: number,
  transitType: keyof typeof EMISSION_FACTORS.PUBLIC_TRANSIT_MILE,
  transitMiles: number
): number => {
  return (
    carMiles * EMISSION_FACTORS.CAR_MILE[carType] +
    flightMiles * EMISSION_FACTORS.FLIGHT_MILE[flightType] +
    transitMiles * EMISSION_FACTORS.PUBLIC_TRANSIT_MILE[transitType]
  );
};

export const calculateFoodEmissions = (
  dietType: keyof typeof EMISSION_FACTORS.FOOD_DIET
): number => {
  // Annual emissions based on daily diet type
  return EMISSION_FACTORS.FOOD_DIET[dietType] * 365;
};

export const calculateWasteEmissions = (
  wasteLbs: number,
  recyclingPercentage: number
): number => {
  // Apply recycling reduction factor
  const recyclingFactor = 1 - (recyclingPercentage / 100) * EMISSION_FACTORS.RECYCLING_REDUCTION;
  return wasteLbs * EMISSION_FACTORS.WASTE_LB * recyclingFactor;
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
