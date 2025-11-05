require('dotenv').config();
const axios = require('axios');

async function checkSendGridAccount() {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (!apiKey) {
      console.error('❌ SENDGRID_API_KEY not found');
      return;
    }
    
    console.log('🔍 Checking SendGrid Account Status\n');
    
    // Try to get account info using SendGrid API
    try {
      const response = await axios.get('https://api.sendgrid.com/v3/user/profile', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Account Info Retrieved:');
      console.log('   Email:', response.data.email);
      console.log('   First Name:', response.data.first_name);
      console.log('   Last Name:', response.data.last_name);
      console.log('   Company:', response.data.company);
      
    } catch (error) {
      if (error.response) {
        console.error('❌ Error accessing SendGrid account:');
        console.error('   Status:', error.response.status);
        console.error('   Message:', error.response.data?.errors?.[0]?.message || error.message);
        
        if (error.response.status === 401) {
          console.error('\n⚠️  API Key Authentication Failed!');
          console.error('   The API key may be invalid or revoked.');
          console.error('   Please check: https://app.sendgrid.com/settings/api_keys');
        }
      } else {
        console.error('❌ Network error:', error.message);
      }
    }
    
    // Try to get sender verification status
    try {
      console.log('\n📧 Checking Sender Verification Status...');
      const sendersResponse = await axios.get('https://api.sendgrid.com/v3/verified_senders', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const verifiedSenders = sendersResponse.data.results || [];
      console.log(`✅ Found ${verifiedSenders.length} verified sender(s):`);
      verifiedSenders.forEach((sender, i) => {
        console.log(`   ${i + 1}. ${sender.from.email} - Status: ${sender.verified ? '✅ Verified' : '❌ Not Verified'}`);
      });
      
      const zerrahSender = verifiedSenders.find(s => s.from.email === 'zerrahworld@gmail.com');
      if (zerrahSender) {
        console.log('\n✅ zerrahworld@gmail.com found!');
        console.log('   Status:', zerrahSender.verified ? '✅ Verified' : '❌ Not Verified');
        if (!zerrahSender.verified) {
          console.log('   ⚠️  Email is NOT verified yet!');
          console.log('   Please check your email inbox for verification link.');
        }
      } else {
        console.log('\n❌ zerrahworld@gmail.com NOT found in verified senders!');
        console.log('   Please verify it at: https://app.sendgrid.com/settings/sender_auth');
      }
      
    } catch (error) {
      if (error.response) {
        console.error('❌ Error checking sender verification:');
        console.error('   Status:', error.response.status);
        console.error('   Message:', error.response.data?.errors?.[0]?.message || error.message);
      } else {
        console.error('❌ Network error:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkSendGridAccount();

