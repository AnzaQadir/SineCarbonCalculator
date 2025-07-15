const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please add to your .env file:');
  console.log('SUPABASE_URL=your_supabase_url');
  console.log('SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadEmailImage() {
  try {
    console.log('📤 Uploading email.png to Supabase Storage...');
    
    // Path to the email.png file
    const imagePath = path.join(__dirname, '../frontend/public/images/email.png');
    
    if (!fs.existsSync(imagePath)) {
      console.error('❌ email.png not found at:', imagePath);
      return;
    }

    // Read the file
    const file = fs.readFileSync(imagePath);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('email-assets')
      .upload('email.png', file, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('email-assets')
      .getPublicUrl('email.png');

    console.log('✅ Upload successful!');
    console.log('📎 Public URL:', publicUrl);
    console.log('');
    console.log('💡 Update your email template to use:');
    console.log(publicUrl);
    console.log('');
    console.log('🔧 To set up custom domain:');
    console.log('1. Go to Supabase Dashboard > Storage > Settings');
    console.log('2. Add custom domain: cdn.zerrah.com');
    console.log('3. Update DNS records as instructed');
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    console.log('');
    console.log('💡 Make sure you have:');
    console.log('1. @supabase/supabase-js installed: npm install @supabase/supabase-js');
    console.log('2. Created a storage bucket called "email-assets"');
    console.log('3. Set bucket to public');
  }
}

// Run the upload
uploadEmailImage(); 