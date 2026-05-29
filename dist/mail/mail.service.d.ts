import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendMail(to: string, subject: string, text: string, attachments?: any[]): Promise<void>;
    notifyAdminOnRegistration(user: any, profile: any): Promise<void>;
    notifyAdminOnVerificationUpload(user: any, documentUrls: string[]): Promise<void>;
    sendPaymentReceipt(to: string, details: {
        orderId: string;
        amount: number;
        currency: string;
        items: string[];
        date: Date;
    }): Promise<void>;
    sendDirectEmail(to: string, subject: string, message: string): Promise<void>;
}
