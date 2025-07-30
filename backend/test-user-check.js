// Test user check endpoint
require('ts-node/register');

const { initializeDatabase } = require('./src/models');
const { UserService } = require('./src/services/userService');

async function testUserCheck() {
  try {
    console.log('Testing user check functionality...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Test 1: Create a test user
    console.log('\n1. Creating test user...');
    const uniqueEmail = `test+${Date.now()}@example.com`;
    const testUser = await UserService.createUser({
      email: uniqueEmail,
      firstName: 'John',
      age: '25-30',
      gender: 'Male',
      profession: 'Student',
      country: 'United States',
      city: 'New York',
      household: '1 person',
      ctaVariant: 'A'
    });
    console.log('✅ Test user created:', testUser.email);
    
    // Test 2: Check user by email
    console.log('\n2. Testing user check by email...');
    const userByEmail = await UserService.getUserByEmail(uniqueEmail);
    if (userByEmail) {
      console.log('✅ User found by email:', userByEmail.email);
    } else {
      console.log('❌ User not found by email');
    }
    
    // Test 3: Check user by first name
    console.log('\n3. Testing user check by first name...');
    const userByName = await UserService.getUserByFirstName('John');
    if (userByName) {
      console.log('✅ User found by name:', userByName.firstName);
    } else {
      console.log('❌ User not found by name');
    }
    
    // Test 4: Check non-existent user
    console.log('\n4. Testing non-existent user...');
    const nonExistentUser = await UserService.getUserByEmail('nonexistent@example.com');
    if (!nonExistentUser) {
      console.log('✅ Correctly returned null for non-existent user');
    } else {
      console.log('❌ Should have returned null for non-existent user');
    }
    
    console.log('\n🎉 All user check tests passed!');
    
  } catch (error) {
    console.error('❌ User check test failed:', error);
  }
}

// Run the test
testUserCheck(); 