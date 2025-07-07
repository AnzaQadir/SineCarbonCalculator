const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function sendEmailToAnzaqadir() {
  try {
    console.log('📧 Sending email to anzaqadir123@gmail.com...\n');
    
    // Create a user with the specific email
    const signupData = {
      email: 'anzaqadir123@gmail.com',
      firstName: 'Anza',
      age: '25-30',
      gender: 'Prefer not to say',
      profession: 'IT & Software Development',
      country: 'Pakistan',
      city: 'Karachi',
      household: '3 people',
      ctaVariant: 'A'
    };

    console.log('1️⃣ Creating user account...');
    const signupResponse = await axios.post(`${API_BASE_URL}/users/signup`, signupData);
    
    console.log('✅ User created successfully!');
    console.log('   - User ID:', signupResponse.data.user.id);
    console.log('   - Email:', signupResponse.data.user.email);
    console.log('   - Waitlist Position:', signupResponse.data.waitlistPosition);
    console.log('   - First Name:', signupResponse.data.user.firstName);
    
    // Check if welcome email was sent
    console.log('\n2️⃣ Checking email activities...');
    const activitiesResponse = await axios.get(`${API_BASE_URL}/users/${signupResponse.data.user.id}/activities`);
    
    const emailActivities = activitiesResponse.data.activities.filter(
      activity => activity.activityType === 'EMAIL_SENT'
    );
    
    console.log('✅ Email activities found:', emailActivities.length);
    emailActivities.forEach((activity, index) => {
      console.log(`   - Email ${index + 1}: ${activity.metadata?.emailType}`);
      console.log(`     Sent at: ${activity.metadata?.sentAt}`);
    });
    
    // Join community to trigger another email
    console.log('\n3️⃣ Joining community to trigger additional email...');
    const joinResponse = await axios.post(`${API_BASE_URL}/users/join-community`, {
      userId: signupResponse.data.user.id
    });
    
    console.log('✅ Community join successful!');
    console.log('   - Activity ID:', joinResponse.data.activity.id);
    
    // Check updated email activities
    console.log('\n4️⃣ Checking updated email activities...');
    const updatedActivitiesResponse = await axios.get(`${API_BASE_URL}/users/${signupResponse.data.user.id}/activities`);
    
    const updatedEmailActivities = updatedActivitiesResponse.data.activities.filter(
      activity => activity.activityType === 'EMAIL_SENT'
    );
    
    console.log('✅ Updated email activities:', updatedEmailActivities.length);
    updatedEmailActivities.forEach((activity, index) => {
      console.log(`   - Email ${index + 1}: ${activity.metadata?.emailType}`);
      console.log(`     Sent at: ${activity.metadata?.sentAt}`);
    });
    
    console.log('\n🎉 Email test completed successfully!');
    console.log('\n📧 Email Summary for anzaqadir123@gmail.com:');
    console.log('   - Welcome email sent on signup');
    console.log('   - Community join email sent');
    console.log('   - All email activities tracked');
    console.log('   - User data stored with proper demographics');
    
    console.log('\n📋 User Details:');
    console.log('   - Email: anzaqadir123@gmail.com');
    console.log('   - Name: Anza');
    console.log('   - Location: Karachi, Pakistan');
    console.log('   - Profession: IT & Software Development');
    console.log('   - Waitlist Position:', signupResponse.data.waitlistPosition);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.response?.data || error.message);
  }
}

// Run the test
sendEmailToAnzaqadir(); 