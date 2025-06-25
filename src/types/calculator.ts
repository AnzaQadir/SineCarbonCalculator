
export interface FootprintResults {
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

export interface FootprintResults1 {
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
