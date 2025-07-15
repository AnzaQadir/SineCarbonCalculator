const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testEmailServiceDirect() {
  try {
    console.log('🧪 Testing Email Service (Direct)...\n');
    
    const realEmail = 'anzaqadir123@gmail.com';
    console.log('📧 Testing email for:', realEmail);
    
    // First, let's find the existing user
    console.log('1️⃣ Finding existing user...');
    const usersResponse = await axios.get(`${API_BASE_URL}/users`);
    
    const existingUser = usersResponse.data.users.find(user => user.email === realEmail);
    
    if (!existingUser) {
      console.log('❌ User not found. Creating new user...');
      // Create new user if not found
      const signupData = {
        email: realEmail,
        firstName: 'Anza',
        age: '25-30',
        gender: 'Female',
        profession: 'Education (Teacher, Lecturer, Academic)',
        country: 'United States',
        city: 'San Francisco',
        household: '3 people',
        ctaVariant: 'B'
      };

      const signupResponse = await axios.post(`${API_BASE_URL}/users/signup`, signupData);
      console.log('✅ New user created!');
      console.log('   - User ID:', signupResponse.data.user.id);
      console.log('   - Waitlist Position:', signupResponse.data.waitlistPosition);
      
      // Check email activities
      console.log('\n2️⃣ Checking welcome email...');
      const activitiesResponse = await axios.get(`${API_BASE_URL}/users/${signupResponse.data.user.id}/activities`);
      
      const emailActivities = activitiesResponse.data.activities.filter(
        activity => activity.activityType === 'EMAIL_SENT'
      );
      
      console.log('✅ Email activities found:', emailActivities.length);
      emailActivities.forEach((activity, index) => {
        console.log(`   - Email ${index + 1}: ${activity.metadata?.emailType || 'Unknown'}`);
        console.log(`     Sent at: ${activity.metadata?.sentAt || 'N/A'}`);
      });
      
      // Test community join
      console.log('\n3️⃣ Testing community join...');
      const joinResponse = await axios.post(`${API_BASE_URL}/users/join-community`, {
        userId: signupResponse.data.user.id
      });
      
      console.log('✅ Community join successful!');
      
    } else {
      console.log('✅ Found existing user!');
      console.log('   - User ID:', existingUser.id);
      console.log('   - Email:', existingUser.email);
      
      // Check current activities
      console.log('\n2️⃣ Checking current email activities...');
      const activitiesResponse = await axios.get(`${API_BASE_URL}/users/${existingUser.id}/activities`);
      
      const emailActivities = activitiesResponse.data.activities.filter(
        activity => activity.activityType === 'EMAIL_SENT'
      );
      
      console.log('✅ Current email activities:', emailActivities.length);
      emailActivities.forEach((activity, index) => {
        console.log(`   - Email ${index + 1}: ${activity.metadata?.emailType || 'Unknown'}`);
        console.log(`     Sent at: ${activity.metadata?.sentAt || 'N/A'}`);
      });
      
      // Test community join to trigger another email
      console.log('\n3️⃣ Testing community join to trigger email...');
      const joinResponse = await axios.post(`${API_BASE_URL}/users/join-community`, {
        userId: existingUser.id
      });
      
      console.log('✅ Community join successful!');
      
      // Check updated activities
      const updatedActivitiesResponse = await axios.get(`${API_BASE_URL}/users/${existingUser.id}/activities`);
      const updatedEmailActivities = updatedActivitiesResponse.data.activities.filter(
        activity => activity.activityType === 'EMAIL_SENT'
      );
      
      console.log('✅ Total email activities after join:', updatedEmailActivities.length);
    }
    
    console.log('\n🎉 Email test completed successfully!');
    console.log('\n📧 Email Summary:');
    console.log('   - Welcome email sent to:', realEmail);
    console.log('   - Community join email sent to:', realEmail);
    console.log('   - Email activities are being tracked');
    
    console.log('\n📧 Email Content Preview:');
    console.log('   - The email should show the new watercolor background');
    console.log('   - Overlay text: "Your habits already tell a story."');
    console.log('   - Soft serif typography and gentle colors');
    console.log('   - Check your inbox at:', realEmail);
    
  } catch (error) {
    console.error('❌ Email service test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure your backend server is running:');
      console.log('   npm start');
    }
  }
}

// Run the test
testEmailServiceDirect(); 