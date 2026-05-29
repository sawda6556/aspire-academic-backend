import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { StudentProfile } from '../student-profiles/entities/student-profile.entity';
import { ParentProfile } from '../parent-profiles/entities/parent-profile.entity';
import { ZoomModule } from '../integrations/zoom/zoom.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, TutorProfile, StudentProfile, ParentProfile]),
    ZoomModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
