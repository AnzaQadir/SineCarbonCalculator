const { PersonalityService } = require('./src/services/personalityService');

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
    console.log('Testing Comprehensive Power Moves System...\n');
    
    const result = await personalityService.calculatePersonality(testResponses);
    
    console.log('=== LEGACY RESPONSE ===');
    console.log('Personality Type:', result.personalityType);
    console.log('Final Score:', result.finalScore);
    console.log('Legacy Power Moves:', result.powerMoves);
    
    console.log('\n=== NEW COMPREHENSIVE POWER MOVES ===');
    if (result.comprehensivePowerMoves) {
      const { personality, powerMoves, tone } = result.comprehensivePowerMoves;
      
      console.log('Personality Archetype:', personality.archetype);
      console.log('Decision Style:', personality.decision);
      console.log('Action Style:', personality.action);
      console.log('Description:', personality.description);
      
      console.log('\n--- Power Moves ---');
      console.log('Power Habit:', powerMoves.powerHabit);
      console.log('Power Move:', powerMoves.powerMove);
      console.log('Stretch CTA:', powerMoves.stretchCTA);
      console.log('Tone:', tone);
    } else {
      console.log('No comprehensive power moves generated');
    }
    
    console.log('\n=== BEHAVIORAL ANALYSIS ===');
    // Test the behavioral analysis directly
    const behavioralPatterns = personalityService.analyzeBehavioralPatterns(testResponses);
    console.log('Good Habits:', behavioralPatterns.goodHabits);
    console.log('Stretch Areas:', behavioralPatterns.stretchAreas);
    console.log('Habit Tags:', behavioralPatterns.habitTags);
    
  } catch (error) {
    console.error('Error testing power moves:', error);
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
      
      if (result.comprehensivePowerMoves) {
        const { personality, powerMoves } = result.comprehensivePowerMoves;
        console.log('Archetype:', personality.archetype);
        console.log('Power Habit:', powerMoves.powerHabit);
        console.log('Power Move:', powerMoves.powerMove);
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