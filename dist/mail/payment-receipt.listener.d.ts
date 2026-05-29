import { MailService } from './mail.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class PaymentReceiptListener {
    private readonly mailService;
    private readonly usersRepository;
    constructor(mailService: MailService, usersRepository: Repository<User>);
    handlePaymentSuccess(payload: {
        userId: string;
        orderId: string;
        amount: number;
        currency: string;
        items: string[];
        date: Date;
    }): Promise<void>;
}
