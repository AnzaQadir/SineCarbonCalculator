const { PersonalityService } = require('./api/services/personalityService');

// Sample test data
const testResponses = {
  name: "Anza Qadir",
  age: "25-34",
  gender: "male",
  location: "Chicago",
  profession: "business",
  householdSize: "4",
  primaryTransportMode: "A", // Good habit: low carbon transport
  carProfile: "B",
  longDistanceTravel: "B",
  dietType: "MEAT_HEAVY", // Stretch area: diet
  plantBasedMealsPerWeek: "3",
  monthlyDiningOut: "B",
  waste: {
    prevention: "D", // Stretch area: waste
    smartShopping: "B",
    dailyWaste: "D",
    repairOrReplace: "A" // Good habit: circular mindset
  },
  homeSize: "5",
  homeEfficiency: "B",
  energyManagement: "C", // Stretch area: energy
  airQuality: {
    outdoorAirQuality: "D",
    aqiMonitoring: "B", // Good habit: air aware
    indoorAirQuality: "D",
    airQualityCommuting: "B"
  },
  clothing: {
    wardrobeImpact: "A", // Good habit: ethical fashion
    consumptionFrequency: "C",
    brandLoyalty: "B"
  },
  personalityTraits: {
    decisionMaking1: "analyst",
    decisionMaking2: "intuitive",
    decisionMaking3: "connector",
    decisionMaking4: "neutral",
    decisionMaking5: "connector",
    decisionMaking6: "intuitive",
    actionTaking7: "planner",
    actionTaking8: "experimenter",
    actionTaking9: "collaborator",
    actionTaking10: "experimenter",
    actionTaking11: "experimenter",
    actionTaking12: "collaborator"
  }
};

async function testPowerMoves() {
  const personalityService = new PersonalityService();
  
  try {
    console.log('Testing Personality Service...\n');
    
    const result = await personalityService.calculatePersonality(testResponses);
    
    console.log('=== RESPONSE ===');
    console.log('Personality Type:', result.personalityType);
    console.log('Final Score:', result.finalScore);
    console.log('Power Moves:', result.powerMoves);
    
    console.log('\n=== NEW PERSONALITY FIELDS ===');
    console.log('New Personality:', result.newPersonality);
    console.log('New Personality Description:', result.newPersonalityDescription);
    console.log('Has newPersonality:', !!result.newPersonality);
    console.log('Has newPersonalityDescription:', !!result.newPersonalityDescription);
    
    if (result.personalityTraits) {
      console.log('\n=== PERSONALITY TRAITS ===');
      console.log('Traits:', result.personalityTraits);
    }
    
    console.log('\n=== CATEGORY SCORES ===');
    console.log('Category Scores:', result.categoryScores);
    
    console.log('\n=== IMPACT METRICS ===');
    console.log('Impact Metrics:', result.impactMetrics);
    
  } catch (error) {
    console.error('Error testing personality service:', error);
  }
}

// Test different scenarios
async function testScenarios() {
  const personalityService = new PersonalityService();
  
  const scenarios = [
    {
      name: "High-Performing User",
      data: {
        ...testResponses,
        primaryTransportMode: "A",
        clothing: { wardrobeImpact: "A", consumptionFrequency: "A" },
        waste: { prevention: "A", repairOrReplace: "A" },
        dietType: "VEGETARIAN"
      }
    },
    {
      name: "Beginner User",
      data: {
        ...testResponses,
        primaryTransportMode: "D",
        clothing: { wardrobeImpact: "D", consumptionFrequency: "D" },
        waste: { prevention: "D", repairOrReplace: "D" },
        dietType: "MEAT_HEAVY"
      }
    },
    {
      name: "No Personality Traits",
      data: {
        ...testResponses,
        personalityTraits: undefined
      }
    }
  ];
  
  for (const scenario of scenarios) {
    console.log(`\n=== TESTING: ${scenario.name} ===`);
    try {
      const result = await personalityService.calculatePersonality(scenario.data);
      console.log('Personality Type:', result.personalityType);
      console.log('Final Score:', result.finalScore);
      if (result.newPersonality) {
        console.log('New Personality:', result.newPersonality);
      }
    } catch (error) {
      console.error(`Error in ${scenario.name}:`, error.message);
    }
  }
}

// Run tests
if (require.main === module) {
  testPowerMoves().then(() => {
    console.log('\n=== RUNNING SCENARIO TESTS ===');
    return testScenarios();
  }).catch(console.error);
}

module.exports = { testPowerMoves, testScenarios }; 