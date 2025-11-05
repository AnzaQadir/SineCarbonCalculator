# Email Setup Guide

## Current Issue: "Maximum Credits Exceeded"

Even with a new SendGrid account showing 0 emails sent, you're getting this error. **This is usually because the sender email is NOT verified.**

## Solution 1: Verify Sender Email in SendGrid (RECOMMENDED)

1. Go to: https://app.sendgrid.com/settings/sender_auth
2. Click **"Single Sender Verification"**
3. Click **"Create New Sender"**
4. Enter: `zerrahworld@gmail.com`
5. Fill in:
   - From Name: `Zerrah`
   - From Email: `zerrahworld@gmail.com`
   - Reply To: `zerrahworld@gmail.com`
   - Company Address
   - City, State, Country
6. Click **"Create"**
7. Check your email inbox (`zerrahworld@gmail.com`)
8. Click the verification link
9. Wait for status to show **"Verified"** (green checkmark)

Once verified, try sending again!

## Solution 2: Use Gmail SMTP (Alternative)

If you have access to `zerrahworld@gmail.com`, you can use Gmail SMTP directly:

### Setup Gmail App Password:

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with `zerrahworld@gmail.com`
3. Select **"Mail"** and **"Other (Custom name)"**
4. Enter name: "Zerrah Backend"
5. Click **"Generate"**
6. Copy the 16-character password (no spaces)

### Add to .env file:

```env
GMAIL_USER=zerrahworld@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password_here
```

The system will automatically fallback to Gmail SMTP if SendGrid fails!

## About Twilio

Twilio does **NOT** have an email sending service. Twilio focuses on:
- SMS messaging
- Voice calls
- WhatsApp messaging

For email, use:
- ✅ SendGrid (current)
- ✅ Gmail SMTP (fallback we just added)
- ✅ Resend (modern alternative)
- ✅ Mailgun (alternative)
- ✅ AWS SES (Amazon Simple Email Service)

## Testing

After setting up, test with:
```bash
cd backend
node test-send-welcome-email.js
```

