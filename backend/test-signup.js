const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testSignup() {
  try {
    console.log('🧪 Testing signup API...');
    
    const signupData = {
      email: 'test@example.com',
      firstName: 'John',
      age: '25-30',
      gender: 'Male',
      profession: 'IT & Software Development',
      country: 'United States',
      city: 'New York',
      household: '2 people',
      ctaVariant: 'A'
    };

    const response = await axios.post(`${API_BASE_URL}/users/signup`, signupData);
    
    console.log('✅ Signup successful!');
    console.log('User ID:', response.data.user.id);
    console.log('Waitlist Position:', response.data.waitlistPosition);
    console.log('Email:', response.data.user.email);
    
    // Test community join
    console.log('\n🧪 Testing community join...');
    const joinResponse = await axios.post(`${API_BASE_URL}/users/join-community`, {
      userId: response.data.user.id
    });
    
    console.log('✅ Community join successful!');
    console.log('Activity ID:', joinResponse.data.activity.id);
    
    // Test getting user activities
    console.log('\n🧪 Testing user activities...');
    const activitiesResponse = await axios.get(`${API_BASE_URL}/users/${response.data.user.id}/activities`);
    
    console.log('✅ User activities retrieved!');
    console.log('Activity count:', activitiesResponse.data.activities.length);
    
    // Test getting user count
    console.log('\n🧪 Testing user count...');
    const countResponse = await axios.get(`${API_BASE_URL}/users/admin/count`);
    
    console.log('✅ User count retrieved!');
    console.log('Total users:', countResponse.data.count);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testSignup(); 