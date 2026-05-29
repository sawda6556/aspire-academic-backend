import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserType } from '../common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { Repository } from 'typeorm';

@Controller('availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    @InjectRepository(TutorProfile)
    private readonly tutorProfileRepository: Repository<TutorProfile>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() dto: CreateAvailabilityDto) {
    if (req.user.user_type !== UserType.TUTOR) {
      throw new ForbiddenException('Only tutors can set availability');
    }
    const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
    if (!tutorProfile) {
      throw new ForbiddenException('Tutor profile not found');
    }
    return this.availabilityService.create(tutorProfile.id, dto);
  }

  @Get('tutor/:tutorId')
  async findAll(@Param('tutorId') tutorId: string) {
    return this.availabilityService.findAllByTutor(tutorId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    if (req.user.user_type !== UserType.TUTOR) {
      throw new ForbiddenException('Only tutors can remove availability');
    }
    const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
    if (!tutorProfile) {
      throw new ForbiddenException('Tutor profile not found');
    }
    return this.availabilityService.remove(id, tutorProfile.id);
  }
}
