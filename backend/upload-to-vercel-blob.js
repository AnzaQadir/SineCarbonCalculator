const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

async function uploadEmailImage() {
  try {
    console.log('📤 Uploading email.png to Vercel Blob...');
    
    // Path to the email.png file
    const imagePath = path.join(__dirname, '../frontend/public/images/email.png');
    
    if (!fs.existsSync(imagePath)) {
      console.error('❌ email.png not found at:', imagePath);
      return;
    }

    // Read the file
    const file = fs.readFileSync(imagePath);
    
    // Upload to Vercel Blob
    const { url } = await put('email-assets/email.png', file, {
      access: 'public',
    });

    console.log('✅ Upload successful!');
    console.log('📎 Blob URL:', url);
    console.log('');
    console.log('💡 Update your email template to use:');
    console.log(url);
    console.log('');
    console.log('🔧 Or set up a custom domain:');
    console.log('1. Go to Vercel Dashboard > Settings > Domains');
    console.log('2. Add custom domain: cdn.zerrah.com');
    console.log('3. Update DNS records as instructed');
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    console.log('');
    console.log('💡 Make sure you have:');
    console.log('1. Vercel CLI installed: npm i -g vercel');
    console.log('2. Logged in: vercel login');
    console.log('3. @vercel/blob installed: npm install @vercel/blob');
  }
}

// Run the upload
uploadEmailImage(); 