import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { Repository } from 'typeorm';
export declare class AvailabilityController {
    private readonly availabilityService;
    private readonly tutorProfileRepository;
    constructor(availabilityService: AvailabilityService, tutorProfileRepository: Repository<TutorProfile>);
    create(req: any, dto: CreateAvailabilityDto): Promise<import("./entities/availability.entity").Availability>;
    findAll(tutorId: string): Promise<import("./entities/availability.entity").Availability[]>;
    remove(req: any, id: string): Promise<import("./entities/availability.entity").Availability>;
}
