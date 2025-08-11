const { UserPersonality } = require('./api/models');

async function testDatabase() {
  try {
    console.log('🧪 Testing Database Connection...\n');

    // Test 1: Check if we can connect to the table
    console.log('📝 Test 1: Check if user_personalities table exists');
    const count = await UserPersonality.count();
    console.log(`✅ Table exists! Current record count: ${count}`);

    // Test 2: Try to find any records
    console.log('\n📝 Test 2: Try to find any records');
    const records = await UserPersonality.findAll({ limit: 5 });
    console.log(`✅ Found ${records.length} records`);

    if (records.length > 0) {
      const firstRecord = records[0];
      console.log('📊 First record details:', {
        id: firstRecord.id,
        userId: firstRecord.userId,
        personalityType: firstRecord.personalityType,
        newPersonality: firstRecord.newPersonality,
        status: firstRecord.status,
        createdAt: firstRecord.createdAt
      });
    }

    // Test 3: Try to find records by userId
    console.log('\n📝 Test 3: Try to find records by userId');
    const testUserId = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID format
    const userRecords = await UserPersonality.findAll({ 
      where: { userId: testUserId },
      limit: 5 
    });
    console.log(`✅ Found ${userRecords.length} records for userId: ${testUserId}`);

    console.log('\n🎉 Database test completed successfully!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testDatabase();
