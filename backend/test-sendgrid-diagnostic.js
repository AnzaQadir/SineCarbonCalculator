require('dotenv').config();
const sgMail = require('@sendgrid/mail');

async function diagnoseSendGrid() {
  try {
    console.log('🔍 SendGrid Diagnostic Test\n');
    
    // Check configuration
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'zerrahworld@gmail.com';
    
    if (!apiKey || apiKey === 'your_sendgrid_api_key_here') {
      console.error('❌ SENDGRID_API_KEY not configured');
      return;
    }
    
    console.log('✅ Configuration Found:');
    console.log('   API Key:', apiKey.substring(0, 15) + '...');
    console.log('   From Email:', fromEmail);
    console.log('');
    
    // Set API key
    sgMail.setApiKey(apiKey);
    
    // Try to send a simple test email
    console.log('📧 Attempting to send test email...');
    const msg = {
      to: 'anzaqadir123@gmail.com',
      from: fromEmail,
      subject: 'Test Email from Zerrah',
      text: 'This is a test email to verify SendGrid configuration.',
      html: '<p>This is a test email to verify SendGrid configuration.</p>'
    };
    
    const [response] = await sgMail.send(msg);
    
    console.log('✅ Email sent successfully!');
    console.log('   Status Code:', response.statusCode);
    console.log('   Headers:', JSON.stringify(response.headers, null, 2));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.response) {
      const errors = error.response.body?.errors || [];
      console.error('\n📋 SendGrid Error Details:');
      errors.forEach((err, i) => {
        console.error(`   ${i + 1}. ${err.message}`);
        if (err.field) {
          console.error(`      Field: ${err.field}`);
        }
        if (err.help) {
          console.error(`      Help: ${err.help}`);
        }
      });
      
      // Specific error handling
      const errorMessage = errors[0]?.message?.toLowerCase() || '';
      
      if (errorMessage.includes('credits') || errorMessage.includes('maximum')) {
        console.error('\n💡 Solution: Your SendGrid account has hit the daily limit.');
        console.error('   - Free tier: 100 emails/day');
        console.error('   - Check: https://app.sendgrid.com/stats/overview');
      } else if (errorMessage.includes('sender') || errorMessage.includes('verify')) {
        console.error('\n💡 Solution: Sender email not verified!');
        console.error(`   - Verify ${fromEmail} in SendGrid:`);
        console.error('   - Go to: https://app.sendgrid.com/settings/sender_auth');
        console.error('   - Click "Single Sender Verification"');
        console.error('   - Add and verify your email address');
      } else if (errorMessage.includes('unauthorized')) {
        console.error('\n💡 Solution: API key issue!');
        console.error('   - Check API key is correct');
        console.error('   - Verify API key has "Mail Send" permissions');
        console.error('   - Get new key: https://app.sendgrid.com/settings/api_keys');
      }
    }
  }
}

diagnoseSendGrid();

