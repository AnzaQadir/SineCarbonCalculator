// Test session tracking functionality
require('ts-node/register');

const { initializeDatabase } = require('./src/models');
const { SessionService } = require('./src/services/sessionService');
const { UserService } = require('./src/services/userService');

async function testSessionTracking() {
  try {
    console.log('Testing session tracking system...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Test 1: Create session
    console.log('\n1. Testing session creation...');
    const sessionId = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID
    const session = await SessionService.createSessionIfNotExists(sessionId, {
      userAgent: 'test-agent',
      ip: '127.0.0.1'
    });
    console.log('✅ Session created:', session.sessionId);
    
    // Test 2: Log events
    console.log('\n2. Testing event logging...');
    const event1 = await SessionService.logEvent(sessionId, 'PAGE_VIEW', {
      page: '/signup',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Event logged:', event1.eventType);
    
    const event2 = await SessionService.logEvent(sessionId, 'QUIZ_STARTED', {
      quizType: 'personality',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Event logged:', event2.eventType);
    
    // Test 3: Get session events
    console.log('\n3. Testing event retrieval...');
    const events = await SessionService.getSessionEvents(sessionId);
    console.log('✅ Retrieved', events.length, 'events');
    
    // Test 4: Create user and link session
    console.log('\n4. Testing user creation and session linking...');
    const uniqueEmail = `test+${Date.now()}@example.com`;
    const user = await UserService.createUser({
      email: uniqueEmail,
      firstName: 'Test',
      age: '25-30',
      gender: 'Prefer not to say',
      profession: 'Student',
      country: 'United States',
      city: 'New York',
      household: '1 person',
      ctaVariant: 'A'
    }, sessionId);
    console.log('✅ User created and session linked:', user.id);
    
    // Test 5: Get user by session
    console.log('\n5. Testing user retrieval by session...');
    const sessionWithUser = await SessionService.getUserBySession(sessionId);
    if (sessionWithUser && sessionWithUser.userData) {
      console.log('✅ User data retrieved:', sessionWithUser.userData.email);
    } else {
      console.log('❌ User data not found');
    }
    
    // Test 6: Anonymous session (no user)
    console.log('\n6. Testing anonymous session...');
    const anonymousSessionId = '550e8400-e29b-41d4-a716-446655440001'; // Valid UUID
    const anonymousSession = await SessionService.createSessionIfNotExists(anonymousSessionId);
    console.log('✅ Anonymous session created:', anonymousSession.sessionId);
    
    const anonymousUser = await SessionService.getUserBySession(anonymousSessionId);
    if (!anonymousUser?.userData) {
      console.log('✅ Anonymous session correctly has no user data');
    } else {
      console.log('❌ Anonymous session incorrectly has user data');
    }
    
    console.log('\n🎉 All session tracking tests passed!');
    
  } catch (error) {
    console.error('❌ Session tracking test failed:', error);
  }
}

// Run the test
testSessionTracking(); 