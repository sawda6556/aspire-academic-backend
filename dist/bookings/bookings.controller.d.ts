import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, dto: CreateBookingDto): Promise<import("./entities/booking.entity").Booking>;
    getMyBookings(req: any): Promise<import("./entities/booking.entity").Booking[]>;
}
