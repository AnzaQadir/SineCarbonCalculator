const axios = require('axios');

// Sample test data with good habits
const testData = {
  name: "Test User",
  age: "25-34",
  gender: "female",
  location: "San Francisco",
  profession: "Education",
  householdSize: "3",
  
  // Good transport habits
  primaryTransportMode: "A", // Walking/biking
  carProfile: "A", // Electric vehicle
  longDistanceTravel: "A", // Rail/bus
  
  // Good food habits
  dietType: "VEGETARIAN",
  plantBasedMealsPerWeek: "5",
  monthlyDiningOut: "B",
  
  // Good waste habits
  waste: {
    prevention: "A", // Zero waste champion
    smartShopping: "A", // Conscious consumer
    dailyWaste: "A", // Minimal waste
    repairOrReplace: "A" // Always repair
  },
  
  // Good clothing habits
  clothing: {
    wardrobeImpact: "A", // Minimal wardrobe
    mindfulUpgrades: "A", // Sustainable brands
    consumptionFrequency: "A", // Infrequent shopper
    brandLoyalty: "A" // Brand conscious
  },
  
  // Good energy habits
  homeEfficiency: "A", // Energy efficient
  energyManagement: "A", // Renewable energy
  
  // Good air quality habits
  airQuality: {
    outdoorAirQuality: "A", // Fresh and clean
    aqiMonitoring: "A", // Active monitoring
    indoorAirQuality: "A" // Air purifiers & plants
  },
  
  // Personality traits
  personalityTraits: {
    decisionMaking1: "analyst",
    decisionMaking2: "analyst",
    decisionMaking3: "analyst",
    actionTaking7: "planner",
    actionTaking8: "planner",
    actionTaking9: "planner"
  }
};

async function testHighlights() {
  try {
    console.log('🧪 Testing Highlights System...\n');
    
    // Make API call to personality endpoint
    const response = await axios.post('http://localhost:3000/api/personality/calculate', testData);
    
    console.log('=== API RESPONSE ===');
    console.log('Status:', response.status);
    
    const result = response.data;
    
    console.log('\n=== PERSONALITY INFO ===');
    console.log('Personality Type:', result.personalityType);
    console.log('Final Score:', result.finalScore);
    
    console.log('\n=== HIGHLIGHTS ===');
    if (result.highlights) {
      const { highlights, personalityInsights } = result.highlights;
      
      console.log(`Total Highlights: ${highlights.length}`);
      console.log('\n--- HIGHLIGHT CARDS ---');
      
      highlights.forEach((highlight, index) => {
        console.log(`\n${index + 1}. ${highlight.icon} ${highlight.title}`);
        console.log(`   Summary: ${highlight.summary}`);
        console.log(`   Subtext: ${highlight.subtext}`);
        if (highlight.cta) {
          console.log(`   CTA: ${highlight.cta}`);
        }
        console.log(`   Category: ${highlight.category}`);
      });
      
      console.log('\n--- PERSONALITY INSIGHTS ---');
      console.log(`Decision Style: ${personalityInsights.decisionStyle}`);
      console.log(`Action Style: ${personalityInsights.actionStyle}`);
      console.log(`Spark: ${personalityInsights.spark}`);
    } else {
      console.log('❌ No highlights in response');
      console.log('Available keys:', Object.keys(result));
    }
    
    console.log('\n=== PERSONALIZED POWER MOVES (for comparison) ===');
    if (result.personalizedPowerMoves) {
      const { powerMoves, totalCount } = result.personalizedPowerMoves;
      console.log(`Power Moves Found: ${totalCount}`);
      powerMoves.forEach((pm, i) => {
        console.log(`  ${i + 1}. ${pm.badge} (${pm.category})`);
      });
    }
    
    console.log('\n🎉 Highlights test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Test with different scenarios
async function testScenarios() {
  const scenarios = [
    {
      name: "High-Performing User (All A's)",
      data: testData
    },
    {
      name: "Mixed User",
      data: {
        ...testData,
        primaryTransportMode: "B", // Public transit
        dietType: "FLEXITARIAN",
        waste: { prevention: "B", repairOrReplace: "A" },
        clothing: { wardrobeImpact: "B", mindfulUpgrades: "A" }
      }
    },
    {
      name: "Beginner User",
      data: {
        ...testData,
        primaryTransportMode: "C", // Personal vehicle
        dietType: "MEAT_MODERATE",
        waste: { prevention: "C", repairOrReplace: "C" },
        clothing: { wardrobeImpact: "C", mindfulUpgrades: "C" }
      }
    }
  ];
  
  for (const scenario of scenarios) {
    console.log(`\n=== TESTING: ${scenario.name} ===`);
    try {
      const response = await axios.post('http://localhost:3000/api/personality/calculate', scenario.data);
      const result = response.data;
      
      if (result.highlights) {
        const { highlights } = result.highlights;
        console.log(`Highlights Found: ${highlights.length}`);
        highlights.forEach((h, i) => {
          console.log(`  ${i + 1}. ${h.icon} ${h.title}`);
        });
      }
    } catch (error) {
      console.error(`Error in ${scenario.name}:`, error.message);
    }
  }
}

// Run tests
if (require.main === module) {
  testHighlights().then(() => {
    console.log('\n=== RUNNING SCENARIO TESTS ===');
    return testScenarios();
  }).catch(console.error);
}

module.exports = { testHighlights, testScenarios }; 