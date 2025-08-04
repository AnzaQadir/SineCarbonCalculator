// Jest setup file for personality API tests

// Set test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Helper to create test data
  createTestData: (overrides = {}) => ({
    name: 'Test User',
    email: 'test@example.com',
    age: '25-34',
    gender: 'male',
    profession: 'student',
    location: 'New York',
    country: 'United States',
    householdSize: '2',
    homeSize: '3',
    homeEfficiency: 'A',
    energyManagement: 'A',
    electricityKwh: '500',
    naturalGasTherm: '50',
    heatingOilGallons: '0',
    propaneGallons: '0',
    primaryTransportMode: 'A',
    carProfile: 'A',
    weeklyKm: '100',
    costPerMile: '0.15',
    longDistanceTravel: 'A',
    dietType: 'VEGETARIAN',
    plateProfile: 'A',
    monthlyDiningOut: 'A',
    plantBasedMealsPerWeek: '5',
    waste: {
      prevention: 'A',
      smartShopping: 'A',
      dailyWaste: 'A',
      management: 'A',
      repairOrReplace: 'A'
    },
    airQuality: {
      outdoorAirQuality: 'A',
      aqiMonitoring: 'A',
      indoorAirQuality: 'A',
      airQualityCommuting: 'A',
      airQualityImpact: 'A'
    },
    clothing: {
      wardrobeImpact: 'A',
      mindfulUpgrades: 'A',
      durability: 'A',
      consumptionFrequency: 'A',
      brandLoyalty: 'A'
    },
    ...overrides
  }),

  // Helper to validate personality response
  validatePersonalityResponse: (response, expectedArchetype) => {
    expect(response).toBeDefined();
    expect(response.comprehensivePowerMoves).toBeDefined();
    expect(response.comprehensivePowerMoves.personality).toBeDefined();
    expect(response.comprehensivePowerMoves.personality.archetype).toBe(expectedArchetype);
    expect(response.comprehensivePowerMoves.powerMoves).toBeDefined();
    expect(response.comprehensivePowerMoves.tone).toBeDefined();
  }
};

// Environment variables for testing
process.env.NODE_ENV = 'test';
process.env.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; 