import { MailService } from '../mail/mail.service';
export declare class ContactService {
    private readonly mailService;
    constructor(mailService: MailService);
    handleContactForm(name: string, email: string, message: string): Promise<void>;
}
