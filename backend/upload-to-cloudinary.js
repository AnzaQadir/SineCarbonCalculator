const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadEmailImage() {
  try {
    // Path to the email.png file
    const imagePath = path.join(__dirname, '../frontend/public/images/email.png');
    
    if (!fs.existsSync(imagePath)) {
      console.error('❌ email.png not found at:', imagePath);
      return;
    }

    console.log('📤 Uploading email.png to Cloudinary...');
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'zerrah/email-assets',
      public_id: 'email',
      overwrite: true,
      resource_type: 'image'
    });

    console.log('✅ Upload successful!');
    console.log('📎 Public URL:', result.secure_url);
    console.log('🔗 CDN URL:', `https://cdn.zerrah.com/email-assets/email.png`);
    console.log('');
    console.log('💡 Update your email template to use:');
    console.log('https://cdn.zerrah.com/email-assets/email.png');
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

// Run the upload
uploadEmailImage(); 