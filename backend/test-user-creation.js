const { User } = require('./api/models');

async function createTestUser() {
  try {
    console.log('🧪 Creating test user...\n');

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log(`✅ User already exists with email: test@example.com`);
      console.log(`📊 User details:`, {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        createdAt: existingUser.createdAt
      });
      return existingUser;
    }

    // Create new test user
    const testUser = await User.create({
      email: 'test@example.com',
      firstName: 'Test User',
      age: '25',
      gender: 'other',
      profession: 'Developer',
      country: 'Test Country',
      city: 'Test City',
      household: '1-2 people',
      waitlistPosition: 1,
      ctaVariant: 'A'
    });

    console.log(`✅ Created test user successfully!`);
    console.log(`📊 User details:`, {
      id: testUser.id,
      email: testUser.email,
      firstName: testUser.firstName,
      createdAt: testUser.createdAt
    });

    return testUser;

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    console.error('Full error:', error);
    return null;
  }
}

// Run the test
createTestUser();

