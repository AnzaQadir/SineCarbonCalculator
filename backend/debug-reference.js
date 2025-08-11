const { ImpactMetricAndEquivalenceService } = require('./api/services/impactMetricAndEquivalenceService');

// Test with your exact emissions
const testResponses = {
  country: "Pakistan",
  householdSize: "1",
  
  // These should result in ~5,386 kg total
  homeSize: "3",
  homeEfficiency: "C",
  energyManagement: "C",
  
  primaryTransportMode: "C",
  carProfile: "C",
  weeklyKm: "200",
  longDistanceTravel: "B",
  
  dietType: "MEAT_MODERATE",
  plateProfile: "B",
  monthlyDiningOut: "B",
  plantBasedMealsPerWeek: "6",
  
  waste: {
    prevention: "B",
    smartShopping: "C",
    dailyWaste: "B",
    repairOrReplace: "C"
  },
  
  clothing: {
    wardrobeImpact: "B",
    mindfulUpgrades: "C",
    durability: "B",
    consumptionFrequency: "B",
    brandLoyalty: "C"
  }
};

async function debugReference() {
  try {
    console.log('🔍 Debugging Reference Calculation...\n');
    
    const service = new ImpactMetricAndEquivalenceService();
    
    // Test 1: Your current emissions
    console.log('📊 Test 1: Your Current Emissions');
    const currentResult = service.calculateImpactMetricAndEquivalence(
      testResponses,
      undefined,
      'conventional'
    );
    
    console.log('Current Emissions (kg):', currentResult.emissionsKg.total);
    console.log('Current Per Person (kg):', currentResult.emissionsKg.perPerson);
    
    // Test 2: Use provided emissions directly
    console.log('\n📊 Test 2: Using Provided Emissions');
    const providedEmissions = {
      home: 1339,
      transport: 3000,
      food: 264,
      clothing: 488,
      waste: 296
    };
    
    const providedResult = service.calculateImpactMetricAndEquivalence(
      testResponses,
      providedEmissions,
      'conventional'
    );
    
    console.log('Provided Emissions (kg):', providedResult.emissionsKg.total);
    console.log('Avoided Impact (tree years):', providedResult.equivalences.avoided.total.treeYears);
    
    // Test 3: Use cohort with realistic values
    console.log('\n📊 Test 3: Using Realistic Cohort Averages');
    const realisticCohort = {
      home: 2500,      // Higher than 1339
      transport: 4000,  // Higher than 3000
      food: 3000,       // Higher than 264
      clothing: 800,    // Higher than 488
      waste: 600        // Higher than 296
    };
    
    const cohortResult = service.calculateImpactMetricAndEquivalence(
      testResponses,
      providedEmissions, // Use your exact emissions
      'cohort',
      realisticCohort
    );
    
    console.log('Cohort Result - Avoided Impact (tree years):', cohortResult.equivalences.avoided.total.treeYears);
    console.log('Breakdown:');
    console.log('  - Home:', cohortResult.equivalences.avoided.home.treeYears);
    console.log('  - Transport:', cohortResult.equivalences.avoided.transport.treeYears);
    console.log('  - Food:', cohortResult.equivalences.avoided.food.treeYears);
    console.log('  - Clothing:', cohortResult.equivalences.avoided.clothing.treeYears);
    console.log('  - Waste:', cohortResult.equivalences.avoided.waste.treeYears);
    
    // Test 4: Manual calculation
    console.log('\n📊 Test 4: Manual Calculation');
    const totalAvoided = realisticCohort.home + realisticCohort.transport + 
                         realisticCohort.food + realisticCohort.clothing + realisticCohort.waste;
    const userTotal = providedEmissions.home + providedEmissions.transport + 
                      providedEmissions.food + providedEmissions.clothing + providedEmissions.waste;
    
    console.log('Cohort Total:', totalAvoided, 'kg');
    console.log('User Total:', userTotal, 'kg');
    console.log('Difference:', totalAvoided - userTotal, 'kg');
    console.log('Tree Years (16 kg/tree):', Math.round((totalAvoided - userTotal) / 16));
    
    console.log('\n🎯 Summary:');
    console.log('1. Your emissions: ~5,386 kg CO2e');
    console.log('2. Conventional reference is too low (shows 0 avoided)');
    console.log('3. Use cohort reference with values > 5,386 kg for meaningful avoided impact');
    console.log('4. Or use provided emissions with higher reference values');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    console.error(error.stack);
  }
}

// Run the debug
debugReference();
