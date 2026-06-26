import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(private readonly mailService: MailService) {}

  async handleContactForm(name: string, email: string, message: string) {
    await this.mailService.notifyAdminOnContactForm(name, email, message);
  }
}
