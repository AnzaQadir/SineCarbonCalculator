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
                subject: `You're in, ${user.firstName || 'Friend'}. And honestly… we can't wait.`,
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
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Zerrah</title>
        <style>
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #f8f7f3;
            margin: 0;
            padding: 0;
            color: #3a3a2c;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background: transparent;
          }
          .hero-bg {
            position: relative;
            width: 100%;
            aspect-ratio: 16/9;
            min-height: 250px;
            background: #f8f7f3;
            border-radius: 18px 18px 0 0;
            overflow: hidden;
          }
          .hero-bg img {
            width: 100%;
            height: auto;
            display: block;
            object-fit: cover;
            border-radius: 18px 18px 0 0;
          }
          .overlay-text {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 32px;
            text-align: center;
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 1.5rem;
            color: #6d5e4d;
            background: rgba(255,255,255,0.55);
            padding: 12px 24px 10px 24px;
            border-radius: 18px;
            margin: 0 auto;
            width: fit-content;
            max-width: 90%;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
            letter-spacing: 0.01em;
          }
          .header {
            background: none;
            padding: 32px 0 0 0;
            text-align: left;
            border-radius: 0;
          }
          .header h1 {
            color: #7a6c5d;
            margin: 0 0 8px 0;
            font-size: 2.2rem;
            font-family: 'Georgia', 'Times New Roman', serif;
            font-weight: bold;
          }
          .header p {
            color: #a89c8a;
            margin: 0 0 0 0;
            font-size: 1.1rem;
          }
          .content {
            padding: 32px 32px 24px 32px;
            background: #fff;
            border-radius: 0 0 18px 18px;
            box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
          }
          .button {
            display: inline-block;
            padding: 12px 28px;
            background: #b6c7a2;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            margin: 18px 0 10px 0;
            font-size: 1.1rem;
            font-family: 'Georgia', 'Times New Roman', serif;
            font-weight: bold;
            letter-spacing: 0.01em;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #a89c8a;
            font-size: 14px;
            font-family: 'Georgia', 'Times New Roman', serif;
          }
          .highlight {
            background: #f3f1e7;
            padding: 18px;
            border-radius: 10px;
            margin: 24px 0;
            color: #6d5e4d;
            font-size: 1.1rem;
          }
          .quote {
            background: #f6f5f2;
            padding: 20px;
            border-left: 4px solid #b6c7a2;
            margin: 24px 0;
            font-style: italic;
            color: #7a6c5d;
            border-radius: 8px;
          }
          @media (max-width: 600px) {
            .container, .content { padding: 12px !important; }
            .hero-bg { min-height: 120px; }
            .overlay-text { font-size: 1.1rem; padding: 8px 10px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="hero-bg">
            <!-- Replace the src below with the actual GIF URL when available -->
            <img src="https://cdn.zerrah.com/email-assets/email.png" alt="Six gentle climate-friendly actions in watercolor animation" style="background: #f8f7f3;" />
            <div class="overlay-text">Your habits already tell a story.</div>
            <!-- Top-left corner left clear for logo placement -->
          </div>
          <div class="header">
            <h1>🌱 You're in, ${user.firstName || 'Friend'}</h1>
            <p>And honestly… we can't wait.</p>
          </div>
          <div class="content">
            <h2 style="font-family: 'Georgia', serif; color: #7a6c5d;">👋 Hey ${user.firstName || 'Friend'},</h2>
            <p>You just did something kind of special.</p>
            <p>You took a first step — the kind most people only think about.</p>
            <p>And we're so glad you're here.</p>
            <h3 style="color: #b6c7a2;">🪞 Here's what happens next:</h3>
            <p>We'll walk you through 6 gentle reflections — how you move, what you eat, what you wear, and more.</p>
            <p>No grades. No guilt. Just honest questions that show you what's already there.</p>
            <p>Because your daily choices tell a story.</p>
            <p>A quiet one. A powerful one.</p>
            <p>And we think it's time you heard it.</p>
            <h3 style="color: #b6c7a2;">🧭 Along the way, you'll find:</h3>
            <ul style="color: #6d5e4d;">
              <li>clarity over climate chaos</li>
              <li>progress that feels real (and doable)</li>
              <li>and a deep connection to what's always mattered: your context, your culture, your way.</li>
            </ul>
            <h3 style="color: #b6c7a2;">🌱 Ready?</h3>
            <p>Let's start your climate story — the one only you can tell.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" class="button">🔘 Start My Climate Story</a>
            </div>
            <p style="text-align: center; font-size: 14px; color: #a89c8a;">Takes 3 minutes. No stats. No guilt. Just you.</p>
            <div class="quote">
              <p>"Zerrah helped me realize that I didn't need to overhaul my life to make an impact — I just needed to see it differently."</p>
              <p style="text-align: right; margin: 0; font-size: 14px;">— Azeem, 29, Lahore</p>
            </div>
            <div class="highlight">
              <h3 style="margin-top: 0;">✨ One small thing to think about before you begin:</h3>
              <p>"What's one thing I already do that helps the planet — even just a little?"</p>
              <p style="font-size: 14px; color: #a89c8a;">(Hint: It probably matters more than you think.)</p>
            </div>
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
     * Generate welcome email text version
     */
    static generateWelcomeEmailText(user) {
        return `
🌊 You're in, ${user.firstName || 'Friend'}. And honestly… we can't wait.

Preview Text: One simple step. A ripple of impact. Let's see what your story holds.

👋 Hey ${user.firstName || 'Friend'},

You just did something kind of special.
You took a first step — the kind most people only think about.

And we're so glad you're here.

🪞 Here's what happens next:
We're going to walk you through 6 gentle reflections — how you move, what you eat, what you wear, and more.
No grades. No guilt. Just honest questions that show you what's already there.

Because your daily choices tell a story.
A quiet one. A powerful one.
And we think it's time you heard it.

🧭 Along the way, you'll find:
– clarity over climate chaos
– progress that feels real (and doable)
– and a deep connection to what's always mattered: your context, your culture, your way.

🌱 Ready?
Let's start your climate story — the one only you can tell.

🔘 Start My Climate Story
Takes 3 minutes. No stats. No guilt. Just you.

💬 "Zerrah helped me realize that I didn't need to overhaul my life to make an impact — I just needed to see it differently."
— Azeem, 29, Lahore

✨ One small thing to think about before you begin:
"What's one thing I already do that helps the planet — even just a little?"
(Hint: It probably matters more than you think.)

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
            // Prepare email message
            const msg = {
                to: emailData.to,
                from: process.env.SENDGRID_FROM_EMAIL || 'noreply@zerrah.com', // Replace with your verified sender
                subject: emailData.subject,
                html: emailData.html,
                text: emailData.text,
            };
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
            console.error('❌ Error sending email via SendGrid:', error);
            // Fallback to console logging if SendGrid fails
            console.log('📧 Email would be sent (SendGrid failed):', {
                to: emailData.to,
                subject: emailData.subject,
                htmlLength: emailData.html.length,
            });
        }
    }
}
exports.EmailService = EmailService;
