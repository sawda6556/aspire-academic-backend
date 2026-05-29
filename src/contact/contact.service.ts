import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(private readonly mailService: MailService) {}

  async handleContactForm(name: string, email: string, message: string) {
    const adminEmail = 'info@aspireacademicco.co.uk';
    const subject = `New Contact Form Submission from ${name}`;
    const text = `
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `;
    
    await this.mailService.sendMail(adminEmail, subject, text);
  }
}
