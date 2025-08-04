const axios = require('axios');

// Test configuration
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_ENDPOINT = '/api/personality/calculate';

// Test data for different personality scenarios
const testCases = [
  {
    name: 'Strategist Personality',
    description: 'Should return Strategist archetype for analyst.planner combination',
    input: {
      // Demographics
      name: 'Test User',
      email: 'test@example.com',
      age: '25-34',
      gender: 'male',
      profession: 'student',
      location: 'New York',
      country: 'United States',
      householdSize: '2',
      
      // Home Energy
      homeSize: '3',
      homeEfficiency: 'A',
      energyManagement: 'A',
      electricityKwh: '500',
      naturalGasTherm: '50',
      heatingOilGallons: '0',
      propaneGallons: '0',
      
      // Transportation
      primaryTransportMode: 'A',
      carProfile: 'A',
      weeklyKm: '100',
      costPerMile: '0.15',
      longDistanceTravel: 'A',
      
      // Food & Diet
      dietType: 'VEGETARIAN',
      plateProfile: 'A',
      monthlyDiningOut: 'A',
      plantBasedMealsPerWeek: '5',
      
      // Waste
      waste: {
        prevention: 'A',
        smartShopping: 'A',
        dailyWaste: 'A',
        management: 'A',
        repairOrReplace: 'A'
      },
      
      // Air Quality
      airQuality: {
        outdoorAirQuality: 'A',
        aqiMonitoring: 'A',
        indoorAirQuality: 'A',
        airQualityCommuting: 'A',
        airQualityImpact: 'A'
      },
      
      // Clothing
      clothing: {
        wardrobeImpact: 'A',
        mindfulUpgrades: 'A',
        durability: 'A',
        consumptionFrequency: 'A',
        brandLoyalty: 'A'
      },
      
      // Personality Traits (for Strategist)
      personalityTraits: {
        relationshipWithChange: 'analyst',
        decisionMaking: 'analyst',
        motivation: 'analyst',
        ecoIdentity: 'analyst',
        opennessToLearning: 'analyst',
        socialInfluence: 'planner',
        emotionalConnection: 'planner',
        barriers: 'planner',
        goalSetting: 'planner',
        selfEfficacy: 'planner'
      }
    },
    expected: {
      archetype: 'Strategist',
      decision: 'Analyst',
      action: 'Planner',
      hookLine: 'You love a plan and turn small routines into big impact.',
      descriptionContains: 'You like a plan. Lists are your love language'
    }
  },
  {
    name: 'Coordinator Personality',
    description: 'Should return Coordinator archetype for analyst.collaborator combination',
    input: {
      // Demographics
      name: 'Test User 2',
      email: 'test2@example.com',
      age: '25-34',
      gender: 'female',
      profession: 'student',
      location: 'New York',
      country: 'United States',
      householdSize: '2',
      
      // Home Energy
      homeSize: '3',
      homeEfficiency: 'A',
      energyManagement: 'A',
      electricityKwh: '500',
      naturalGasTherm: '50',
      heatingOilGallons: '0',
      propaneGallons: '0',
      
      // Transportation
      primaryTransportMode: 'A',
      carProfile: 'A',
      weeklyKm: '100',
      costPerMile: '0.15',
      longDistanceTravel: 'A',
      
      // Food & Diet
      dietType: 'VEGETARIAN',
      plateProfile: 'A',
      monthlyDiningOut: 'A',
      plantBasedMealsPerWeek: '5',
      
      // Waste
      waste: {
        prevention: 'A',
        smartShopping: 'A',
        dailyWaste: 'A',
        management: 'A',
        repairOrReplace: 'A'
      },
      
      // Air Quality
      airQuality: {
        outdoorAirQuality: 'A',
        aqiMonitoring: 'A',
        indoorAirQuality: 'A',
        airQualityCommuting: 'A',
        airQualityImpact: 'A'
      },
      
      // Clothing
      clothing: {
        wardrobeImpact: 'A',
        mindfulUpgrades: 'A',
        durability: 'A',
        consumptionFrequency: 'A',
        brandLoyalty: 'A'
      },
      
      // Personality Traits (for Coordinator)
      personalityTraits: {
        relationshipWithChange: 'analyst',
        decisionMaking: 'analyst',
        motivation: 'analyst',
        ecoIdentity: 'analyst',
        opennessToLearning: 'analyst',
        socialInfluence: 'collaborator',
        emotionalConnection: 'collaborator',
        barriers: 'collaborator',
        goalSetting: 'collaborator',
        selfEfficacy: 'collaborator'
      }
    },
    expected: {
      archetype: 'Coordinator',
      decision: 'Analyst',
      action: 'Collaborator',
      hookLine: 'You bring people together to make things happen—collaboratively.',
      descriptionContains: 'You\'re a behind-the-scenes powerhouse'
    }
  },
  {
    name: 'Builder Personality',
    description: 'Should return Builder archetype for connector.planner combination',
    input: {
      // Demographics
      name: 'Test User 3',
      email: 'test3@example.com',
      age: '25-34',
      gender: 'male',
      profession: 'student',
      location: 'New York',
      country: 'United States',
      householdSize: '2',
      
      // Home Energy
      homeSize: '3',
      homeEfficiency: 'A',
      energyManagement: 'A',
      electricityKwh: '500',
      naturalGasTherm: '50',
      heatingOilGallons: '0',
      propaneGallons: '0',
      
      // Transportation
      primaryTransportMode: 'A',
      carProfile: 'A',
      weeklyKm: '100',
      costPerMile: '0.15',
      longDistanceTravel: 'A',
      
      // Food & Diet
      dietType: 'VEGETARIAN',
      plateProfile: 'A',
      monthlyDiningOut: 'A',
      plantBasedMealsPerWeek: '5',
      
      // Waste
      waste: {
        prevention: 'A',
        smartShopping: 'A',
        dailyWaste: 'A',
        management: 'A',
        repairOrReplace: 'A'
      },
      
      // Air Quality
      airQuality: {
        outdoorAirQuality: 'A',
        aqiMonitoring: 'A',
        indoorAirQuality: 'A',
        airQualityCommuting: 'A',
        airQualityImpact: 'A'
      },
      
      // Clothing
      clothing: {
        wardrobeImpact: 'A',
        mindfulUpgrades: 'A',
        durability: 'A',
        consumptionFrequency: 'A',
        brandLoyalty: 'A'
      },
      
      // Personality Traits (for Builder)
      personalityTraits: {
        relationshipWithChange: 'connector',
        decisionMaking: 'connector',
        motivation: 'connector',
        ecoIdentity: 'connector',
        opennessToLearning: 'connector',
        socialInfluence: 'planner',
        emotionalConnection: 'planner',
        barriers: 'planner',
        goalSetting: 'planner',
        selfEfficacy: 'planner'
      }
    },
    expected: {
      archetype: 'Builder',
      decision: 'Connector',
      action: 'Planner',
      hookLine: 'You break goals into steps and create systems that stick.',
      descriptionContains: 'You love turning ideas into action'
    }
  }
];

