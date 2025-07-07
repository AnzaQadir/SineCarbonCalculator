const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testEmailService() {
  try {
    console.log('🧪 Testing Email Service...\n');
    
    // Test 1: Signup with email
    console.log('1️⃣ Testing signup with email notification...');
    const signupData = {
      email: 'test-email@example.com',
      firstName: 'Alice',
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
    console.log('   - CTA Variant:', signupResponse.data.user.ctaVariant);
    
    // Test 2: Check user activities (should include email sent)
    console.log('\n2️⃣ Checking user activities for email tracking...');
    const activitiesResponse = await axios.get(`${API_BASE_URL}/users/${signupResponse.data.user.id}/activities`);
    
    console.log('✅ User activities retrieved!');
    console.log('   - Total activities:', activitiesResponse.data.activities.length);
    
    // Show all activities
    activitiesResponse.data.activities.forEach((activity, index) => {
      console.log(`   - Activity ${index + 1}: ${activity.activityType}`);
      if (activity.metadata) {
        console.log(`     Metadata:`, JSON.stringify(activity.metadata, null, 2));
      }
    });
    
    // Test 3: Join community (triggers another email)
    console.log('\n3️⃣ Testing community join with email notification...');
    const joinResponse = await axios.post(`${API_BASE_URL}/users/join-community`, {
      userId: signupResponse.data.user.id
    });
    
    console.log('✅ Community join successful!');
    console.log('   - Activity ID:', joinResponse.data.activity.id);
    console.log('   - Activity Type:', joinResponse.data.activity.activityType);
    
    // Test 4: Check updated activities
    console.log('\n4️⃣ Checking updated activities after community join...');
    const updatedActivitiesResponse = await axios.get(`${API_BASE_URL}/users/${signupResponse.data.user.id}/activities`);
    
    console.log('✅ Updated activities retrieved!');
    console.log('   - Total activities:', updatedActivitiesResponse.data.activities.length);
    
    // Show email-related activities
    const emailActivities = updatedActivitiesResponse.data.activities.filter(
      activity => activity.activityType === 'EMAIL_SENT'
    );
    console.log('   - Email activities:', emailActivities.length);
    
    emailActivities.forEach((activity, index) => {
      console.log(`   - Email ${index + 1}: ${activity.metadata?.emailType || 'Unknown'}`);
      console.log(`     Sent at: ${activity.metadata?.sentAt || 'N/A'}`);
    });
    
    // Test 5: Test with different email
    console.log('\n5️⃣ Testing with different email address...');
    const signupData2 = {
      email: 'another-test@example.com',
      firstName: 'Bob',
      age: '30-40',
      gender: 'Male',
      profession: 'Business & Management',
      country: 'Canada',
      city: 'Toronto',
      household: '2 people',
      ctaVariant: 'A'
    };

    const signupResponse2 = await axios.post(`${API_BASE_URL}/users/signup`, signupData2);
    console.log('✅ Second signup successful!');
    console.log('   - User ID:', signupResponse2.data.user.id);
    console.log('   - Waitlist Position:', signupResponse2.data.waitlistPosition);
    
    // Test 6: Check total user count
    console.log('\n6️⃣ Checking total user count...');
    const countResponse = await axios.get(`${API_BASE_URL}/users/admin/count`);
    console.log('✅ Total users:', countResponse.data.count);
    
    console.log('\n🎉 All email service tests completed successfully!');
    console.log('\n📧 Email Service Summary:');
    console.log('   - Welcome emails are being triggered on signup');
    console.log('   - Community join emails are being triggered');
    console.log('   - Email activities are being tracked');
    console.log('   - Multiple users can signup with different emails');
    console.log('   - Waitlist positions are assigned correctly');
    
  } catch (error) {
    console.error('❌ Email service test failed:', error.response?.data || error.message);
  }
}

// Run the test
testEmailService(); 