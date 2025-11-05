"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
class EmailService {
    /**
     * Send welcome email to new user
     */
    static async sendWelcomeEmail(user) {
        try {
            const emailData = {
                to: user.email,
                subject: `🌿 Welcome to Zerrah — you're in good company!`,
                html: this.generateWelcomeEmailHTML(user),
                text: this.generateWelcomeEmailText(user),
            };
            await this.sendEmail(emailData);
            console.log(`Welcome email sent to ${user.email}`);
            return true;
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
            return false;
        }
    }
    /**
     * Send community join confirmation email
     */
    static async sendCommunityJoinEmail(user) {
        try {
            const emailData = {
                to: user.email,
                subject: `You've joined the Zerrah Community! 🌱`,
                html: this.generateCommunityJoinEmailHTML(user),
                text: this.generateCommunityJoinEmailText(user),
            };
            await this.sendEmail(emailData);
            console.log(`Community join email sent to ${user.email}`);
            return true;
        }
        catch (error) {
            console.error('Error sending community join email:', error);
            return false;
        }
    }
    /**
     * Generate welcome email HTML
     */
    static generateWelcomeEmailHTML(user) {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Zerrah</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #FCFCF8;
            margin: 0;
            padding: 0;
            color: #3a3a2c;
            line-height: 1.7;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 16px 12px;
            background: transparent;
          }
          .content {
            padding: 28px 24px;
            background: #FFFFFF;
            border-radius: 24px;
            box-shadow: 0 4px 20px 0 rgba(0,0,0,0.06);
          }
          .bobo-header {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 20px;
          }
          .bobo-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #FCFCF8;
          }
          .bobo-name {
            font-size: 1.3rem;
            font-weight: 600;
            color: #126E6E;
            margin: 0;
            letter-spacing: -0.01em;
          }
          .greeting {
            font-size: 1.15rem;
            color: #3a3a2c;
            margin: 0 0 16px 0;
            font-weight: 500;
          }
          .intro {
            color: #4a4a3a;
            margin-bottom: 16px;
            font-size: 1.05rem;
            line-height: 1.75;
          }
          .intro emoji {
            font-size: 1.2em;
            display: inline-block;
          }
          .section-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #E4C770 20%, #B4C3A0 50%, #E87A59 80%, transparent);
            margin: 20px 0;
            border: none;
          }
          .features-header {
            color: #126E6E;
            font-weight: 600;
            font-size: 1.1rem;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .features {
            margin: 20px 0;
            padding: 16px 0;
          }
          .features ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .features li {
            padding: 12px 0;
            color: #4a4a3a;
            font-size: 1rem;
            line-height: 1.65;
            border-bottom: 1px solid #F0F0EC;
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }
          .features li:last-child {
            border-bottom: none;
          }
          .feature-emoji {
            font-size: 1.4em;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .feature-content {
            flex: 1;
          }
          .features strong {
            color: #126E6E;
            font-weight: 600;
            display: block;
            margin-bottom: 6px;
          }
          .from-me-section {
            margin: 20px 0;
            padding: 20px 18px;
            background: linear-gradient(135deg, #FCFCF8 0%, #F8F7F3 100%);
            border-radius: 16px;
            border-left: 3px solid #E87A59;
          }
          .from-me-title {
            color: #126E6E;
            font-weight: 600;
            font-size: 1rem;
            margin: 0 0 16px 0;
          }
          .from-me-text {
            color: #4a4a3a;
            font-size: 1rem;
            line-height: 1.75;
            margin: 0;
          }
          .button-wrapper {
            text-align: center;
            margin: 24px 0 20px 0;
          }
          .button {
            display: inline-block;
            padding: 16px 40px;
            background: #126E6E;
            color: #FFFFFF !important;
            text-decoration: none;
            border-radius: 50px;
            font-size: 1.05rem;
            font-weight: 600;
            text-align: center;
            box-shadow: 0 4px 12px 0 rgba(18, 110, 110, 0.25);
            transition: all 0.3s ease;
            letter-spacing: -0.01em;
          }
          .button:hover {
            background: #0F5A5A;
            box-shadow: 0 6px 16px 0 rgba(18, 110, 110, 0.35);
            transform: translateY(-1px);
          }
          .closing-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #F0F0EC;
          }
          .closing-text {
            color: #4a4a3a;
            font-size: 1rem;
            line-height: 1.75;
            margin: 0 0 16px 0;
          }
          .signature {
            margin-top: 16px;
          }
          .signature p {
            color: #4a4a3a;
            margin: 8px 0;
            font-size: 1rem;
          }
          .signature strong {
            color: #126E6E;
            font-weight: 600;
          }
          .signature .signature-name {
            font-size: 1.15rem;
            color: #126E6E;
            margin: 12px 0 8px 0;
          }
          .signature .signature-title {
            font-size: 0.95rem;
            color: #B4C3A0;
            margin-top: 8px;
          }
          .footer {
            margin-top: 20px;
            padding: 20px 0 16px 0;
            border-top: 1px solid #F0F0EC;
          }
          .footer-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 20px;
          }
          .footer-panda {
            flex: 0 0 auto;
          }
          .footer-panda img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
          }
          .footer-logo {
            flex: 1;
            text-align: center;
            min-width: 200px;
          }
          .logo-dots {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }
          .logo-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
          }
          .tagline {
            color: #126E6E;
            font-size: 0.9rem;
            font-weight: 500;
            margin: 0;
            letter-spacing: 0.02em;
          }
          .social-links {
            text-align: center;
            margin: 16px 0 12px 0;
          }
          .social-links a {
            color: #126E6E;
            text-decoration: none;
            font-size: 0.95rem;
            margin: 0 12px;
            font-weight: 500;
            transition: color 0.2s ease;
          }
          .social-links a:hover {
            color: #0F5A5A;
            text-decoration: underline;
          }
          .footer-bottom {
            text-align: center;
            color: #B4C3A0;
            font-size: 0.85rem;
            margin-top: 20px;
          }
          @media (max-width: 600px) {
            .container { padding: 16px 12px !important; }
            .content { padding: 32px 24px !important; border-radius: 20px; }
            .bobo-header { margin-bottom: 24px; }
            .features li { padding: 16px 0; }
            .button { padding: 14px 32px; font-size: 1rem; }
            .footer-content { flex-direction: column; text-align: center; }
            .footer-panda { margin: 0 auto; }
            .social-links a { display: block; margin: 8px 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <div class="bobo-header">
              <img src="https://zerrah.com/images/cute_panda.png" alt="Bobo" class="bobo-avatar" />
              <p class="bobo-name">Bobo</p>
            </div>
            
            <p class="greeting">Hey friend,</p>
            
            <p class="intro">
              I'm Bobo, your panda pal here at Zerrah <span style="font-size: 1.1em;">🐼</span>.
            </p>
            
            <p class="intro">
              First things first: <strong>welcome aboard!</strong> <span style="font-size: 1.2em;">🎉✨</span>
            </p>
            
            <p class="intro">
              You've just joined a space where climate action feels a little lighter — less about pressure, and more about presence.
              Here, we believe that change begins with curiosity, not perfection.
            </p>
            
            <hr class="section-divider" />
            
            <div class="features">
              <p class="features-header">
                <span style="font-size: 1.2em;">🌈</span>
                Here's what's waiting for you inside Zerrah:
              </p>
              <ul>
                <li>
                  <span class="feature-emoji">🧭</span>
                  <div class="feature-content">
                    <strong>Personality quiz:</strong>
                    Discover your Zerrah Archetype — your unique reflection of how you connect with the planet.
                  </div>
                </li>
                <li>
                  <span class="feature-emoji">📈</span>
                  <div class="feature-content">
                    <strong>Personalized dashboard:</strong>
                    See your impact in everyday terms — from coffee cups and commutes to burgers and weekend getaways.
                    Watch how small shifts add up to something big.
                  </div>
                </li>
                <li>
                  <span class="feature-emoji">💡</span>
                  <div class="feature-content">
                    <strong>Actionable steps:</strong>
                    Get nudges and tips that fit your lifestyle — gentle, guilt-free, and totally doable.
                    No "go zero-waste overnight" speeches here — just progress that feels good.
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="from-me-section">
              <p class="from-me-title">💬 From me, to you</p>
              <p class="from-me-text">
                I'll be popping up along the way to cheer you on <span style="font-size: 1.1em;">🏆</span>, celebrate your wins, and maybe share a joke or two <span style="font-size: 1.1em;">😄</span>.
                Change doesn't have to be lonely — we'll walk (or waddle) through it together.
              </p>
            </div>
            
            <div class="button-wrapper">
              <a href="https://zerrah.com/quiz" class="button">🌿 Take the Quiz and Meet Your Archetype</a>
            </div>
            
            <div class="closing-section">
              <p class="closing-text">
                Glad you're here. Let's make change feel human — one small step (and one panda hug) at a time. <span style="font-size: 1.1em;">🤗</span>
              </p>
              
              <div class="signature">
                <p style="margin: 0;"><strong>Big (panda) hugs,</strong></p>
                <p class="signature-name"><strong>Bobo</strong> <span style="font-size: 1.1em;">🐼</span></p>
                <p class="signature-title">Your Zerrah guide</p>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <div class="footer-panda">
                <img src="https://zerrah.com/images/cute_panda.png" alt="Bobo" />
              </div>
              <div class="footer-logo">
                <img src="https://zerrah.com/images/new_logo.png" alt="Zerrah" style="max-width: 180px; height: auto; margin: 0 auto 12px auto; display: block;" />
                <p class="tagline">Small actions. Big climate impact.</p>
              </div>
            </div>
            
            <div class="social-links">
              <a href="https://instagram.com/zerrah" target="_blank" rel="noopener">Instagram</a>
              <a href="https://tiktok.com/@zerrah" target="_blank" rel="noopener">TikTok</a>
              <a href="https://linkedin.com/company/zerrah" target="_blank" rel="noopener">LinkedIn</a>
            </div>
            
            <div class="footer-bottom">
              <p style="margin: 0;">Questions? Reply to this email and we'll get back to you.</p>
              <p style="margin: 8px 0 0 0;">© 2024 Zerrah. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    /**
     * Generate welcome email text version
     */
    static generateWelcomeEmailText(user) {
        return `
Welcome to Zerrah — you're in good company!

Hey friend,

I'm Bobo, your panda pal here at Zerrah. First things first: *welcome aboard!* 🎉

You've just joined a space where climate action is less about pressure and more about presence.

Here's what you can look forward to:

- **Personality quiz:** Discover your Zerrah Archetype

- **Personalized dashboard:** See your impact in everyday terms (think coffee cups, car rides, and burgers)

- **Actionable steps:** Get nudges and tips that actually fit your lifestyle, without the guilt trips and "go zero-waste overnight"

I'll be popping up along the way to cheer you on, celebrate your wins, and maybe share a joke or two.

Take the Quiz and Meet Your Archetype
https://zerrah.com/quiz

Glad you're here. Let's make change feel human, one small step at a time.

Big (panda) hugs,

Bobo
Your Zerrah guide

Questions? Reply to this email and we'll get back to you.

© 2024 Zerrah. All rights reserved.
    `;
    }
    /**
     * Generate community join email HTML
     */
    static generateCommunityJoinEmailHTML(user) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to the Zerrah Community</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px; }
          .content { padding: 30px; background: #fff; }
          .button { display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .highlight { background: #d1fae5; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0;">Welcome to the Community! 🌱</h1>
            <p style="color: white; margin: 10px 0 0 0;">You're now part of something bigger</p>
          </div>
          
          <div class="content">
            <h2>Hi ${user.firstName || 'Friend'}! 👋</h2>
            
            <p>Great news! You've successfully joined the Zerrah community. You're now connected with thousands of climate champions who are making a difference every day.</p>
            
            <div class="highlight">
              <h3>🎉 You're In!</h3>
              <p>Your community membership is now active. Start exploring, connecting, and making an impact!</p>
            </div>
            
            <h3>What You Can Do Now:</h3>
            <ul>
              <li><strong>Connect:</strong> Meet fellow climate enthusiasts</li>
              <li><strong>Share:</strong> Your climate journey and tips</li>
              <li><strong>Learn:</strong> From community experts and resources</li>
              <li><strong>Act:</strong> Join challenges and initiatives</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" class="button">Explore Community</a>
            </div>
            
            <p>Ready to start your climate journey? The community is waiting for you!</p>
          </div>
          
          <div class="footer">
            <p>Questions? Reply to this email and we'll get back to you.</p>
            <p>© 2024 Zerrah. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    /**
     * Generate community join email text version
     */
    static generateCommunityJoinEmailText(user) {
        return `
Welcome to the Community! 🌱

Hi ${user.firstName || 'Friend'}! 👋

Great news! You've successfully joined the Zerrah community. You're now connected with thousands of climate champions who are making a difference every day.

🎉 You're In!

Your community membership is now active. Start exploring, connecting, and making an impact!

What You Can Do Now:
- Connect: Meet fellow climate enthusiasts
- Share: Your climate journey and tips  
- Learn: From community experts and resources
- Act: Join challenges and initiatives

Ready to start your climate journey? The community is waiting for you!

Questions? Reply to this email and we'll get back to you.

© 2024 Zerrah. All rights reserved.
    `;
    }
    /**
     * Send email using SendGrid
     */
    static async sendEmail(emailData) {
        try {
            // Get SendGrid API key from environment
            const sendgridApiKey = process.env.SENDGRID_API_KEY;
            if (!sendgridApiKey) {
                console.warn('⚠️ SENDGRID_API_KEY not found in environment variables. Using console logging instead.');
                console.log('📧 Email would be sent:', {
                    to: emailData.to,
                    subject: emailData.subject,
                    htmlLength: emailData.html.length,
                });
                return;
            }
            // Configure SendGrid
            mail_1.default.setApiKey(sendgridApiKey);
            
            // Get from email - default to zerrahworld@gmail.com if not set
            const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'zerrahworld@gmail.com';
            
            // Prepare email message
            const msg = {
                to: emailData.to,
                from: fromEmail,
                subject: emailData.subject,
                html: emailData.html,
                text: emailData.text,
            };
            
            console.log('📤 Attempting to send email via SendGrid:', {
                from: fromEmail,
                to: emailData.to,
                subject: emailData.subject
            });
            
            // Send email
            const [response] = await mail_1.default.send(msg);
            console.log('📧 Email sent successfully via SendGrid:', {
                to: emailData.to,
                subject: emailData.subject,
                statusCode: response.statusCode,
                headers: response.headers,
            });
        }
        catch (error) {
            console.error('❌ Error sending email via SendGrid:', error.message);
            
            // Provide more specific error information
            if (error.code === 401) {
                const errorMessage = error.response?.body?.errors?.[0]?.message || '';
                
                if (errorMessage.toLowerCase().includes('credits') || errorMessage.toLowerCase().includes('maximum')) {
                    console.error('   💳 SendGrid Credits Exhausted!');
                    console.error('   Your free tier limit (100 emails/day) has been reached.');
                    console.error('   Solutions:');
                    console.error('     1. Wait for daily reset (credits reset at midnight UTC)');
                    console.error('     2. Upgrade your SendGrid plan at https://sendgrid.com/pricing');
                    console.error('     3. Check your usage at https://app.sendgrid.com/stats/overview');
                    console.error('     4. OR verify sender email in SendGrid dashboard');
                } else {
                    console.error('   🔑 Authentication failed (401 Unauthorized)');
                    console.error('   Possible causes:');
                    console.error('     1. API key is invalid or has been revoked');
                    console.error('     2. API key does not have "Mail Send" permissions');
                    console.error('     3. Sender email is not verified in SendGrid (MOST COMMON!)');
                    console.error(`     4. Verify ${process.env.SENDGRID_FROM_EMAIL || 'zerrahworld@gmail.com'} at:`);
                    console.error('        https://app.sendgrid.com/settings/sender_auth');
                }
                
                if (error.response && error.response.body && error.response.body.errors) {
                    console.error('\n   SendGrid error details:');
                    error.response.body.errors.forEach((err) => {
                        console.error(`     - ${err.message || JSON.stringify(err)}`);
                    });
                }
                
                // Try Gmail SMTP as fallback if configured
                if (process.env.GMAIL_APP_PASSWORD) {
                    console.log('\n🔄 Attempting fallback to Gmail SMTP...');
                    try {
                        const GmailService = require('./gmailService').GmailService;
                        const sent = await GmailService.sendEmail(emailData);
                        if (sent) {
                            console.log('✅ Email sent successfully via Gmail SMTP fallback!');
                            return;
                        }
                    } catch (gmailError) {
                        console.error('   Gmail fallback also failed:', gmailError.message);
                    }
                }
            } else if (error.code === 403) {
                console.error('   🚫 Access forbidden (403)');
                console.error('   The API key may not have sufficient permissions');
            } else if (error.response && error.response.body) {
                console.error('   SendGrid Response:', JSON.stringify(error.response.body, null, 2));
            }
            
            // Fallback to console logging if SendGrid fails
            console.log('\n📧 Email would be sent (SendGrid failed):', {
                to: emailData.to,
                subject: emailData.subject,
                from: process.env.SENDGRID_FROM_EMAIL || 'zerrahworld@gmail.com',
                htmlLength: emailData.html.length,
            });
        }
    }
}
exports.EmailService = EmailService;
