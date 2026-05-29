import { Repository } from 'typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { MailService } from '../mail/mail.service';
export declare class RemindersService {
    private readonly bookingRepository;
    private readonly mailService;
    private readonly logger;
    constructor(bookingRepository: Repository<Booking>, mailService: MailService);
    handleReminders(): Promise<void>;
    private send24hReminders;
    private send1hReminders;
}
