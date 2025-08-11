# Impact Metric and Equivalence Service

## Overview

The Impact Metric and Equivalence Service is a new addition to the Carbon Calculator API that provides detailed carbon footprint calculations and relatable equivalences. This service implements the Zerrah system prompt for comprehensive impact assessment.

## Features

### 1. **Emissions Calculation**
- **Home Energy**: Based on home size, efficiency, and energy sources
- **Transport**: Surface transport, car profiles, and long-distance travel
- **Food**: Diet type, sourcing, dining patterns, and plant-based meal adjustments
- **Clothing**: Wardrobe approach, shopping frequency, quality, and sustainability
- **Waste**: Daily waste volume, diversion rates, and repair practices

### 2. **Equivalence Conversions**
All emissions are converted to relatable everyday equivalents:
- **Car kilometers driven**
- **T-shirts produced**
- **Coffee cups consumed**
- **Beef burgers eaten**
- **Medium-haul flights taken**

### 3. **Impact Avoided Calculations**
- **Conventional Reference**: Static baseline using standard high-emission practices
- **Cohort Reference**: Dynamic baseline using provided category averages
- **Tree Years**: Carbon sequestration equivalent in mature tree years

## API Integration

### New Field in `/calculate` API

The `impactMetricAndEquivalence` field is now included in the personality calculation response:

```typescript
interface PersonalityResponse {
  // ... existing fields ...
  impactMetricAndEquivalence?: ImpactMetricAndEquivalenceResponse;
  // ... existing fields ...
}
```

### Response Structure

```typescript
interface ImpactMetricAndEquivalenceResponse {
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
```

## Usage Examples

### Basic Usage

```typescript
import { ImpactMetricAndEquivalenceService } from './services/impactMetricAndEquivalenceService';

const service = new ImpactMetricAndEquivalenceService();

const result = service.calculateImpactMetricAndEquivalence(
  userResponses,
  undefined, // categoryEmissionsKg - let service calculate
  'conventional', // referencePolicy
  undefined, // cohortAveragesKg
  'clean', // rounding
  'en' // copyLocale
);
```

### With Pre-computed Emissions

```typescript
const categoryEmissions = {
  home: 1200,
  transport: 1800,
  food: 1500,
  clothing: 600,
  waste: 200
};

const result = service.calculateImpactMetricAndEquivalence(
  userResponses,
  categoryEmissions, // Use provided emissions
  'conventional'
);
```

### With Cohort Reference

```typescript
const cohortAverages = {
  home: 1800,
  transport: 2600,
  food: 2200,
  clothing: 900,
  waste: 300
};

const result = service.calculateImpactMetricAndEquivalence(
  userResponses,
  undefined,
  'cohort', // Use cohort reference
  cohortAverages
);
```

## Regional Adaptations

### Grid Factors (kg CO2e per kWh)
- Pakistan: 0.45
- USA: 0.38
- UK: 0.18
- Germany: 0.32
- UAE: 0.56
- India: 0.67

### Tree Sequestration (kg CO2 per year)
- Temperate: 21
- Mediterranean: 19
- Arid/Semi-arid: 16
- Tropical: 20

## Constants and Factors

### Transport Factors
- Electric Vehicle: 0.18 × grid factor
- Hybrid: 0.14 kg/km
- Standard: 0.20 kg/km
- Large/Luxury: 0.26 kg/km
- Public Transit: 0.08 kg/km
- Active Transport: 0 kg/km

### Food Factors
- Vegan: 1000 kg/year
- Vegetarian: 1300 kg/year
- Flexitarian: 2000 kg/year
- Moderate Meat: 3000 kg/year
- Meat Heavy: 4500 kg/year

### Clothing Factors
- Minimal Wardrobe: 5 items/year
- Balanced Collection: 15 items/year
- Extensive Wardrobe: 40 items/year
- Per-item embodied carbon: 25 kg

### Waste Factors
- Landfill factor: 0.45 kg CO2e/kg waste
- Diversion rates: 0-95% based on practices
- Repair savings: 0-80 kg/year based on habits

## Testing

### Run Service Tests
```bash
node test-impact-metric-equivalence.js
```

### Run API Integration Tests
```bash
node test-api-integration.js
```

### Run Full Build
```bash
npm run build
```

## Implementation Notes

1. **Backward Compatibility**: The new field is optional and doesn't break existing API consumers
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Performance**: Efficient calculations with configurable rounding
4. **Localization**: Support for different locales and presentation preferences
5. **Extensibility**: Easy to add new categories or equivalence types

## Future Enhancements

- Additional equivalence types (e.g., smartphone production, plastic bottles)
- More granular regional factors
- Seasonal adjustments for heating/cooling
- Integration with real-time energy grid data
- Machine learning for more accurate personalization

## Contributing

When adding new features:
1. Update the constants in the service
2. Add corresponding tests
3. Update the TypeScript interfaces
4. Document the changes in this README
5. Ensure backward compatibility

## References

- Zerrah System Prompt for Impact & Equivalence Generation
- IPCC emission factors
- Regional energy grid data
- Life cycle assessment studies for consumer products
