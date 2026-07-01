import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { StudentProfile } from '../student-profiles/entities/student-profile.entity';
import { ParentProfile } from '../parent-profiles/entities/parent-profile.entity';
import { ZoomService } from '../integrations/zoom/zoom.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AttendanceStatus, BookingStatus } from '../common/enums';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepository;
  let tutorProfileRepository;
  let studentProfileRepository;
  let parentProfileRepository;

  const mockBookingRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockTutorProfileRepository = {
    findOne: jest.fn(),
  };

  const mockStudentProfileRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockParentProfileRepository = {
    findOne: jest.fn(),
  };

  const mockZoomService = {
    createMeeting: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(TutorProfile),
          useValue: mockTutorProfileRepository,
        },
        {
          provide: getRepositoryToken(StudentProfile),
          useValue: mockStudentProfileRepository,
        },
        {
          provide: getRepositoryToken(ParentProfile),
          useValue: mockParentProfileRepository,
        },
        {
          provide: ZoomService,
          useValue: mockZoomService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepository = module.get(getRepositoryToken(Booking));
    tutorProfileRepository = module.get(getRepositoryToken(TutorProfile));
    studentProfileRepository = module.get(getRepositoryToken(StudentProfile));
    parentProfileRepository = module.get(getRepositoryToken(ParentProfile));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reportAttendance', () => {
    const userId = 'user-1';
    const bookingId = 'booking-1';
    const mockBooking = {
      id: bookingId,
      tutor: { user_id: 'tutor-user' },
      student: { user_id: 'student-user', parent_id: null },
      status: BookingStatus.CONFIRMED,
    } as any;

    it('should throw NotFoundException if booking not found', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);
      await expect(service.reportAttendance(userId, bookingId, AttendanceStatus.PRESENT))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      await expect(service.reportAttendance('unauthorized-user', bookingId, AttendanceStatus.PRESENT))
        .rejects.toThrow(ForbiddenException);
    });

    it('should update tutor_attendance_report and call processAttendanceReports', async () => {
      const tutorUserId = 'tutor-user';
      const bookingWithTutor = { ...mockBooking, tutor: { user_id: tutorUserId } };
      mockBookingRepository.findOne.mockResolvedValue(bookingWithTutor);
      mockBookingRepository.save.mockImplementation((b) => Promise.resolve(b));

      const result = await service.reportAttendance(tutorUserId, bookingId, AttendanceStatus.PRESENT);
      
      expect(result.tutor_attendance_report).toBe(AttendanceStatus.PRESENT);
      expect(mockBookingRepository.save).toHaveBeenCalled();
    });

    it('should update student_attendance_report for student user', async () => {
      const studentUserId = 'student-user';
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      mockBookingRepository.save.mockImplementation((b) => Promise.resolve(b));

      const result = await service.reportAttendance(studentUserId, bookingId, AttendanceStatus.PRESENT);
      
      expect(result.student_attendance_report).toBe(AttendanceStatus.PRESENT);
    });
  });

  describe('processAttendanceReports logic', () => {
    it('should mark as COMPLETED if both report PRESENT', async () => {
      const booking = {
        id: 'b1',
        tutor_attendance_report: AttendanceStatus.PRESENT,
        student_attendance_report: AttendanceStatus.PRESENT,
        status: BookingStatus.CONFIRMED,
      } as any;

      mockBookingRepository.save.mockImplementation((b) => Promise.resolve(b));
      
      // We can't call private method directly easily in TS without casting to any
      const result = await (service as any).processAttendanceReports(booking);
      
      expect(result.status).toBe(BookingStatus.COMPLETED);
    });

    it('should mark as DISPUTED if Student reports PRESENT and Tutor reports NO_SHOW', async () => {
      const booking = {
        id: 'b1',
        tutor_attendance_report: AttendanceStatus.NO_SHOW,
        student_attendance_report: AttendanceStatus.PRESENT,
        status: BookingStatus.CONFIRMED,
      } as any;

      mockBookingRepository.save.mockImplementation((b) => Promise.resolve(b));
      
      const result = await (service as any).processAttendanceReports(booking);
      
      expect(result.status).toBe(BookingStatus.DISPUTED);
      expect(result.is_disputed).toBe(true);
      expect(result.dispute_reason).toContain('Tutor reported Student NO_SHOW, but Student reported being PRESENT');
    });

    it('should mark as DISPUTED if Student reports NO_SHOW and Tutor reports PRESENT', async () => {
      const booking = {
        id: 'b1',
        tutor_attendance_report: AttendanceStatus.PRESENT,
        student_attendance_report: AttendanceStatus.NO_SHOW,
        status: BookingStatus.CONFIRMED,
      } as any;

      mockBookingRepository.save.mockImplementation((b) => Promise.resolve(b));
      
      const result = await (service as any).processAttendanceReports(booking);
      
      expect(result.status).toBe(BookingStatus.DISPUTED);
      expect(result.is_disputed).toBe(true);
      expect(result.dispute_reason).toContain('Student reported Tutor NO_SHOW, but Tutor reported being PRESENT');
    });

    it('should mark as COMPLETED if Tutor reports Student NO_SHOW (and no dispute yet)', async () => {
      const booking = {
        id: 'b1',
        tutor_attendance_report: AttendanceStatus.NO_SHOW,
        student_attendance_report: undefined,
        status: BookingStatus.CONFIRMED,
      } as any;

      mockBookingRepository.save.mockImplementation((b) => Promise.resolve(b));
      
      const result = await (service as any).processAttendanceReports(booking);
      
      expect(result.status).toBe(BookingStatus.COMPLETED);
    });

    it('should mark as DISPUTED if both report NO_SHOW', async () => {
      const booking = {
        id: 'b1',
        tutor_attendance_report: AttendanceStatus.NO_SHOW,
        student_attendance_report: AttendanceStatus.NO_SHOW,
        status: BookingStatus.CONFIRMED,
      } as any;

      mockBookingRepository.save.mockImplementation((b) => Promise.resolve(b));
      
      const result = await (service as any).processAttendanceReports(booking);
      
      expect(result.status).toBe(BookingStatus.DISPUTED);
      expect(result.is_disputed).toBe(true);
      expect(result.dispute_reason).toBe('Both parties reported NO_SHOW.');
    });
  });
});
