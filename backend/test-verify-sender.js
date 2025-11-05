require('dotenv').config();
const sgMail = require('@sendgrid/mail');

async function verifySenderSetup() {
  console.log('🔍 Verifying SendGrid Sender Setup\n');
  
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'zerrahworld@gmail.com';
  
  if (!apiKey) {
    console.error('❌ SENDGRID_API_KEY not found');
    return;
  }
  
  sgMail.setApiKey(apiKey);
  
  console.log('📋 Current Configuration:');
  console.log('   From Email:', fromEmail);
  console.log('   API Key:', apiKey.substring(0, 15) + '...\n');
  
  console.log('⚠️  IMPORTANT: The "Maximum credits exceeded" error can occur if:');
  console.log('   1. The sender email is NOT verified in SendGrid');
  console.log('   2. The account has hit daily limits');
  console.log('   3. There are unpaid invoices\n');
  
  console.log('✅ To Fix:');
  console.log('   1. Go to: https://app.sendgrid.com/settings/sender_auth');
  console.log('   2. Click "Single Sender Verification"');
  console.log('   3. Click "Create New Sender"');
  console.log(`   4. Enter: ${fromEmail}`);
  console.log('   5. Fill in the form and verify the email');
  console.log('   6. Check your email inbox and click the verification link');
  console.log('   7. Wait for status to show "Verified"\n');
  
  console.log('💡 Alternative: Use Gmail SMTP (if you have Gmail access)');
  console.log('   This works without SendGrid but requires Gmail App Password\n');
}

verifySenderSetup();

