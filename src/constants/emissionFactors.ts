
// Emission factors and constants
export const EMISSION_FACTORS = {
  electricity: {
    LOW: 0.3,
    MEDIUM: 0.4,
    HIGH: 0.5,
  },
  heating: {
    ELECTRIC: 0.4,
    GAS: 0.2,
    OIL: 0.7,
    RENEWABLE: 0.05,
  },
  transport: {
    WALK_BIKE: 0,
    PUBLIC: 0.14,
    HYBRID: 0.1,
    ELECTRIC: 0.05,
    SMALL_CAR: 0.15,
    MEDIUM_CAR: 0.2,
    LARGE_CAR: 0.3,
  },
  diet: {
    VEGAN: 1.5,
    VEGETARIAN: 2.0,
    FLEXITARIAN: 2.5,
    MEAT_MODERATE: 3.0,
    MEAT_HEAVY: 4.0,
  },
  waste: {
    LOW: 0.1,
    MEDIUM: 0.2,
    HIGH: 0.3,
  },
  fashion: {
    MINIMAL: 0.5,
    MODERATE: 1.0,
    FREQUENT: 2.0,
  }
};
