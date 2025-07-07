"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
class EmailService {
    /**
     * Send welcome email to new user
     */
    static async sendWelcomeEmail(user) {
        try {
            const emailData = {
                to: user.email,
                subject: `Welcome to Zerrah, ${user.firstName || 'Friend'}! 🚀`,
                html: this.generateWelcomeEmailHTML(user),
                text: this.generateWelcomeEmailText(user),
            };
            // In production, this would integrate with SendGrid, Mailgun, etc.
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 30px; text-align: center; border-radius: 10px; }
          .content { padding: 30px; background: #fff; }
          .button { display: inline-block; padding: 12px 24px; background: #f59e0b; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0;">Welcome to Zerrah! 🌱</h1>
            <p style="color: white; margin: 10px 0 0 0;">Small actions, big impact</p>
          </div>
          
          <div class="content">
            <h2>Hi ${user.firstName || 'Friend'}! 👋</h2>
            
            <p>Welcome to the Zerrah community! You're now part of a movement that's making real change happen, one small action at a time.</p>
            
            <div class="highlight">
              <h3>🎯 Your Waitlist Position: #${user.waitlistPosition.toLocaleString()}</h3>
              <p>You're in line with ${user.waitlistPosition.toLocaleString()} other climate champions. We're launching soon and you'll be among the first to know!</p>
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li><strong>Stay Tuned:</strong> We'll notify you as soon as we launch</li>
              <li><strong>Join Our Community:</strong> Connect with fellow climate enthusiasts</li>
              <li><strong>Track Your Impact:</strong> See how your small actions add up</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" class="button">Join Our Community</a>
            </div>
            
            <p>In the meantime, why not share the good news?</p>
            <p style="text-align: center;">
              <a href="https://twitter.com/intent/tweet?text=Just joined the Zerrah waiting list! 🚀 Small actions, big impact. #ClimateAction #Sustainability" style="color: #1da1f2; text-decoration: none;">Share on Twitter</a> |
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://zerrah.com')}&title=${encodeURIComponent('Zerrah - Small actions, big impact')}" style="color: #0077b5; text-decoration: none;">Share on LinkedIn</a>
            </p>
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
Welcome to Zerrah! 🌱

Hi ${user.firstName || 'Friend'}! 👋

Welcome to the Zerrah community! You're now part of a movement that's making real change happen, one small action at a time.

🎯 Your Waitlist Position: #${user.waitlistPosition.toLocaleString()}

You're in line with ${user.waitlistPosition.toLocaleString()} other climate champions. We're launching soon and you'll be among the first to know!

What's Next?
- Stay Tuned: We'll notify you as soon as we launch
- Join Our Community: Connect with fellow climate enthusiasts  
- Track Your Impact: See how your small actions add up

Join our community and start connecting with fellow climate champions!

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
     * Send email (placeholder for email service integration)
     */
    static async sendEmail(emailData) {
        // In production, this would integrate with SendGrid, Mailgun, etc.
        console.log('📧 Email would be sent:', {
            to: emailData.to,
            subject: emailData.subject,
            htmlLength: emailData.html.length,
        });
        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
exports.EmailService = EmailService;
