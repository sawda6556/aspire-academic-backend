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
        from: this.configService.get<string>('MAIL_FROM', '"Aspire Academic Co." <noreply@aspireacademic.com>'),
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
    const adminEmail = 'carakay68@gmail.com';
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

  async notifyAdminOnVerificationUpload(user: any, documentUrls: string[]) {
    const adminEmail = 'carakay68@gmail.com';
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
