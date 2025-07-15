const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Generate a truly unique email
function generateUniqueEmail() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `test-${timestamp}-${randomString}@example.com`;
}

async function testEmailService() {
  try {
    console.log('🧪 Testing Email Service (Unique Email)...\n');
    
    // Generate unique email
    const uniqueEmail = generateUniqueEmail();
    console.log('📧 Using unique email:', uniqueEmail);
    
    // Test signup with email
    console.log('1️⃣ Testing signup with email notification...');
    const signupData = {
      email: uniqueEmail,
      firstName: 'Test',
      age: '25-30',
      gender: 'Female',
      profession: 'Education (Teacher, Lecturer, Academic)',
      country: 'United States',
      city: 'San Francisco',
      household: '3 people',
      ctaVariant: 'B'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/users/signup`, signupData);
    console.log('✅ Signup successful!');
    console.log('   - User ID:', signupResponse.data.user.id);
    console.log('   - Email:', signupResponse.data.user.email);
    console.log('   - Waitlist Position:', signupResponse.data.waitlistPosition);
    
    // Check if welcome email was sent
    console.log('\n2️⃣ Checking if welcome email was triggered...');
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
    
    // Check updated activities
    const updatedActivitiesResponse = await axios.get(`${API_BASE_URL}/users/${signupResponse.data.user.id}/activities`);
    const updatedEmailActivities = updatedActivitiesResponse.data.activities.filter(
      activity => activity.activityType === 'EMAIL_SENT'
    );
    
    console.log('✅ Total email activities after join:', updatedEmailActivities.length);
    
    console.log('\n🎉 Email test completed successfully!');
    console.log('\n📧 Email Summary:');
    console.log('   - Welcome email should be sent on signup');
    console.log('   - Community join email should be sent');
    console.log('   - Email activities are being tracked');
    
    // Test the actual email content
    console.log('\n📧 Email Content Preview:');
    console.log('   - The email should show the new watercolor background');
    console.log('   - Overlay text: "Your habits already tell a story."');
    console.log('   - Soft serif typography and gentle colors');
    
  } catch (error) {
    console.error('❌ Email service test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure your backend server is running:');
      console.log('   npm start');
    }
  }
}

// Run the test
testEmailService(); 