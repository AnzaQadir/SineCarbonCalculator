export interface CategoryEmissionsKg {
  home?: number | null;
  transport?: number | null;
  food?: number | null;
  clothing?: number | null;
  waste?: number | null;
}

export interface EquivalenceData {
  km: number;
  tshirts: number;
  coffeeCups: number;
  burgers: number;
  flights: number;
}

export interface AvoidedEquivalenceData extends EquivalenceData {
  treeYears: number;
}

export interface ImpactMetricAndEquivalenceResponse {
  emissionsKg: {
    home: number;
    transport: number;
    food: number;
    clothing: number;
    waste: number;
    total: number;
    perPerson: number;
  };
  equivalences: {
    impact: {
      home: EquivalenceData;
      transport: EquivalenceData;
      food: EquivalenceData;
      clothing: EquivalenceData;
      waste: EquivalenceData;
      total: EquivalenceData;
    };
    avoided: {
      home: AvoidedEquivalenceData;
      transport: AvoidedEquivalenceData;
      food: AvoidedEquivalenceData;
      clothing: AvoidedEquivalenceData;
      waste: AvoidedEquivalenceData;
      total: AvoidedEquivalenceData;
    };
  };
  metadata: {
    constantsUsed: {
      gridKgPerKwh: number;
      carKgPerKm: number;
      coffeeKgPerCup: number;
      burgerKgPerBurger: number;
      tshirtKgPerItem: number;
      treeKgPerYear: number;
      flightKgPerFlight: number;
    };
    referencePolicy: string;
    notes: string[];
  };
}
