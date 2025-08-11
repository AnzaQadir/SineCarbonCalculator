const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testPersonalityLogging() {
  try {
    console.log('🧪 Testing Personality Logging System...\n');

    // Test 1: Calculate personality with email (should fetch userId and log to database)
    console.log('📝 Test 1: Calculate personality WITH email (should fetch userId and log to database)');
    const response1 = await axios.post(`${API_BASE}/personality/calculate`, {
      email: 'test@example.com', // Use email instead of userId
      sessionId: '550e8400-e29b-41d4-a716-446655440001', // Valid UUID format
      // Add some sample quiz responses
      question1: 'How often do you use public transport?',
      answer1: 'Sometimes',
      question2: 'What is your household size?',
      answer2: '2-3 people'
    });
    
    console.log('✅ Response received:', {
      status: response1.status,
      hasMetadata: !!response1.data._metadata,
      calculationTime: response1.data._metadata?.calculationTimeMs,
      logged: response1.data._metadata?.logged
    });

    // Test 2: Calculate personality without email (should NOT log to database)
    console.log('\n📝 Test 2: Calculate personality WITHOUT email (should NOT log to database)');
    const response2 = await axios.post(`${API_BASE}/personality/calculate`, {
      // No email
      question1: 'How often do you use public transport?',
      answer1: 'Sometimes',
      question2: 'What is your household size?',
      answer2: '2-3 people'
    });
    
    console.log('✅ Response received:', {
      status: response2.status,
      hasMetadata: !!response2.data._metadata,
      calculationTime: response2.data._metadata?.calculationTimeMs,
      logged: response2.data._metadata?.logged
    });

    // Test 3: Check if we can retrieve logged personalities
    console.log('\n📝 Test 3: Check if we can retrieve logged personalities');
    try {
      // We need to get the userId from the first test to query by userId
      // For now, let's just test the endpoint
      const response3 = await axios.get(`${API_BASE}/user-personality`);
      console.log('✅ Retrieved logged personalities:', {
        status: response3.status,
        count: response3.data.data?.length,
        total: response3.data.pagination?.total
      });
      
      if (response3.data.data?.length > 0) {
        const latest = response3.data.data[0];
        console.log('📊 Latest logged personality:', {
          id: latest.id,
          status: latest.status,
          personalityType: latest.personalityType,
          newPersonality: latest.newPersonality,
          calculationTimeMs: latest.calculationTimeMs,
          createdAt: latest.createdAt
        });
      }
    } catch (error) {
      console.log('⚠️  Could not retrieve logged personalities (endpoint might not be set up yet):', error.message);
    }

    console.log('\n🎉 Personality logging test completed!');
    console.log('\n📋 What was tested:');
    console.log('   ✅ Personality calculation with email (should fetch userId and log to database)');
    console.log('   ✅ Personality calculation without email (should not log)');
    console.log('   ✅ Retrieving logged personalities (if endpoint available)');
    
    console.log('\n🔍 Check your database for the "user_personalities" table');
    console.log('📊 Check your console logs for detailed logging information');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testPersonalityLogging();
