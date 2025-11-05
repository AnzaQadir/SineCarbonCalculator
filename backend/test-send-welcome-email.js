require('dotenv').config();
const { EmailService } = require('./api/services/emailService');

async function sendWelcomeEmail() {
  try {
    console.log('📧 Sending welcome email...\n');
    
    // Check if SENDGRID_API_KEY is set
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your_sendgrid_api_key_here') {
      console.error('❌ SENDGRID_API_KEY not configured!');
      console.log('\n📝 To send emails, you need to:');
      console.log('   1. Get your API key from SendGrid (https://sendgrid.com)');
      console.log('   2. Add it to your .env file:');
      console.log('      SENDGRID_API_KEY=SG.your_actual_api_key_here');
      console.log('      SENDGRID_FROM_EMAIL=zerrahworld@gmail.com');
      console.log('   3. Verify zerrahworld@gmail.com in SendGrid dashboard');
      console.log('   4. Run this script again\n');
      process.exit(1);
    }
    
    // Ensure SENDGRID_FROM_EMAIL is set
    process.env.SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'zerrahworld@gmail.com';
    
    // Create test user object
    const testUser = {
      email: 'anzaqadir123@gmail.com',
      firstName: 'Anza'
    };
    
    console.log('📤 Email Details:');
    console.log('   From:', process.env.SENDGRID_FROM_EMAIL);
    console.log('   To:', testUser.email);
    console.log('   Subject: Welcome to Zerrah — you\'re in good company!');
    console.log('   API Key:', process.env.SENDGRID_API_KEY.substring(0, 10) + '...\n');
    
    // Send welcome email
    console.log('1️⃣ Sending welcome email...');
    const result = await EmailService.sendWelcomeEmail(testUser);
    
    if (result) {
      console.log('\n✅ Welcome email sent successfully!');
      console.log('📬 Check your inbox at anzaqadir123@gmail.com');
      console.log('   (Also check spam folder if not in inbox)\n');
    } else {
      console.log('❌ Failed to send email');
    }
    
  } catch (error) {
    console.error('\n❌ Error sending email:', error.message);
    if (error.code === 401) {
      console.error('\n🔑 Authentication failed!');
      console.log('   - Check that your SENDGRID_API_KEY is correct');
      console.log('   - Make sure the API key has "Mail Send" permissions');
      console.log('   - Verify zerrahworld@gmail.com in SendGrid dashboard');
      if (error.response && error.response.body && error.response.body.errors) {
        console.error('\n   SendGrid Error Details:');
        error.response.body.errors.forEach((err, i) => {
          console.error(`   ${i + 1}. ${err.message || err}`);
        });
      }
      console.log('');
    } else if (error.response && error.response.body) {
      console.error('   SendGrid Response:', JSON.stringify(error.response.body, null, 2));
    }
    process.exit(1);
  }
}

// Run the test
sendWelcomeEmail();

