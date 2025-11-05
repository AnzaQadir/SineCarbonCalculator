"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailService = void 0;
const nodemailer_1 = require("nodemailer");
class GmailService {
    /**
     * Send email using Gmail SMTP
     */
    static async sendEmail(emailData) {
        try {
            // Gmail SMTP configuration
            const gmailUser = process.env.GMAIL_USER || 'zerrahworld@gmail.com';
            const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
            if (!gmailAppPassword) {
                console.warn('⚠️ GMAIL_APP_PASSWORD not found. Cannot send via Gmail SMTP.');
                console.log('📧 Email would be sent via Gmail:', {
                    to: emailData.to,
                    subject: emailData.subject,
                });
                return false;
            }
            // Create transporter
            const transporter = (0, nodemailer_1.createTransport)({
                service: 'gmail',
                auth: {
                    user: gmailUser,
                    pass: gmailAppPassword,
                },
            });
            // Send email
            const info = await transporter.sendMail({
                from: `"Zerrah" <${gmailUser}>`,
                to: emailData.to,
                subject: emailData.subject,
                html: emailData.html,
                text: emailData.text,
            });
            console.log('📧 Email sent successfully via Gmail SMTP:', {
                to: emailData.to,
                subject: emailData.subject,
                messageId: info.messageId,
            });
            return true;
        }
        catch (error) {
            console.error('❌ Error sending email via Gmail SMTP:', error.message);
            return false;
        }
    }
    /**
     * Send welcome email
     */
    static async sendWelcomeEmail(user) {
        try {
            const emailData = {
                to: user.email,
                subject: `Welcome to Zerrah — you're in good company!`,
                html: this.generateWelcomeEmailHTML(user),
                text: this.generateWelcomeEmailText(user),
            };
            return await this.sendEmail(emailData);
        }
        catch (error) {
            console.error('Error sending welcome email via Gmail:', error);
            return false;
        }
    }
    /**
     * Generate welcome email HTML (reuse from EmailService)
     */
    static generateWelcomeEmailHTML(user) {
        const EmailService = require('./emailService').EmailService;
        return EmailService.generateWelcomeEmailHTML(user);
    }
    /**
     * Generate welcome email text (reuse from EmailService)
     */
    static generateWelcomeEmailText(user) {
        const EmailService = require('./emailService').EmailService;
        return EmailService.generateWelcomeEmailText(user);
    }
}
exports.GmailService = GmailService;

