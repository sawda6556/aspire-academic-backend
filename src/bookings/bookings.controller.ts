import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserType } from '../common/enums';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateBookingDto) {
    if (req.user.user_type === UserType.TUTOR) {
      throw new ForbiddenException('Tutors cannot book lessons');
    }
    return this.bookingsService.create(req.user.id, dto);
  }

  @Get('my-bookings')
  async getMyBookings(@Request() req) {
    if (req.user.user_type === UserType.TUTOR) {
      return this.bookingsService.findAllByTutor(req.user.id);
    } else if (req.user.user_type === UserType.PARENT) {
      return this.bookingsService.findAllByParent(req.user.id);
    } else {
      return this.bookingsService.findAllByStudent(req.user.id);
    }
  }
}
