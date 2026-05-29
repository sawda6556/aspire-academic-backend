"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const tutor_profile_entity_1 = require("../tutor-profiles/entities/tutor-profile.entity");
const student_profile_entity_1 = require("../student-profiles/entities/student-profile.entity");
const parent_profile_entity_1 = require("../parent-profiles/entities/parent-profile.entity");
const enums_1 = require("../common/enums");
const zoom_service_1 = require("../integrations/zoom/zoom.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let BookingsService = class BookingsService {
    bookingRepository;
    tutorProfileRepository;
    studentProfileRepository;
    parentProfileRepository;
    zoomService;
    eventEmitter;
    constructor(bookingRepository, tutorProfileRepository, studentProfileRepository, parentProfileRepository, zoomService, eventEmitter) {
        this.bookingRepository = bookingRepository;
        this.tutorProfileRepository = tutorProfileRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.parentProfileRepository = parentProfileRepository;
        this.zoomService = zoomService;
        this.eventEmitter = eventEmitter;
    }
    async create(userId, dto) {
        let studentId;
        const student = await this.studentProfileRepository.findOne({ where: { user_id: userId } });
        if (student) {
            studentId = student.id;
        }
        else {
            const parent = await this.parentProfileRepository.findOne({ where: { user_id: userId } });
            if (!parent) {
                throw new common_1.ForbiddenException('Only students or parents can book lessons');
            }
            if (!dto.student_id) {
                throw new common_1.BadRequestException('student_id is required for parental bookings');
            }
            const child = await this.studentProfileRepository.findOne({
                where: { id: dto.student_id, parent_id: parent.id }
            });
            if (!child) {
                throw new common_1.ForbiddenException('Student not found or does not belong to this parent');
            }
            studentId = child.id;
        }
        const tutor = await this.tutorProfileRepository.findOne({ where: { id: dto.tutor_id } });
        if (!tutor) {
            throw new common_1.NotFoundException('Tutor not found');
        }
        const startTime = new Date(dto.start_time);
        const endTime = new Date(dto.end_time);
        if (startTime >= endTime) {
            throw new common_1.BadRequestException('Start time must be before end time');
        }
        const existingBooking = await this.bookingRepository.findOne({
            where: {
                tutor_id: dto.tutor_id,
                start_time: (0, typeorm_2.LessThan)(endTime),
                end_time: (0, typeorm_2.MoreThan)(startTime),
                status: enums_1.BookingStatus.CONFIRMED,
            },
        });
        if (existingBooking) {
            throw new common_1.ConflictException('Tutor is already booked for this time slot');
        }
        if (dto.is_trial) {
            const trialCount = await this.bookingRepository.count({
                where: { tutor_id: dto.tutor_id, student_id: studentId, is_trial: true },
            });
            if (trialCount > 0) {
                throw new common_1.BadRequestException('A trial lesson has already been booked with this tutor for this student');
            }
        }
        const booking = this.bookingRepository.create({
            tutor_id: dto.tutor_id,
            student_id: studentId,
            start_time: startTime,
            end_time: endTime,
            is_trial: dto.is_trial || false,
            status: enums_1.BookingStatus.PENDING,
        });
        const savedBooking = await this.bookingRepository.save(booking);
        const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        try {
            const meeting = await this.zoomService.createMeeting(startTime, durationMinutes, `Lesson with ${tutor.full_name}`);
            savedBooking.video_meeting_url = meeting.meetingUrl;
            return await this.bookingRepository.save(savedBooking);
        }
        catch (error) {
            console.error('Failed to create Zoom meeting:', error);
            return savedBooking;
        }
    }
    async findAllByStudent(userId) {
        const student = await this.studentProfileRepository.findOne({ where: { user_id: userId } });
        if (!student)
            return [];
        return await this.bookingRepository.find({
            where: { student_id: student.id },
            relations: ['tutor'],
            order: { start_time: 'DESC' },
        });
    }
    async findAllByParent(userId) {
        const parent = await this.parentProfileRepository.findOne({ where: { user_id: userId } });
        if (!parent)
            return [];
        const children = await this.studentProfileRepository.find({ where: { parent_id: parent.id } });
        const childIds = children.map(c => c.id);
        if (childIds.length === 0)
            return [];
        return await this.bookingRepository.createQueryBuilder('booking')
            .leftJoinAndSelect('booking.tutor', 'tutor')
            .leftJoinAndSelect('booking.student', 'student')
            .where('booking.student_id IN (:...childIds)', { childIds })
            .orderBy('booking.start_time', 'DESC')
            .getMany();
    }
    async findAllByTutor(userId) {
        const tutor = await this.tutorProfileRepository.findOne({ where: { user_id: userId } });
        if (!tutor)
            return [];
        return await this.bookingRepository.find({
            where: { tutor_id: tutor.id },
            relations: ['student'],
            order: { start_time: 'DESC' },
        });
    }
    async confirmBooking(bookingId) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['tutor', 'student', 'student.user'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status === enums_1.BookingStatus.CONFIRMED) {
            return booking;
        }
        booking.status = enums_1.BookingStatus.CONFIRMED;
        const savedBooking = await this.bookingRepository.save(booking);
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
            amount: booking.is_trial ? 0 : booking.tutor.hourly_rate,
            currency: 'gbp',
            items: [`Lesson with ${booking.tutor.full_name}`],
            date: new Date(),
        });
        return savedBooking;
    }
    async hasRelationship(userId1, userId2) {
        const tutor1 = await this.tutorProfileRepository.findOne({ where: { user_id: userId1 } });
        const tutor2 = await this.tutorProfileRepository.findOne({ where: { user_id: userId2 } });
        if (tutor1 && !tutor2) {
            return this.checkBooking(tutor1.id, userId2);
        }
        else if (!tutor1 && tutor2) {
            return this.checkBooking(tutor2.id, userId1);
        }
        return false;
    }
    async checkBooking(tutorProfileId, otherUserId) {
        const student = await this.studentProfileRepository.findOne({ where: { user_id: otherUserId } });
        if (student) {
            const count = await this.bookingRepository.count({
                where: { tutor_id: tutorProfileId, student_id: student.id },
            });
            if (count > 0)
                return true;
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
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(tutor_profile_entity_1.TutorProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(student_profile_entity_1.StudentProfile)),
    __param(3, (0, typeorm_1.InjectRepository)(parent_profile_entity_1.ParentProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        zoom_service_1.ZoomService,
        event_emitter_1.EventEmitter2])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map