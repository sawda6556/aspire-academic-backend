import { Repository } from 'typeorm';
import { TutorProfile } from './entities/tutor-profile.entity';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { VerificationStatus, DbsStatus } from '../common/enums';
export declare class TutorProfilesService {
    private tutorProfilesRepository;
    constructor(tutorProfilesRepository: Repository<TutorProfile>);
    findByUserId(userId: string): Promise<TutorProfile>;
    update(userId: string, updateDto: UpdateTutorProfileDto): Promise<TutorProfile>;
    submitForVerification(userId: string, idUrl: string, certUrl: string, addressUrl: string): Promise<TutorProfile>;
    adminReview(profileId: string, status: VerificationStatus): Promise<TutorProfile>;
    adminReviewDbs(profileId: string, status: DbsStatus): Promise<TutorProfile>;
    findOne(id: string): Promise<TutorProfile>;
    findActiveTutors(): Promise<TutorProfile[]>;
    findAll(): Promise<TutorProfile[]>;
}
