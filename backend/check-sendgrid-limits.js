require('dotenv').config();
const axios = require('axios');

async function checkSendGridLimits() {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (!apiKey) {
      console.error('❌ SENDGRID_API_KEY not found');
      return;
    }
    
    console.log('🔍 Checking SendGrid Account Limits\n');
    
    // Check account usage/stats
    try {
      // Try to get usage stats
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`https://api.sendgrid.com/v3/stats?start_date=${today}&end_date=${today}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Today\'s Email Usage:');
      if (response.data && response.data.length > 0) {
        const todayStats = response.data[0];
        console.log('   Blocks:', todayStats.blocks || 0);
        console.log('   Bounce Drops:', todayStats.bounce_drops || 0);
        console.log('   Bounces:', todayStats.bounces || 0);
        console.log('   Clicks:', todayStats.clicks || 0);
        console.log('   Deferred:', todayStats.deferred || 0);
        console.log('   Delivered:', todayStats.delivered || 0);
        console.log('   Invalid Emails:', todayStats.invalid_emails || 0);
        console.log('   Opens:', todayStats.opens || 0);
        console.log('   Processed:', todayStats.processed || 0);
        console.log('   Requests:', todayStats.requests || 0);
        console.log('   Spam Reports:', todayStats.spam_reports || 0);
        console.log('   Spam Report Drops:', todayStats.spam_report_drops || 0);
        console.log('   Unsubscribe Drops:', todayStats.unsubscribe_drops || 0);
        console.log('   Unsubscribes:', todayStats.unsubscribes || 0);
      } else {
        console.log('   No stats available for today');
      }
      
    } catch (error) {
      if (error.response) {
        console.error('❌ Error checking stats:', error.response.status);
        if (error.response.data?.errors) {
          error.response.data.errors.forEach(err => {
            console.error('   -', err.message);
          });
        }
      }
    }
    
    // Check account details
    try {
      console.log('\n📋 Account Details:');
      const accountResponse = await axios.get('https://api.sendgrid.com/v3/user/account', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('   Type:', accountResponse.data.type);
      console.log('   Reputation:', accountResponse.data.reputation || 'N/A');
      
    } catch (error) {
      console.error('   Could not retrieve account details');
    }
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Check your SendGrid dashboard: https://app.sendgrid.com/stats/overview');
    console.log('   2. Verify you\'re on the Free Trial plan');
    console.log('   3. Check if there are any unpaid invoices');
    console.log('   4. If verified sender just completed, wait 5-10 minutes and try again');
    console.log('   5. Consider upgrading plan or wait for daily reset (midnight UTC)\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSendGridLimits();

