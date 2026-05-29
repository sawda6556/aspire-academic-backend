import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemindersService } from './reminders.service';
import { Booking } from '../bookings/entities/booking.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    MailModule,
  ],
  providers: [RemindersService],
})
export class RemindersModule {}
