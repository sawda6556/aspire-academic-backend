import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { ResourcePurchase } from '../resources/entities/resource-purchase.entity';
import { UserType, BookingStatus } from '../common/enums';

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TutorProfile)
    private readonly tutorRepository: Repository<TutorProfile>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(ResourcePurchase)
    private readonly purchaseRepository: Repository<ResourcePurchase>,
  ) {}

  async getOverviewStats() {
    const totalUsers = await this.userRepository.count();
    const activeTutors = await this.tutorRepository.count({ where: { verification_status: 'APPROVED' } });
    const pendingTutors = await this.tutorRepository.count({ where: { verification_status: 'PENDING' } });
    
    const lessonsThisMonth = await this.bookingRepository.createQueryBuilder('booking')
      .where('booking.status = :status', { status: BookingStatus.CONFIRMED })
      .andWhere('booking.start_time >= :start', { start: new Date(new Date().getFullYear(), new Date().getMonth(), 1) })
      .getCount();

    const revenueResult = await this.purchaseRepository.createQueryBuilder('purchase')
      .select('SUM(purchase.price_at_purchase)', 'total')
      .getRawOne();
    
    const totalRevenue = parseFloat(revenueResult.total || 0);

    return {
      totalUsers,
      activeTutors,
      pendingTutors,
      lessonsThisMonth,
      totalRevenue,
      trends: {
        users: 12, // Mocked percentage
        tutors: 5,
        lessons: 8,
        revenue: 15
      }
    };
  }

  async getUserGrowth() {
    // Mocked growth data for chart
    return [
      { month: 'Jan', count: 400 },
      { month: 'Feb', count: 600 },
      { month: 'Mar', count: 800 },
      { month: 'Apr', count: 1000 },
      { month: 'May', count: 1247 },
    ];
  }

  async getLessonsBySubject() {
    // In a real app, we would join with subjects. 
    // Mocked for now to match design.
    return [
      { subject: 'Math', count: 45 },
      { subject: 'Science', count: 25 },
      { subject: 'Languages', count: 15 },
      { subject: 'English', count: 10 },
      { subject: 'Quran', count: 5 },
    ];
  }

  async getRevenueOverTime() {
    return [
      { month: 'Jan', revenue: 1200 },
      { month: 'Feb', revenue: 2100 },
      { month: 'Mar', revenue: 1800 },
      { month: 'Apr', revenue: 3400 },
      { month: 'May', revenue: 4280 },
    ];
  }
}
