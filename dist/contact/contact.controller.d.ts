import { ContactService } from './contact.service';
declare class ContactFormDto {
    name: string;
    email: string;
    message: string;
}
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submitContactForm(contactFormDto: ContactFormDto): Promise<{
        message: string;
    }>;
}
export {};
