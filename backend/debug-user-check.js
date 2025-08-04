const { Op } = require('sequelize');
const { initializeDatabase } = require('./src/models');
const { UserService } = require('./src/services/userService');

async function debugUserCheck() {
  try {
    console.log('🔍 Debugging user check case sensitivity issue...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized');
    
    // Get all users to see what's in the database
    console.log('\n📋 All users in database:');
    const allUsers = await UserService.getAllUsers();
    allUsers.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, FirstName: "${user.firstName}"`);
    });
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    // Test with the first user's firstName
    const testUser = allUsers[0];
    const testFirstName = testUser.firstName;
    
    if (!testFirstName) {
      console.log('❌ No firstName found in test user');
      return;
    }
    
    console.log(`\n🧪 Testing with firstName: "${testFirstName}"`);
    
    // Test exact case
    console.log(`\n1. Testing exact case: "${testFirstName}"`);
    const exactMatch = await UserService.getUserByFirstName(testFirstName);
    console.log(exactMatch ? '✅ Found' : '❌ Not found');
    
    // Test lowercase
    const lowerCase = testFirstName.toLowerCase();
    console.log(`\n2. Testing lowercase: "${lowerCase}"`);
    const lowerMatch = await UserService.getUserByFirstName(lowerCase);
    console.log(lowerMatch ? '✅ Found' : '❌ Not found');
    
    // Test uppercase
    const upperCase = testFirstName.toUpperCase();
    console.log(`\n3. Testing uppercase: "${upperCase}"`);
    const upperMatch = await UserService.getUserByFirstName(upperCase);
    console.log(upperMatch ? '✅ Found' : '❌ Not found');
    
    console.log('\n📝 CONCLUSION:');
    if (exactMatch && !lowerMatch && !upperMatch) {
      console.log('   ✅ The search is working correctly - it\'s case-sensitive as expected');
      console.log('   💡 To fix this, we need to make the search case-insensitive');
    } else {
      console.log('   ❓ Unexpected results - there might be other issues');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugUserCheck(); 