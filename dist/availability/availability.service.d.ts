import { Repository } from 'typeorm';
import { Availability } from './entities/availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
export declare class AvailabilityService {
    private readonly availabilityRepository;
    constructor(availabilityRepository: Repository<Availability>);
    create(tutorId: string, dto: CreateAvailabilityDto): Promise<Availability>;
    findAllByTutor(tutorId: string): Promise<Availability[]>;
    remove(id: string, tutorId: string): Promise<Availability>;
}
