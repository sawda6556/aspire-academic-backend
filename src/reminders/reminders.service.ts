import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { MailService } from '../mail/mail.service';
import { BookingStatus } from '../common/enums';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly mailService: MailService,
  ) {}

  @Cron('0 */15 * * * *')
  async handleReminders() {
    this.logger.debug('Running lesson reminders cron job');
    await this.send24hReminders();
    await this.send1hReminders();
    await this.sendPostLessonConfirmations();
  }

  private async send24hReminders() {
    const now = new Date();
    // 24 hours from now plus or minus 15 mins to catch bookings
    const rangeStart = new Date(now.getTime() + 23 * 60 * 60 * 1000 + 45 * 60 * 1000);
    const rangeEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 15 * 60 * 1000);

    const bookings = await this.bookingRepository.find({
      where: {
        start_time: Between(rangeStart, rangeEnd),
        reminder_24h_sent: false,
        status: BookingStatus.CONFIRMED,
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

  private async send1hReminders() {
    const now = new Date();
    // 1 hour from now plus or minus 15 mins
    const rangeStart = new Date(now.getTime() + 45 * 60 * 1000);
    const rangeEnd = new Date(now.getTime() + 1 * 60 * 60 * 1000 + 15 * 60 * 1000);

    const bookings = await this.bookingRepository.find({
      where: {
        start_time: Between(rangeStart, rangeEnd),
        reminder_1h_sent: false,
        status: BookingStatus.CONFIRMED,
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

  private async sendPostLessonConfirmations() {
    const now = new Date();
    // 15 minutes ago
    const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);

    const bookings = await this.bookingRepository.find({
      where: {
        end_time: LessThan(fifteenMinsAgo),
        confirmation_notification_sent: false,
        status: BookingStatus.CONFIRMED,
      },
      relations: ['tutor', 'student', 'student.user', 'tutor.user'],
    });

    for (const booking of bookings) {
      this.logger.log(`Sending post-lesson confirmation request for booking ${booking.id}`);
      
      const studentEmail = booking.student.user.email;
      const tutorEmail = booking.tutor.user.email;
      
      const studentMessage = `Assalamu Alaikum. Your lesson with ${booking.tutor.full_name} has ended. Please confirm your attendance here: ${process.env.FRONTEND_URL || 'https://aspireacademicco.co.uk'}/dashboard/bookings/${booking.id}/confirm`;
      const tutorMessage = `Assalamu Alaikum. Your lesson with ${booking.student.full_name} has ended. Please confirm your attendance here: ${process.env.FRONTEND_URL || 'https://aspireacademicco.co.uk'}/dashboard/bookings/${booking.id}/confirm`;

      await this.mailService.sendDirectEmail(studentEmail, 'Confirm Lesson Attendance', studentMessage);
      await this.mailService.sendDirectEmail(tutorEmail, 'Confirm Lesson Attendance', tutorMessage);

      booking.confirmation_notification_sent = true;
      await this.bookingRepository.save(booking);
    }
  }
}
