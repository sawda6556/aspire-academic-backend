import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { User } from '../users/entities/user.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { ResourcePurchase } from '../resources/entities/resource-purchase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TutorProfile, Booking, ResourcePurchase]),
  ],
  controllers: [AdminAnalyticsController],
  providers: [AdminAnalyticsService],
})
export class AdminAnalyticsModule {}
