import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    @InjectRepository(TutorProfile)
    private readonly tutorProfileRepository: Repository<TutorProfile>,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.resourcesService.findAll(query);
  }

  @Get('categories')
  async getCategories() {
    return this.resourcesService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Get('purchased')
  async getPurchased(@Request() req) {
    return this.resourcesService.findPurchased(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/buy')
  async buy(@Request() req, @Param('id') id: string, @Body('payment_method_id') paymentMethodId: string) {
    return this.resourcesService.purchase(req.user.id, id, paymentMethodId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  async addReview(@Request() req, @Param('id') id: string, @Body() reviewData: { rating: number; comment: string }) {
    return this.resourcesService.addReview(req.user.id, id, reviewData.rating, reviewData.comment);
  }

  // Tutor Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.TUTOR)
  @Post()
  async create(@Request() req, @Body() dto: CreateResourceDto) {
    const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
    if (!tutorProfile) {
      throw new ForbiddenException('Tutor profile not found');
    }
    return this.resourcesService.create(tutorProfile.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.TUTOR)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateResourceDto) {
    const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
    if (!tutorProfile) {
      throw new ForbiddenException('Tutor profile not found');
    }
    return this.resourcesService.update(id, tutorProfile.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.TUTOR)
  @Get('tutor/my-resources')
  async getTutorResources(@Request() req) {
    const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
    if (!tutorProfile) {
      throw new ForbiddenException('Tutor profile not found');
    }
    return this.resourcesService.findTutorResources(tutorProfile.id);
  }
}
