const { ImpactMetricAndEquivalenceService } = require('./api/services/impactMetricAndEquivalenceService');

// Mock user responses for testing
const testResponses = {
  name: "Test User",
  email: "test@example.com",
  age: "25",
  gender: "female",
  profession: "Software Engineer",
  location: "Lahore",
  country: "Pakistan",
  householdSize: "2",
  
  // Home Energy
  homeSize: "3",
  homeEfficiency: "A", // Energy Efficient
  energyManagement: "B", // Mixed Sources
  
  // Transportation
  primaryTransportMode: "B", // Public Transit
  carProfile: "B", // Hybrid Vehicle
  weeklyKm: "50",
  longDistanceTravel: "A", // Rail and Bus
  
  // Food & Diet
  dietType: "FLEXITARIAN",
  plateProfile: "A", // Local & Seasonal
  monthlyDiningOut: "B", // 1-4 times a month
  plantBasedMealsPerWeek: "12",
  
  // Waste
  waste: {
    prevention: "A", // Always avoid
    smartShopping: "A", // Minimal packaging
    dailyWaste: "A", // Almost empty
    repairOrReplace: "A" // Always repair
  },
  
  // Clothing
  clothing: {
    wardrobeImpact: "A", // Minimal wardrobe
    mindfulUpgrades: "A", // Sustainable brands
    durability: "A", // Long-lasting items
    consumptionFrequency: "A", // Infrequent shopper
    brandLoyalty: "A" // Brand conscious
  }
};

async function testImpactMetricAndEquivalence() {
  try {
    console.log('🧪 Testing ImpactMetricAndEquivalenceService...\n');
    
    const service = new ImpactMetricAndEquivalenceService();
    
    console.log('📊 Test Responses:');
    console.log(JSON.stringify(testResponses, null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Test with conventional reference policy
    console.log('🔄 Testing with conventional reference policy...');
    const result = service.calculateImpactMetricAndEquivalence(
      testResponses,
      undefined, // categoryEmissionsKg
      'conventional', // referencePolicy
      undefined, // cohortAveragesKg
      'clean', // rounding
      'en' // copyLocale
    );
    
    console.log('✅ Result:');
    console.log(JSON.stringify(result, null, 2));
    
    // Test with cohort reference policy
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('🔄 Testing with cohort reference policy...');
    
    const cohortAverages = {
      home: 1800,
      transport: 2600,
      food: 2200,
      clothing: 900,
      waste: 300
    };
    
    const cohortResult = service.calculateImpactMetricAndEquivalence(
      testResponses,
      undefined, // categoryEmissionsKg
      'cohort', // referencePolicy
      cohortAverages, // cohortAveragesKg
      'precise', // rounding
      'en' // copyLocale
    );
    
    console.log('✅ Cohort Result:');
    console.log(JSON.stringify(cohortResult, null, 2));
    
    // Test with provided category emissions
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('🔄 Testing with provided category emissions...');
    
    const providedEmissions = {
      home: 1200,
      transport: 1800,
      food: 1500,
      clothing: 600,
      waste: 200
    };
    
    const providedResult = service.calculateImpactMetricAndEquivalence(
      testResponses,
      providedEmissions, // categoryEmissionsKg
      'conventional', // referencePolicy
      undefined, // cohortAveragesKg
      'clean', // rounding
      'en' // copyLocale
    );
    
    console.log('✅ Provided Emissions Result:');
    console.log(JSON.stringify(providedResult, null, 2));
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error(error.stack);
  }
}

// Run the test
testImpactMetricAndEquivalence();
