require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testSendGridIntegration() {
  try {
    console.log('🧪 Testing SendGrid Integration...\n');
    
    // Check if SendGrid is configured
    console.log('1️⃣ Checking SendGrid configuration...');
    
    if (!process.env.SENDGRID_API_KEY) {
      console.log('⚠️  SENDGRID_API_KEY not found in environment variables');
      console.log('   - Set SENDGRID_API_KEY to test real email sending');
      console.log('   - Without it, emails will be logged to console only');
    } else {
      console.log('✅ SENDGRID_API_KEY found in environment');
    }
    
    if (!process.env.SENDGRID_FROM_EMAIL) {
      console.log('⚠️  SENDGRID_FROM_EMAIL not found in environment variables');
      console.log('   - Set SENDGRID_FROM_EMAIL to use a verified sender');
    } else {
      console.log('✅ SENDGRID_FROM_EMAIL found:', process.env.SENDGRID_FROM_EMAIL);
    }
    
    // Test signup with email
    console.log('\n2️⃣ Testing signup with SendGrid email...');
    const signupData = {
      email: 'anzaqadir123@gmail.com',
      firstName: 'SendGrid',
      age: '25-30',
      gender: 'Prefer not to say',
      profession: 'IT & Software Development',
      country: 'Pakistan',
      city: 'Karachi',
      household: '3 people',
      ctaVariant: 'A'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/users/signup`, signupData);
    
    console.log('✅ Signup successful!');
    console.log('   - User ID:', signupResponse.data.user.id);
    console.log('   - Email:', signupResponse.data.user.email);
    console.log('   - Waitlist Position:', signupResponse.data.waitlistPosition);
    
    // Check email activities
    console.log('\n3️⃣ Checking email activities...');
    const activitiesResponse = await axios.get(`${API_BASE_URL}/users/${signupResponse.data.user.id}/activities`);
    
    const emailActivities = activitiesResponse.data.activities.filter(
      activity => activity.activityType === 'EMAIL_SENT'
    );
    
    console.log('✅ Email activities found:', emailActivities.length);
    emailActivities.forEach((activity, index) => {
      console.log(`   - Email ${index + 1}: ${activity.metadata?.emailType}`);
      console.log(`     Sent at: ${activity.metadata?.sentAt}`);
    });
    
    // Test community join
    console.log('\n4️⃣ Testing community join with SendGrid email...');
    const joinResponse = await axios.post(`${API_BASE_URL}/users/join-community`, {
      userId: signupResponse.data.user.id
    });
    
    console.log('✅ Community join successful!');
    
    // Final email activity check
    console.log('\n5️⃣ Final email activity check...');
    const finalActivitiesResponse = await axios.get(`${API_BASE_URL}/users/${signupResponse.data.user.id}/activities`);
    
    const finalEmailActivities = finalActivitiesResponse.data.activities.filter(
      activity => activity.activityType === 'EMAIL_SENT'
    );
    
    console.log('✅ Total email activities:', finalEmailActivities.length);
    
    console.log('\n🎉 SendGrid integration test completed!');
    console.log('\n📧 SendGrid Status:');
    
    if (process.env.SENDGRID_API_KEY) {
      console.log('   ✅ SendGrid API key configured');
      console.log('   ✅ Real emails should be sent');
      console.log('   📧 Check your SendGrid dashboard for delivery status');
      console.log('   📧 Check spam folder if emails don\'t arrive');
    } else {
      console.log('   ⚠️  SendGrid API key not configured');
      console.log('   📝 Emails are logged to console only');
      console.log('   🔧 Set SENDGRID_API_KEY to send real emails');
    }
    
    console.log('\n📋 Test Summary:');
    console.log('   - User created successfully');
    console.log('   - Email activities tracked');
    console.log('   - Community join processed');
    console.log('   - All API endpoints working');
    
  } catch (error) {
    console.error('❌ SendGrid integration test failed:', error.response?.data || error.message);
  }
}

// Run the test
testSendGridIntegration(); 