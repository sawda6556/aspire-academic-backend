import { Injectable, BadRequestException, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { StudentProfile } from '../student-profiles/entities/student-profile.entity';
import { ParentProfile } from '../parent-profiles/entities/parent-profile.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '../common/enums';
import { ZoomService } from '../integrations/zoom/zoom.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(TutorProfile)
    private readonly tutorProfileRepository: Repository<TutorProfile>,
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,
    @InjectRepository(ParentProfile)
    private readonly parentProfileRepository: Repository<ParentProfile>,
    private readonly zoomService: ZoomService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    let studentId: string;

    // Check if user is a student or a parent booking for their child
    const student = await this.studentProfileRepository.findOne({ where: { user_id: userId } });
    if (student) {
      studentId = student.id;
    } else {
      const parent = await this.parentProfileRepository.findOne({ where: { user_id: userId } });
      if (!parent) {
        throw new ForbiddenException('Only students or parents can book lessons');
      }
      
      if (!dto.student_id) {
        throw new BadRequestException('student_id is required for parental bookings');
      }

      const child = await this.studentProfileRepository.findOne({ 
        where: { id: dto.student_id, parent_id: parent.id } 
      });
      
      if (!child) {
        throw new ForbiddenException('Student not found or does not belong to this parent');
      }
      studentId = child.id;
    }

    const tutor = await this.tutorProfileRepository.findOne({ where: { id: dto.tutor_id } });
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    const startTime = new Date(dto.start_time);
    const endTime = new Date(dto.end_time);

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Improved Double-booking prevention (Overlapping interval logic)
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        tutor_id: dto.tutor_id,
        start_time: LessThan(endTime),
        end_time: MoreThan(startTime),
        status: BookingStatus.CONFIRMED, // Only check against confirmed bookings
      },
    });

    if (existingBooking) {
      throw new ConflictException('Tutor is already booked for this time slot');
    }

    // Trial lesson logic
    if (dto.is_trial) {
      const trialCount = await this.bookingRepository.count({
        where: { tutor_id: dto.tutor_id, student_id: studentId, is_trial: true },
      });
      if (trialCount > 0) {
        throw new BadRequestException('A trial lesson has already been booked with this tutor for this student');
      }
    }

    // Create booking
    const booking = this.bookingRepository.create({
      tutor_id: dto.tutor_id,
      student_id: studentId,
      start_time: startTime,
      end_time: endTime,
      is_trial: dto.is_trial || false,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Generate Zoom meeting
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    try {
      const meeting = await this.zoomService.createMeeting(startTime, durationMinutes, `Lesson with ${tutor.full_name}`);
      savedBooking.video_meeting_url = meeting.meetingUrl;
      return await this.bookingRepository.save(savedBooking);
    } catch (error) {
      console.error('Failed to create Zoom meeting:', error);
      // Still return the booking, but maybe with a flag or handled by a background job later
      return savedBooking;
    }
  }

  async findAllByStudent(userId: string) {
    const student = await this.studentProfileRepository.findOne({ where: { user_id: userId } });
    if (!student) return [];
    return await this.bookingRepository.find({
      where: { student_id: student.id },
      relations: ['tutor'],
      order: { start_time: 'DESC' },
    });
  }

  async findAllByParent(userId: string) {
    const parent = await this.parentProfileRepository.findOne({ where: { user_id: userId } });
    if (!parent) return [];
    
    const children = await this.studentProfileRepository.find({ where: { parent_id: parent.id } });
    const childIds = children.map(c => c.id);
    
    if (childIds.length === 0) return [];

    return await this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.tutor', 'tutor')
      .leftJoinAndSelect('booking.student', 'student')
      .where('booking.student_id IN (:...childIds)', { childIds })
      .orderBy('booking.start_time', 'DESC')
      .getMany();
  }

  async findAllByTutor(userId: string) {
    const tutor = await this.tutorProfileRepository.findOne({ where: { user_id: userId } });
    if (!tutor) return [];
    return await this.bookingRepository.find({
      where: { tutor_id: tutor.id },
      relations: ['student'],
      order: { start_time: 'DESC' },
    });
  }

  async confirmBooking(bookingId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['tutor', 'student', 'student.user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      return booking;
    }

    booking.status = BookingStatus.CONFIRMED;
    const savedBooking = await this.bookingRepository.save(booking);

    // Emit event for receipt
    let targetUserId = booking.student.user_id;
    if (booking.student.parent_id) {
      const parent = await this.parentProfileRepository.findOne({
        where: { id: booking.student.parent_id },
      });
      if (parent) {
        targetUserId = parent.user_id;
      }
    }

    this.eventEmitter.emit('payment.success', {
      userId: targetUserId,
      orderId: savedBooking.id,
      amount: booking.is_trial ? 0 : booking.tutor.hourly_rate, // Simple logic for now
      currency: 'gbp',
      items: [`Lesson with ${booking.tutor.full_name}`],
      date: new Date(),
    });

    return savedBooking;
  }

  async hasRelationship(userId1: string, userId2: string): Promise<boolean> {
    const tutor1 = await this.tutorProfileRepository.findOne({ where: { user_id: userId1 } });
    const tutor2 = await this.tutorProfileRepository.findOne({ where: { user_id: userId2 } });

    if (tutor1 && !tutor2) {
      return this.checkBooking(tutor1.id, userId2);
    } else if (!tutor1 && tutor2) {
      return this.checkBooking(tutor2.id, userId1);
    }
    
    return false;
  }

  private async checkBooking(tutorProfileId: string, otherUserId: string): Promise<boolean> {
    const student = await this.studentProfileRepository.findOne({ where: { user_id: otherUserId } });
    if (student) {
      const count = await this.bookingRepository.count({
        where: { tutor_id: tutorProfileId, student_id: student.id },
      });
      if (count > 0) return true;
    }

    const parent = await this.parentProfileRepository.findOne({ where: { user_id: otherUserId } });
    if (parent) {
      const students = await this.studentProfileRepository.find({ where: { parent_id: parent.id } });
      const studentIds = students.map(s => s.id);
      if (studentIds.length > 0) {
        const count = await this.bookingRepository.createQueryBuilder('booking')
          .where('booking.tutor_id = :tutorId', { tutorId: tutorProfileId })
          .andWhere('booking.student_id IN (:...studentIds)', { studentIds })
          .getCount();
        return count > 0;
      }
    }

    return false;
  }
}
