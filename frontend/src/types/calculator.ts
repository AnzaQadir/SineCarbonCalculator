export interface CalculatorState {
  name?: string;
  homeEfficiency?: 'A' | 'B' | 'C';
  energyManagement?: 'A' | 'B' | 'C';
  usesRenewableEnergy?: boolean;
  hasEnergyEfficiencyUpgrades?: boolean;
  primaryTransportMode?: 'A' | 'B' | 'C' | 'D';
  carProfile?: 'A' | 'B' | 'C' | 'D' | 'E';
  dietType?: 'VEGAN' | 'VEGETARIAN' | 'FLEXITARIAN' | 'MODERATE_MEAT';
  foodSource?: 'LOCAL_SEASONAL' | 'MIXED' | 'CONVENTIONAL';
  waste?: {
    recyclingPercentage?: number;
    wastePrevention?: 'A' | 'B' | 'C';
    wasteManagement?: 'A' | 'B' | 'C';
    minimizesWaste?: boolean;
  };
  airQuality?: {
    aqiMonitoring?: 'A' | 'B' | 'C' | 'D';
    airQualityImpact?: 'A' | 'B' | 'C' | 'D';
  };
  clothing?: {
    wardrobeImpact?: 'A' | 'B' | 'C';
    mindfulUpgrades?: 'A' | 'B' | 'C';
    consumptionFrequency?: 'A' | 'B' | 'C' | 'D';
    brandLoyalty?: 'A' | 'B' | 'C' | 'D';
  };
} 