const { PersonalityController } = require('./src/controllers/personalityController');

// Mock request and response objects
const mockRequest = {
  body: {
    name: "Anza",
    email: "anzaqadir123@gmail.com",
    age: "25-34",
    gender: "male",
    profession: "environment",
    location: "Melbourne",
    country: "Australia",
    householdSize: "5",
    homeSize: "3",
    // Add some personality quiz responses
    homeEfficiency: "B",
    energyManagement: "A",
    primaryTransportMode: "B",
    dietType: "FLEXITARIAN",
    waste: {
      prevention: "B",
      smartShopping: "A",
      dailyWaste: "C",
      management: "B",
      repairOrReplace: "A"
    }
  },
  headers: {
    'x-session-id': 'test-session-123'
  },
  get: (header) => {
    if (header === 'User-Agent') return 'Test User Agent';
    return null;
  },
  ip: '127.0.0.1'
};

const mockResponse = {
  json: (data) => {
    console.log('Response data:', JSON.stringify(data, null, 2));
    return mockResponse;
  },
  status: (code) => {
    console.log('Response status:', code);
    return mockResponse;
  }
};

async function testPersonalityCalculation() {
  console.log('Testing personality calculation with user creation...');
  console.log('Request body:', JSON.stringify(mockRequest.body, null, 2));
  
  try {
    const controller = new PersonalityController();
    await controller.calculatePersonality(mockRequest, mockResponse);
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testPersonalityCalculation();
