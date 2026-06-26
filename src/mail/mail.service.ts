import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, attachments?: any[]) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM', '"Aspire Academic Co." <noreply@aspireacademicco.co.uk>'),
        to,
        subject,
        text,
        attachments,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      // In a real app, we might want to retry or use a queue
    }
  }

  async notifyAdminOnRegistration(user: any, profile: any) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'info@aspireacademicco.co.uk');
    const subject = `New ${user.user_type} Registration: ${user.full_name || user.email}`;
    const text = `
      A new user has registered on Aspire Academic Co.
      
      User Details:
      - Email: ${user.email}
      - Type: ${user.user_type}
      - Name: ${user.full_name}
      - Gender: ${user.gender}
      
      Profile Details:
      ${JSON.stringify(profile, null, 2)}
      
      Legal Agreements:
      - The user has signed all required legal agreements during the onboarding process.
    `;
    
    await this.sendMail(adminEmail, subject, text);
  }

  async sendWelcomeEmail(user: any) {
    const subject = `Welcome to Aspire Academic Co.!`;
    const text = `
      Assalamu Alaikum ${user.full_name || 'there'},
      
      Welcome to Aspire Academic Co. - your gateway to high-quality, Islamic-friendly academic tutoring.
      
      We are thrilled to have you join our community. Whether you are here to learn or to share your knowledge, we are committed to providing a safe and productive environment for your academic journey.
      
      To get started:
      - Complete your profile if you haven't already.
      - Browse our available subjects and tutors.
      - Check out our resource store for helpful study materials.
      
      If you have any questions, feel free to reply to this email or contact us at info@aspireacademicco.co.uk.
      
      JazakAllah Khair,
      The Aspire Academic Co. Team
    `;
    
    await this.sendMail(user.email, subject, text);
  }

  async notifyAdminOnVerificationUpload(user: any, documentUrls: string[]) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'info@aspireacademicco.co.uk');
    const subject = `Verification Documents Uploaded: ${user.email}`;
    const text = `
      User ${user.email} has uploaded new verification documents.
      
      Document URLs:
      ${documentUrls.map(url => `- ${url}`).join('\n')}
      
      Please review these documents in the admin dashboard.
    `;
    
    // In production, we might want to attach the files directly if they are small
    // For now, we just send the URLs
    await this.sendMail(adminEmail, subject, text);
  }

  async sendPaymentReceipt(to: string, details: {
    orderId: string;
    amount: number;
    currency: string;
    items: string[];
    date: Date;
  }) {
    const subject = `Receipt for your purchase at Aspire Academic Co. - ${details.orderId}`;
    const text = `
      Thank you for your purchase!
      
      Order Details:
      - Order ID: ${details.orderId}
      - Date: ${details.date.toLocaleDateString()}
      - Total: ${details.amount} ${details.currency.toUpperCase()}
      
      Items:
      ${details.items.map(item => `- ${item}`).join('\n')}
      
      If you have any questions, please contact our support at info@aspireacademicco.co.uk.
      
      Best regards,
      The Aspire Academic Co. Team
    `;
    
    await this.sendMail(to, subject, text);
  }

  async notifyAdminOnPayment(user: any, details: any) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'info@aspireacademicco.co.uk');
    const subject = `💰 Payment Received: ${details.amount} ${details.currency.toUpperCase()} from ${user.email}`;
    const text = `
      A payment has been successfully processed on Aspire Academic Co.
      
      User: ${user.email}
      Order ID: ${details.orderId}
      Amount: ${details.amount} ${details.currency.toUpperCase()}
      Date: ${details.date.toLocaleDateString()}
      
      Items:
      ${details.items.map((item: string) => `- ${item}`).join('\n')}
    `;
    
    await this.sendMail(adminEmail, subject, text);
  }

  async notifyAdminOnPaymentFailure(user: any, details: any) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'info@aspireacademicco.co.uk');
    const subject = `❌ Payment Failed: ${user.email}`;
    const text = `
      A payment attempt has failed on Aspire Academic Co.
      
      User: ${user.email}
      Order ID: ${details.orderId}
      Error: ${details.error || 'Unknown error'}
      Amount: ${details.amount} ${details.currency?.toUpperCase() || 'GBP'}
      
      Please contact the customer to assist with the payment issue.
    `;
    
    await this.sendMail(adminEmail, subject, text);
  }

  async notifyAdminOnRefund(user: any, details: any) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'info@aspireacademicco.co.uk');
    const subject = `💸 Refund Processed: ${user.email}`;
    const text = `
      A refund has been processed on Aspire Academic Co.
      
      User: ${user.email}
      Order ID: ${details.orderId}
      Amount: ${details.amount} ${details.currency.toUpperCase()}
      Reason: ${details.reason || 'Not specified'}
    `;
    
    await this.sendMail(adminEmail, subject, text);
  }

  async notifyAdminOnDispute(user: any, details: any) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'info@aspireacademicco.co.uk');
    const subject = `⚠️ Payment Dispute Created: ${user.email}`;
    const text = `
      A payment dispute has been opened for a transaction on Aspire Academic Co.
      
      User: ${user.email}
      Order ID: ${details.orderId}
      Amount: ${details.amount} ${details.currency.toUpperCase()}
      Dispute ID: ${details.disputeId}
      Reason: ${details.reason || 'Not specified'}
      
      CRITICAL: Please review the dispute in the Stripe dashboard immediately.
    `;
    
    await this.sendMail(adminEmail, subject, text);
  }

  async notifyAdminOnContactForm(name: string, email: string, message: string) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', 'info@aspireacademicco.co.uk');
    const subject = `New Contact Form Submission from ${name}`;
    const text = `
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `;
    
    await this.sendMail(adminEmail, subject, text);
  }

  async sendDirectEmail(to: string, subject: string, message: string) {
    const text = `
      ${message}
      
      ---
      This email was sent to you by the administration of Aspire Academic Co.
      If you have any questions, please contact our support at info@aspireacademicco.co.uk.
    `;
    
    await this.sendMail(to, subject, text);
  }
}
