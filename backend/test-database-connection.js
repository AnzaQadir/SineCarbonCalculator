const { initializeDatabase } = require('./api/models');
const { UserService } = require('./api/services/userService');

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection and user lookup...');
    
    // Try to initialize database
    console.log('\n1. Initializing database...');
    try {
      await initializeDatabase();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.log('❌ Database initialization failed:', error.message);
      console.log('💡 This is why the user check API is not working!');
      console.log('   The API needs a proper DATABASE_URL environment variable.');
      return;
    }
    
    // Try to get all users
    console.log('\n2. Getting all users...');
    try {
      const allUsers = await UserService.getAllUsers();
      console.log(`✅ Found ${allUsers.length} users in database`);
      allUsers.forEach(user => {
        console.log(`   - ${user.firstName} (${user.email})`);
      });
    } catch (error) {
      console.log('❌ Failed to get users:', error.message);
    }
    
    // Try to find a user by firstName
    console.log('\n3. Testing getUserByFirstName...');
    try {
      const testUser = await UserService.getUserByFirstName('Anza');
      if (testUser) {
        console.log('✅ Found user by firstName:', testUser.firstName);
      } else {
        console.log('❌ No user found with firstName "Anza"');
      }
    } catch (error) {
      console.log('❌ getUserByFirstName failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDatabaseConnection(); 