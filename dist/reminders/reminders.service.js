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
var RemindersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const mail_service_1 = require("../mail/mail.service");
const enums_1 = require("../common/enums");
let RemindersService = RemindersService_1 = class RemindersService {
    bookingRepository;
    mailService;
    logger = new common_1.Logger(RemindersService_1.name);
    constructor(bookingRepository, mailService) {
        this.bookingRepository = bookingRepository;
        this.mailService = mailService;
    }
    async handleReminders() {
        this.logger.debug('Running lesson reminders cron job');
        await this.send24hReminders();
        await this.send1hReminders();
    }
    async send24hReminders() {
        const now = new Date();
        const rangeStart = new Date(now.getTime() + 23 * 60 * 60 * 1000 + 30 * 60 * 1000);
        const rangeEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000);
        const bookings = await this.bookingRepository.find({
            where: {
                start_time: (0, typeorm_2.Between)(rangeStart, rangeEnd),
                reminder_24h_sent: false,
                status: enums_1.BookingStatus.CONFIRMED,
            },
            relations: ['tutor', 'student', 'student.user', 'tutor.user'],
        });
        for (const booking of bookings) {
            this.logger.log(`Sending 24h reminder for booking ${booking.id}`);
            const studentEmail = booking.student.user.email;
            const tutorEmail = booking.tutor.user.email;
            const message = `Reminder: You have a lesson scheduled in 24 hours.\nTime: ${booking.start_time.toLocaleString()}\nZoom Link: ${booking.video_meeting_url || 'To be provided'}`;
            await this.mailService.sendDirectEmail(studentEmail, 'Lesson Reminder (24h)', message);
            await this.mailService.sendDirectEmail(tutorEmail, 'Lesson Reminder (24h)', message);
            booking.reminder_24h_sent = true;
            await this.bookingRepository.save(booking);
        }
    }
    async send1hReminders() {
        const now = new Date();
        const rangeStart = new Date(now.getTime() + 30 * 60 * 1000);
        const rangeEnd = new Date(now.getTime() + 1 * 60 * 60 * 1000 + 30 * 60 * 1000);
        const bookings = await this.bookingRepository.find({
            where: {
                start_time: (0, typeorm_2.Between)(rangeStart, rangeEnd),
                reminder_1h_sent: false,
                status: enums_1.BookingStatus.CONFIRMED,
            },
            relations: ['tutor', 'student', 'student.user', 'tutor.user'],
        });
        for (const booking of bookings) {
            this.logger.log(`Sending 1h reminder for booking ${booking.id}`);
            const studentEmail = booking.student.user.email;
            const tutorEmail = booking.tutor.user.email;
            const message = `Reminder: Your lesson starts in 1 hour!\nTime: ${booking.start_time.toLocaleString()}\nZoom Link: ${booking.video_meeting_url || 'To be provided'}`;
            await this.mailService.sendDirectEmail(studentEmail, 'Lesson Reminder (1h)', message);
            await this.mailService.sendDirectEmail(tutorEmail, 'Lesson Reminder (1h)', message);
            booking.reminder_1h_sent = true;
            await this.bookingRepository.save(booking);
        }
    }
};
exports.RemindersService = RemindersService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RemindersService.prototype, "handleReminders", null);
exports.RemindersService = RemindersService = RemindersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService])
], RemindersService);
//# sourceMappingURL=reminders.service.js.map