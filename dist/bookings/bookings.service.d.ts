import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { StudentProfile } from '../student-profiles/entities/student-profile.entity';
import { ParentProfile } from '../parent-profiles/entities/parent-profile.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ZoomService } from '../integrations/zoom/zoom.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class BookingsService {
    private readonly bookingRepository;
    private readonly tutorProfileRepository;
    private readonly studentProfileRepository;
    private readonly parentProfileRepository;
    private readonly zoomService;
    private readonly eventEmitter;
    constructor(bookingRepository: Repository<Booking>, tutorProfileRepository: Repository<TutorProfile>, studentProfileRepository: Repository<StudentProfile>, parentProfileRepository: Repository<ParentProfile>, zoomService: ZoomService, eventEmitter: EventEmitter2);
    create(userId: string, dto: CreateBookingDto): Promise<Booking>;
    findAllByStudent(userId: string): Promise<Booking[]>;
    findAllByParent(userId: string): Promise<Booking[]>;
    findAllByTutor(userId: string): Promise<Booking[]>;
    confirmBooking(bookingId: string): Promise<Booking>;
    hasRelationship(userId1: string, userId2: string): Promise<boolean>;
    private checkBooking;
}