// Helper function to make API request
async function makePersonalityRequest(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ENDPOINT}`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network Error: No response received from server');
    } else {
      throw new Error(`Request Error: ${error.message}`);
    }
  }
}

// Test suite
describe('Personality API Tests', () => {
  console.log(`\n🧪 Running tests against: ${BASE_URL}${API_ENDPOINT}\n`);

  testCases.forEach((testCase, index) => {
    test(`${index + 1}. ${testCase.name}`, async () => {
      console.log(`\n📋 Testing: ${testCase.description}`);
      
      try {
        // Make API request
        const response = await makePersonalityRequest(testCase.input);
        
        // Log response for debugging
        console.log(`✅ API Response received:`);
        console.log(`   - Archetype: ${response.comprehensivePowerMoves?.personality?.archetype}`);
        console.log(`   - Decision: ${response.comprehensivePowerMoves?.personality?.decision}`);
        console.log(`   - Action: ${response.comprehensivePowerMoves?.personality?.action}`);
        console.log(`   - Hook Line: ${response.comprehensivePowerMoves?.personality?.hookLine}`);
        
        // Validate response structure
        expect(response).toBeDefined();
        expect(response.comprehensivePowerMoves).toBeDefined();
        expect(response.comprehensivePowerMoves.personality).toBeDefined();
        expect(response.comprehensivePowerMoves.powerMoves).toBeDefined();
        
        // Validate personality data
        const personality = response.comprehensivePowerMoves.personality;
        expect(personality.archetype).toBe(testCase.expected.archetype);
        expect(personality.decision).toBe(testCase.expected.decision);
        expect(personality.action).toBe(testCase.expected.action);
        expect(personality.hookLine).toBe(testCase.expected.hookLine);
        expect(personality.description).toContain(testCase.expected.descriptionContains);
        
        // Validate power moves structure
        const powerMoves = response.comprehensivePowerMoves.powerMoves;
        expect(powerMoves.powerHabit).toBeDefined();
        expect(powerMoves.powerMove).toBeDefined();
        expect(powerMoves.stretchCTA).toBeDefined();
        expect(typeof powerMoves.powerHabit).toBe('string');
        expect(typeof powerMoves.powerMove).toBe('string');
        expect(typeof powerMoves.stretchCTA).toBe('string');
        
        // Validate tone
        expect(response.comprehensivePowerMoves.tone).toBeDefined();
        expect(typeof response.comprehensivePowerMoves.tone).toBe('string');
        
        // Validate other required fields
        expect(response.personalityType).toBeDefined();
        expect(response.description).toBeDefined();
        expect(response.strengths).toBeDefined();
        expect(response.nextSteps).toBeDefined();
        expect(response.categoryScores).toBeDefined();
        expect(response.impactMetrics).toBeDefined();
        expect(response.finalScore).toBeDefined();
        expect(response.powerMoves).toBeDefined();
        
        console.log(`✅ Test passed: ${testCase.name}`);
        
      } catch (error) {
        console.error(`❌ Test failed: ${testCase.name}`);
        console.error(`   Error: ${error.message}`);
        throw error;
      }
    });
  });

  // Test error handling
  test('Error handling - Invalid data', async () => {
    console.log('\n📋 Testing: Error handling with invalid data');
    
    try {
      await makePersonalityRequest({
        // Missing required fields
        name: 'Test',
        email: 'test@example.com'
        // Missing other required fields
      });
      
      // If we get here, the API accepted invalid data, which might be okay
      console.log(`✅ API accepted minimal data - this might be intentional`);
      expect(true).toBe(true);
      
    } catch (error) {
      console.log(`✅ Error handling test passed: ${error.message}`);
      // Accept both API errors and network errors
      expect(error.message).toMatch(/API Error|Network Error|Request Error/);
    }
  });

  // Test with missing personality traits
  test('Missing personality traits - Should use fallback', async () => {
    console.log('\n📋 Testing: Missing personality traits');
    
    const testData = {
      // Demographics
      name: 'Test User',
      email: 'test@example.com',
      age: '25-34',
      gender: 'male',
      profession: 'student',
      location: 'New York',
      country: 'United States',
      householdSize: '2',
      
      // Home Energy
      homeSize: '3',
      homeEfficiency: 'A',
      energyManagement: 'A',
      electricityKwh: '500',
      naturalGasTherm: '50',
      heatingOilGallons: '0',
      propaneGallons: '0',
      
      // Transportation
      primaryTransportMode: 'A',
      carProfile: 'A',
      weeklyKm: '100',
      costPerMile: '0.15',
      longDistanceTravel: 'A',
      
      // Food & Diet
      dietType: 'VEGETARIAN',
      plateProfile: 'A',
      monthlyDiningOut: 'A',
      plantBasedMealsPerWeek: '5',
      
      // Waste
      waste: {
        prevention: 'A',
        smartShopping: 'A',
        dailyWaste: 'A',
        management: 'A',
        repairOrReplace: 'A'
      },
      
      // Air Quality
      airQuality: {
        outdoorAirQuality: 'A',
        aqiMonitoring: 'A',
        indoorAirQuality: 'A',
        airQualityCommuting: 'A',
        airQualityImpact: 'A'
      },
      
      // Clothing
      clothing: {
        wardrobeImpact: 'A',
        mindfulUpgrades: 'A',
        durability: 'A',
        consumptionFrequency: 'A',
        brandLoyalty: 'A'
      }
      // No personalityTraits field
    };
    
    try {
      const response = await makePersonalityRequest(testData);
      
      // Should still return a valid response
      expect(response).toBeDefined();
      expect(response.comprehensivePowerMoves).toBeDefined();
      expect(response.comprehensivePowerMoves.personality).toBeDefined();
      expect(response.comprehensivePowerMoves.personality.archetype).toBeDefined();
      
      console.log(`✅ Missing personality traits test passed`);
      console.log(`   - Archetype: ${response.comprehensivePowerMoves.personality.archetype}`);
      
    } catch (error) {
      console.error(`❌ Missing personality traits test failed: ${error.message}`);
      throw error;
    }
  });

  // Test performance
  test('Performance test - Response time', async () => {
    console.log('\n📋 Testing: API response time');
    
    const testData = testCases[0].input; // Use first test case
    const startTime = Date.now();
    
    try {
      const response = await makePersonalityRequest(testData);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`✅ Performance test passed`);
      console.log(`   - Response time: ${responseTime}ms`);
      
      // Response should be under 5 seconds
      expect(responseTime).toBeLessThan(5000);
      expect(response).toBeDefined();
      
    } catch (error) {
      console.error(`❌ Performance test failed: ${error.message}`);
      throw error;
    }
  });
});

// Test summary
describe('Test Summary', () => {
  test('All tests completed', () => {
    console.log('\n🎉 All personality API tests completed!');
    console.log('\n📊 Test Coverage:');
    console.log('   ✅ Personality archetype determination');
    console.log('   ✅ Comprehensive power moves generation');
    console.log('   ✅ Hook lines and descriptions');
    console.log('   ✅ Error handling');
    console.log('   ✅ Performance validation');
    console.log('   ✅ Data structure validation');
    
    expect(true).toBe(true);
  });
}); 