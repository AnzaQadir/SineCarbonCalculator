require('dotenv').config();
const { EmailService } = require('./api/services/emailService');
const { GmailService } = require('./api/services/gmailService');

async function sendViaGmail() {
  try {
    console.log('📧 Sending Welcome Email via Gmail SMTP\n');
    
    // Check if Gmail is configured
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ GMAIL_APP_PASSWORD not configured!');
      console.log('\n📝 To use Gmail SMTP:');
      console.log('   1. Go to: https://myaccount.google.com/apppasswords');
      console.log('   2. Sign in with zerrahworld@gmail.com');
      console.log('   3. Generate App Password for "Mail"');
      console.log('   4. Add to .env:');
      console.log('      GMAIL_USER=zerrahworld@gmail.com');
      console.log('      GMAIL_APP_PASSWORD=your_16_char_password\n');
      process.exit(1);
    }
    
    const testUser = {
      email: 'anzaqadir123@gmail.com',
      firstName: 'Anza'
    };
    
    console.log('📤 Email Details:');
    console.log('   From: zerrahworld@gmail.com (via Gmail SMTP)');
    console.log('   To:', testUser.email);
    console.log('   Subject: Welcome to Zerrah — you\'re in good company!\n');
    
    console.log('1️⃣ Sending welcome email via Gmail SMTP...');
    const result = await GmailService.sendWelcomeEmail(testUser);
    
    if (result) {
      console.log('\n✅ Welcome email sent successfully via Gmail!');
      console.log('📬 Check your inbox at anzaqadir123@gmail.com');
      console.log('   (Also check spam folder if not in inbox)\n');
    } else {
      console.log('❌ Failed to send email via Gmail');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

sendViaGmail();

