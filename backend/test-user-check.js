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
    
    // Test 1: Create a test user with "Anza" as firstName
    console.log('\n1. Creating test user with firstName "Anza"...');
    const uniqueEmail = `test+${Date.now()}@example.com`;
    const testUser = await UserService.createUser({
      email: uniqueEmail,
      firstName: 'Anza', // This is the exact case in database
      age: '25-30',
      gender: 'Male',
      profession: 'Student',
      country: 'United States',
      city: 'New York',
      household: '1 person',
      ctaVariant: 'A'
    });
    console.log('✅ Test user created:', testUser.email, 'firstName:', testUser.firstName);
    
    // Test 2: Check user by email
    console.log('\n2. Testing user check by email...');
    const userByEmail = await UserService.getUserByEmail(uniqueEmail);
    if (userByEmail) {
      console.log('✅ User found by email:', userByEmail.email);
    } else {
      console.log('❌ User not found by email');
    }
    
    // Test 3: Check user by first name (exact case)
    console.log('\n3. Testing user check by firstName "Anza" (exact case)...');
    const userByNameExact = await UserService.getUserByFirstName('Anza');
    if (userByNameExact) {
      console.log('✅ User found by name (exact case):', userByNameExact.firstName);
    } else {
      console.log('❌ User not found by name (exact case)');
    }
    
    // Test 4: Check user by first name (different case)
    console.log('\n4. Testing user check by firstName "anza" (lowercase)...');
    const userByNameLower = await UserService.getUserByFirstName('anza');
    if (userByNameLower) {
      console.log('✅ User found by name (lowercase):', userByNameLower.firstName);
    } else {
      console.log('❌ User not found by name (lowercase) - THIS IS THE ISSUE!');
    }
    
    // Test 5: Check user by first name (uppercase)
    console.log('\n5. Testing user check by firstName "ANZA" (uppercase)...');
    const userByNameUpper = await UserService.getUserByFirstName('ANZA');
    if (userByNameUpper) {
      console.log('✅ User found by name (uppercase):', userByNameUpper.firstName);
    } else {
      console.log('❌ User not found by name (uppercase) - THIS IS THE ISSUE!');
    }
    
    // Test 6: Check non-existent user
    console.log('\n6. Testing non-existent user...');
    const nonExistentUser = await UserService.getUserByEmail('nonexistent@example.com');
    if (!nonExistentUser) {
      console.log('✅ Correctly returned null for non-existent user');
    } else {
      console.log('❌ Should have returned null for non-existent user');
    }
    
    console.log('\n🎉 User check tests completed!');
    console.log('\n📝 ISSUE IDENTIFIED: The getUserByFirstName method is case-sensitive!');
    console.log('   It only finds exact matches, not case-insensitive matches.');
    
  } catch (error) {
    console.error('❌ User check test failed:', error);
  }
}

// Run the test
testUserCheck(); 