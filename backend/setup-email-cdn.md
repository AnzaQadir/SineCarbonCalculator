# Email CDN Setup Guide

## Option 1: Cloudinary (Recommended)

### Step 1: Sign up for Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your credentials from the dashboard

### Step 2: Add environment variables
Add these to your `.env` file:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Install dependencies and upload
```bash
cd backend
npm install
node upload-to-cloudinary.js
```

### Step 4: Set up custom domain (Optional)
1. In Cloudinary dashboard, go to Settings > Upload
2. Add custom domain: `cdn.zerrah.com`
3. Update DNS records as instructed

## Option 2: Vercel Blob Storage

### Step 1: Install Vercel Blob
```bash
npm install @vercel/blob
```

### Step 2: Create upload script
```javascript
// upload-to-vercel-blob.js
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

async function uploadEmailImage() {
  try {
    const imagePath = path.join(__dirname, '../frontend/public/images/email.png');
    const file = fs.readFileSync(imagePath);
    
    const { url } = await put('email-assets/email.png', file, {
      access: 'public',
    });
    
    console.log('✅ Uploaded to Vercel Blob:', url);
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

uploadEmailImage();
```

## Option 3: GitHub Pages (Free)

### Step 1: Create a GitHub repository for assets
1. Create a new repo called `zerrah-assets`
2. Upload `email.png` to the repo
3. Enable GitHub Pages

### Step 2: Use the raw URL
```
https://raw.githubusercontent.com/yourusername/zerrah-assets/main/email.png
```

## Option 4: AWS S3 + CloudFront

### Step 1: Set up S3 bucket
1. Create S3 bucket: `zerrah-email-assets`
2. Upload `email.png`
3. Make it public

### Step 2: Set up CloudFront
1. Create CloudFront distribution
2. Point to S3 bucket
3. Use custom domain: `cdn.zerrah.com`

## Quick Test

After setting up any option, test the email:

```bash
cd backend
node test-email.js
```

The email template will use: `https://cdn.zerrah.com/email-assets/email.png` 