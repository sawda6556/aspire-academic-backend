import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './entities/availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
  ) {}

  async create(tutorId: string, dto: CreateAvailabilityDto) {
    const availability = this.availabilityRepository.create({
      tutor_id: tutorId,
      ...dto,
    });
    return await this.availabilityRepository.save(availability);
  }

  async findAllByTutor(tutorId: string) {
    return await this.availabilityRepository.find({
      where: { tutor_id: tutorId },
      order: { day_of_week: 'ASC', start_time: 'ASC' },
    });
  }

  async remove(id: string, tutorId: string) {
    const availability = await this.availabilityRepository.findOne({
      where: { id, tutor_id: tutorId },
    });
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }
    return await this.availabilityRepository.remove(availability);
  }
}
