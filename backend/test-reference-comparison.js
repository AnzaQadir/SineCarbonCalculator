const { ImpactMetricAndEquivalenceService } = require('./api/services/impactMetricAndEquivalenceService');

// Mock user responses that match your output
const testResponses = {
  name: "Test User",
  email: "test@example.com",
  country: "Pakistan",
  householdSize: "1",
  
  // Home Energy
  homeSize: "3",
  homeEfficiency: "C", // Standard Home
  energyManagement: "C", // Traditional Grid
  
  // Transportation
  primaryTransportMode: "C", // Personal Vehicle
  carProfile: "C", // Standard Vehicle
  weeklyKm: "200",
  longDistanceTravel: "B", // Mix of Flights & Trains
  
  // Food & Diet
  dietType: "MEAT_MODERATE",
  plateProfile: "B", // Mixed Sources
  monthlyDiningOut: "B", // 1-4 times a month
  plantBasedMealsPerWeek: "6",
  
  // Waste
  waste: {
    prevention: "B", // Sometimes reuse
    smartShopping: "C", // Convenience packaging
    dailyWaste: "B", // Half full
    repairOrReplace: "C" // Usually replace
  },
  
  // Clothing
  clothing: {
    wardrobeImpact: "B", // Balanced Collection
    mindfulUpgrades: "C", // Conventional Shopping
    durability: "B", // Mixed Quality
    consumptionFrequency: "B", // Seasonal Shopper
    brandLoyalty: "C" // Style and fit
  }
};

async function testReferenceComparison() {
  try {
    console.log('🧪 Testing Reference Comparison...\n');
    
    const service = new ImpactMetricAndEquivalenceService();
    
    console.log('📊 Test Responses:');
    console.log(JSON.stringify(testResponses, null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Test with conventional reference policy
    console.log('🔄 Testing with conventional reference policy...');
    const conventionalResult = service.calculateImpactMetricAndEquivalence(
      testResponses,
      undefined,
      'conventional'
    );
    
    console.log('✅ Conventional Reference Result:');
    console.log('User Emissions (kg):', conventionalResult.emissionsKg.total);
    console.log('Avoided Impact:');
    console.log('  - Home:', conventionalResult.equivalences.avoided.home.treeYears, 'tree years');
    console.log('  - Transport:', conventionalResult.equivalences.avoided.transport.treeYears, 'tree years');
    console.log('  - Food:', conventionalResult.equivalences.avoided.food.treeYears, 'tree years');
    console.log('  - Clothing:', conventionalResult.equivalences.avoided.clothing.treeYears, 'tree years');
    console.log('  - Waste:', conventionalResult.equivalences.avoided.waste.treeYears, 'tree years');
    console.log('  - Total:', conventionalResult.equivalences.avoided.total.treeYears, 'tree years');
    
    // Test with higher cohort reference
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('🔄 Testing with higher cohort reference...');
    
    const higherCohortAverages = {
      home: 3000,      // Higher than user's emissions
      transport: 5000,  // Higher than user's emissions
      food: 4000,       // Higher than user's emissions
      clothing: 1000,   // Higher than user's emissions
      waste: 800        // Higher than user's emissions
    };
    
    const cohortResult = service.calculateImpactMetricAndEquivalence(
      testResponses,
      undefined,
      'cohort',
      higherCohortAverages
    );
    
    console.log('✅ Higher Cohort Reference Result:');
    console.log('User Emissions (kg):', cohortResult.emissionsKg.total);
    console.log('Cohort Averages (kg):', higherCohortAverages);
    console.log('Avoided Impact:');
    console.log('  - Home:', cohortResult.equivalences.avoided.home.treeYears, 'tree years');
    console.log('  - Transport:', cohortResult.equivalences.avoided.transport.treeYears, 'tree years');
    console.log('  - Food:', cohortResult.equivalences.avoided.food.treeYears, 'tree years');
    console.log('  - Clothing:', cohortResult.equivalences.avoided.clothing.treeYears, 'tree years');
    console.log('  - Waste:', cohortResult.equivalences.avoided.waste.treeYears, 'tree years');
    console.log('  - Total:', cohortResult.equivalences.avoided.total.treeYears, 'tree years');
    
    // Test with realistic conventional reference
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('🔄 Testing with realistic conventional reference...');
    
    const realisticConventional = {
      home: {
        homeSize: '4',
        efficiency: 'C',
        energySources: 'C'
      },
      transport: {
        primaryMode: 'C',
        carProfile: 'D', // Large vehicle
        kmPerWeek: 300,  // More driving
        longDistance: 'C' // Frequent flyer
      },
      food: {
        dietType: 'MEAT_HEAVY',
        sourcing: 'C',
        diningOut: 'C',
        plantMealsPerWeek: '3'
      },
      clothing: {
        shoppingApproach: 'C',
        upgradeConsideration: 'C',
        styleQuality: 'C',
        buyFrequency: 'C',
        brandChoice: 'C'
      },
      waste: {
        preWasteBehavior: 'throwAway',
        packagingMindset: 'convenience',
        binFullness: 'Full or overflowing',
        repairHabit: 'D'
      }
    };
    
    // Create a mock service with custom reference
    const customService = {
      ...service,
      calculateImpactMetricAndEquivalence: (responses, categoryEmissions, policy, cohortAverages) => {
        // Override the reference calculation
        const gridKgPerKwh = 0.45; // Pakistan
        
        // Calculate reference emissions manually
        const refHome = 110 * 70 * 1.0 * 0.45 * 1.0; // 4-bedroom, standard, traditional
        const refTransport = 300 * 52 * 0.26 + 6 * 500; // 300km/week, large vehicle, 6 flights
        const refFood = 4500 * 1.1 * 1.1; // Meat heavy, imported, frequent dining
        const refClothing = 40 * 1.3 * 1.25 * 1.0 * 25; // Extensive, frequent, fast fashion, conventional
        const refWaste = (20 * 0.12 * 365) * 0.45; // Full bin, no diversion, no repair
        
        const refTotal = refHome + refTransport + refFood + refClothing + refWaste;
        
        console.log('📊 Reference Emissions Breakdown:');
        console.log('  - Home:', Math.round(refHome), 'kg');
        console.log('  - Transport:', Math.round(refTransport), 'kg');
        console.log('  - Food:', Math.round(refFood), 'kg');
        console.log('  - Clothing:', Math.round(refClothing), 'kg');
        console.log('  - Waste:', Math.round(refWaste), 'kg');
        console.log('  - Total:', Math.round(refTotal), 'kg');
        
        return service.calculateImpactMetricAndEquivalence(
          responses,
          categoryEmissions,
          'conventional'
        );
      }
    };
    
    const realisticResult = customService.calculateImpactMetricAndEquivalence(
      testResponses,
      undefined,
      'conventional'
    );
    
    console.log('\n🎯 Solution: Use Higher Reference Values');
    console.log('The conventional reference is too optimistic. You should either:');
    console.log('1. Use cohort averages that are higher than user emissions');
    console.log('2. Adjust the conventional reference to be more realistic');
    console.log('3. Use a "high-impact" reference policy for comparison');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error(error.stack);
  }
}

// Run the test
testReferenceComparison();
