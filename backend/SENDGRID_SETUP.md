# SendGrid Integration Guide

This guide will help you set up SendGrid to send real emails through your Zerrah application.

## 🚀 Quick Setup

### 1. Create SendGrid Account

1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for a free account (100 emails/day)
3. Verify your email address

### 2. Get Your API Key

1. Log into your SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Choose **Full Access** or **Restricted Access** (Mail Send)
5. Copy the API key (you won't see it again!)

### 3. Verify Your Sender Domain

1. Go to **Settings** → **Sender Authentication**
2. Choose **Domain Authentication** (recommended) or **Single Sender Verification**
3. Follow the DNS setup instructions
4. Wait for verification (can take up to 48 hours)

### 4. Set Environment Variables

Create a `.env` file in your backend directory:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

## 🔧 Configuration Options

### Option 1: Single Sender Verification (Quick Start)

1. Go to **Settings** → **Sender Authentication**
2. Click **Single Sender Verification**
3. Add your email: `noreply@yourdomain.com`
4. Verify the email link sent to your inbox
5. Use this email as your `SENDGRID_FROM_EMAIL`

### Option 2: Domain Authentication (Recommended)

1. Go to **Settings** → **Sender Authentication**
2. Click **Domain Authentication**
3. Enter your domain: `yourdomain.com`
4. Add the required DNS records to your domain
5. Wait for verification
6. Use any email from your domain as `SENDGRID_FROM_EMAIL`

## 📧 Testing Your Setup

### 1. Test with Environment Variables

```bash
# Set your API key temporarily
export SENDGRID_API_KEY=SG.your_api_key_here
export SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Run the test
cd backend
node test-specific-email.js
```

### 2. Test with .env File

Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### 3. Verify Email Delivery

1. Check your SendGrid dashboard → **Activity** → **Email Activity**
2. Look for successful deliveries
3. Check spam folder if emails don't arrive

## 🛠️ Troubleshooting

### Common Issues

#### 1. "API Key not found"
- Make sure `SENDGRID_API_KEY` is set in your environment
- Check that the API key is correct and active

#### 2. "Sender not verified"
- Verify your sender email in SendGrid dashboard
- Wait for domain verification to complete
- Use a verified sender email

#### 3. "Emails not delivered"
- Check SendGrid Activity dashboard
- Verify recipient email is valid
- Check spam/junk folders

#### 4. "Rate limit exceeded"
- Free tier: 100 emails/day
- Upgrade to paid plan for more emails
- Check your usage in SendGrid dashboard

### Debug Mode

Add this to your `.env` file for detailed logging:

```env
DEBUG_SENDGRID=true
```

## 📊 Monitoring

### SendGrid Dashboard

1. **Activity** → **Email Activity**: See all sent emails
2. **Reports** → **Email Reports**: Analytics and metrics
3. **Settings** → **API Keys**: Manage your API keys

### Key Metrics to Monitor

- **Delivery Rate**: Should be >95%
- **Bounce Rate**: Should be <5%
- **Open Rate**: Track engagement
- **Click Rate**: Track link clicks

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor usage** to prevent abuse
5. **Use restricted API keys** when possible

## 💰 Pricing

### Free Tier
- 100 emails/day
- Full API access
- Basic analytics

### Paid Plans
- **Essentials**: $14.95/month for 50,000 emails
- **Pro**: $89.95/month for 100,000 emails
- **Premier**: Custom pricing

## 🚀 Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard:
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`

2. Deploy your application

### Other Platforms

Add the same environment variables to your hosting platform:
- Heroku: `heroku config:set SENDGRID_API_KEY=your_key`
- Railway: Add in dashboard
- DigitalOcean: Add in app settings

## 📝 Example Usage

### Test Script

```javascript
// test-sendgrid.js
const axios = require('axios');

async function testSendGrid() {
  const response = await axios.post('http://localhost:3000/api/users/signup', {
    email: 'test@example.com',
    firstName: 'Test',
    // ... other fields
  });
  
  console.log('Email sent via SendGrid!');
}

testSendGrid();
```

### Environment Variables

```bash
# .env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@zerrah.com
```

## 🎯 Next Steps

1. ✅ Set up SendGrid account
2. ✅ Get API key
3. ✅ Verify sender email
4. ✅ Set environment variables
5. ✅ Test email sending
6. ✅ Monitor delivery rates
7. ✅ Scale as needed

Your email system is now ready for production! 🎉 