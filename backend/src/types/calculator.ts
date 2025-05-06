export interface WasteState {
  recyclingPercentage: number;
  wastePrevention: 'A' | 'B' | 'C';
  wasteManagement: 'A' | 'B' | 'C';
}

export interface CalculatorState {
  homeEfficiency: 'A' | 'B' | 'C';
  energyManagement: 'A' | 'B' | 'C';
  usesRenewableEnergy: boolean;
  hasEnergyEfficiencyUpgrades: boolean;
  primaryTransportMode: 'A' | 'B' | 'C';
  carProfile: 'A' | 'B' | 'C';
  dietType: 'VEGAN' | 'VEGETARIAN' | 'FLEXITARIAN' | 'OMNIVORE';
  buysLocalFood: boolean;
  followsSustainableDiet: boolean;
  waste: WasteState;
} 