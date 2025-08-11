const { PersonalityService } = require('./api/services/personalityService');

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

async function testApiIntegration() {
  try {
    console.log('🧪 Testing API Integration with ImpactMetricAndEquivalence...\n');
    
    const service = new PersonalityService();
    
    console.log('📊 Test Responses:');
    console.log(JSON.stringify(testResponses, null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Test the full personality calculation
    console.log('🔄 Testing full personality calculation...');
    const result = await service.calculatePersonality(testResponses);
    
    console.log('✅ Full Result:');
    console.log('Personality Type:', result.personalityType);
    console.log('Description:', result.description);
    console.log('Final Score:', result.finalScore);
    
    console.log('\n📊 Impact Metrics:');
    console.log(JSON.stringify(result.impactMetrics, null, 2));
    
    console.log('\n🌍 Impact Metric And Equivalence:');
    if (result.impactMetricAndEquivalence) {
      console.log('✅ Field is present!');
      console.log('Total Emissions (kg):', result.impactMetricAndEquivalence.emissionsKg.total);
      console.log('Per Person (kg):', result.impactMetricAndEquivalence.emissionsKg.perPerson);
      console.log('Total Equivalences:');
      console.log('  - Car km:', result.impactMetricAndEquivalence.equivalences.impact.total.km);
      console.log('  - T-shirts:', result.impactMetricAndEquivalence.equivalences.impact.total.tshirts);
      console.log('  - Coffee cups:', result.impactMetricAndEquivalence.equivalences.impact.total.coffeeCups);
      console.log('  - Burgers:', result.impactMetricAndEquivalence.equivalences.impact.total.burgers);
      console.log('  - Flights:', result.impactMetricAndEquivalence.equivalences.impact.total.flights);
      console.log('Total Avoided (tree years):', result.impactMetricAndEquivalence.equivalences.avoided.total.treeYears);
    } else {
      console.log('❌ Field is missing!');
    }
    
    console.log('\n🎉 API integration test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error(error.stack);
  }
}

// Run the test
testApiIntegration();
