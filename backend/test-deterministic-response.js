const axios = require('axios');

const testPayload = {
  "name": "Anza",
  "age": "25-30",
  "gender": "Female",
  "profession": "Education (Teacher, Lecturer, Academic)",
  "country": "United States",
  "homeSize": "3 people",
  "homeEfficiency": "B",
  "energyManagement": "A",
  "primaryTransportMode": "C",
  "carProfile": "B",
  "weeklyKm": "200",
  "longDistanceTravel": "B",
  "dietType": "VEGETARIAN",
  "plateProfile": "B",
  "monthlyDiningOut": "A",
  "plantBasedMealsPerWeek": "3",
  "waste": {
    "prevention": "B",
    "smartShopping": "A",
    "dailyWaste": "B",
    "repairOrReplace": "C"
  },
  "clothing": {
    "wardrobeImpact": "B",
    "mindfulUpgrades": "C",
    "durability": "B",
    "consumptionFrequency": "B",
    "brandLoyalty": "C"
  },
  "personalityTraits": {
    "decisionMaking1": "analyst",
    "decisionMaking2": "connector",
    "decisionMaking3": "intuitive",
    "decisionMaking4": "analyst",
    "decisionMaking5": "intuitive",
    "decisionMaking6": "analyst",
    "actionTaking7": "experimenter",
    "actionTaking8": "collaborator",
    "actionTaking9": "experimenter",
    "actionTaking10": "collaborator",
    "actionTaking11": "experimenter",
    "actionTaking12": "planner"
  }
};

async function testDeterministicResponse() {
  console.log('🧪 Testing Deterministic Response...\n');
  
  const responses = [];
  const numTests = 5;
  
  for (let i = 0; i < numTests; i++) {
    try {
      console.log(`📝 Test ${i + 1}/${numTests}...`);
      
      const response = await axios.post('http://localhost:3000/api/personality/calculate', testPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseData = response.data;
      
      // Extract key fields for comparison
      const keyFields = {
        personalityType: responseData.personalityType,
        newPersonality: responseData.newPersonality,
        comprehensivePowerMoves: responseData.comprehensivePowerMoves?.personality?.archetype,
        personalizedPowerMoves: responseData.personalizedPowerMoves?.powerMoves?.length,
        highlights: responseData.highlights?.highlights?.length,
        finalScore: responseData.finalScore
      };
      
      responses.push(keyFields);
      
      console.log(`✅ Test ${i + 1} completed`);
      console.log(`   Personality: ${keyFields.personalityType}`);
      console.log(`   New Personality: ${keyFields.newPersonality}`);
      console.log(`   Archetype: ${keyFields.comprehensivePowerMoves}`);
      console.log(`   Power Moves: ${keyFields.personalizedPowerMoves}`);
      console.log(`   Highlights: ${keyFields.highlights}`);
      console.log(`   Score: ${keyFields.finalScore}\n`);
      
    } catch (error) {
      console.error(`❌ Test ${i + 1} failed:`, error.response?.data || error.message);
    }
  }
  
  // Check if all responses are identical
  const firstResponse = JSON.stringify(responses[0]);
  const allIdentical = responses.every(response => JSON.stringify(response) === firstResponse);
  
  console.log('📊 Results:');
  console.log(`   Total Tests: ${numTests}`);
  console.log(`   Successful: ${responses.length}`);
  console.log(`   All Identical: ${allIdentical ? '✅ YES' : '❌ NO'}`);
  
  if (!allIdentical) {
    console.log('\n🔍 Differences Found:');
    responses.forEach((response, index) => {
      console.log(`   Test ${index + 1}:`, JSON.stringify(response, null, 2));
    });
  } else {
    console.log('\n🎉 SUCCESS: All responses are identical!');
  }
}

// Run the test
testDeterministicResponse().catch(console.error); 