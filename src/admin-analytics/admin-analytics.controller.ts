import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminAnalyticsController {
  constructor(private readonly analyticsService: AdminAnalyticsService) {}

  @Get('overview')
  async getOverview() {
    return await this.analyticsService.getOverviewStats();
  }

  @Get('user-growth')
  async getUserGrowth() {
    return await this.analyticsService.getUserGrowth();
  }

  @Get('lessons-by-subject')
  async getLessonsBySubject() {
    return await this.analyticsService.getLessonsBySubject();
  }

  @Get('revenue-over-time')
  async getRevenueOverTime() {
    return await this.analyticsService.getRevenueOverTime();
  }
}
