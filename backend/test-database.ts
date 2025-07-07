import { initializeDatabase } from './src/models';
import { UserService } from './src/services/userService';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Test user creation
    console.log('\nTesting user creation...');
    const testUser = await UserService.createUser({
      email: 'test@example.com',
      firstName: 'Test',
      age: '25-30',
      gender: 'Prefer not to say',
      profession: 'Student (School / College / University)',
      country: 'United States',
      city: 'New York',
      household: '1 person',
      ctaVariant: 'A'
    });
    console.log('✅ User created:', testUser.id);
    
    // Test user retrieval
    console.log('\nTesting user retrieval...');
    const retrievedUser = await UserService.getUserByEmail('test@example.com');
    if (retrievedUser) {
      console.log('✅ User retrieved:', retrievedUser.email);
    } else {
      console.log('❌ User not found');
    }
    
    // Test user count
    console.log('\nTesting user count...');
    const userCount = await UserService.getUserCount();
    console.log('✅ User count:', userCount);
    
    // Test activity tracking
    console.log('\nTesting activity tracking...');
    const activity = await UserService.trackUserActivity(testUser.id, 'SIGNUP', {
      test: true,
      timestamp: new Date().toISOString()
    });
    console.log('✅ Activity tracked:', activity.activityType);
    
    // Test getting user activities
    console.log('\nTesting user activities...');
    const activities = await UserService.getUserActivities(testUser.id);
    console.log('✅ User activities count:', activities.length);
    
    console.log('\n🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

// Run the test
testDatabase(); 