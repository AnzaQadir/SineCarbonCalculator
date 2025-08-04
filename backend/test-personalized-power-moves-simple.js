// Simple test for personalized power moves using the compiled JavaScript version
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

async function testPersonalizedPowerMoves() {
  try {
    console.log('🧪 Testing Personalized Power Moves via API...\n');
    
    // Make API call to personality endpoint
    const response = await axios.post('http://localhost:3000/api/personality', testData);
    
    console.log('=== API RESPONSE ===');
    console.log('Status:', response.status);
    
    const result = response.data;
    
    console.log('\n=== PERSONALITY INFO ===');
    console.log('Personality Type:', result.personalityType);
    console.log('Final Score:', result.finalScore);
    
    console.log('\n=== PERSONALIZED POWER MOVES ===');
    if (result.personalizedPowerMoves) {
      const { powerMoves, totalCount, topMove } = result.personalizedPowerMoves;
      
      console.log(`Total Power Moves Found: ${totalCount}`);
      console.log(`Top Power Moves (showing up to 3): ${powerMoves.length}`);
      
      powerMoves.forEach((powerMove, index) => {
        console.log(`\n--- Power Move ${index + 1} ---`);
        console.log(`ID: ${powerMove.id}`);
        console.log(`Category: ${powerMove.category}`);
        console.log(`Badge: ${powerMove.badge}`);
        console.log(`Affirmation: ${powerMove.affirmation}`);
        console.log(`Next Move: ${powerMove.nextMove}`);
        console.log(`Impact Metric: ${powerMove.impactMetric}`);
        console.log(`Persona Tie-in: ${powerMove.personaTieIn}`);
      });
      
      if (topMove) {
        console.log('\n🏆 TOP POWER MOVE:');
        console.log(`Badge: ${topMove.badge}`);
        console.log(`Category: ${topMove.category}`);
      }
    } else {
      console.log('❌ No personalized power moves in response');
      console.log('Available keys:', Object.keys(result));
    }
    
    console.log('\n=== COMPREHENSIVE POWER MOVES (for comparison) ===');
    if (result.comprehensivePowerMoves) {
      const { personality, powerMoves } = result.comprehensivePowerMoves;
      console.log('Archetype:', personality.archetype);
      console.log('Power Habit:', powerMoves.powerHabit);
      console.log('Power Move:', powerMoves.powerMove);
    }
    
    console.log('\n🎉 Personalized Power Moves test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run test
testPersonalizedPowerMoves(); 