import { Repository } from 'typeorm';
import { StudentProfile } from './entities/student-profile.entity';
import { VerificationStatus } from '../common/enums';
export declare class StudentProfilesService {
    private studentProfilesRepository;
    constructor(studentProfilesRepository: Repository<StudentProfile>);
    findByUserId(userId: string): Promise<StudentProfile>;
    submitForVerification(userId: string, idUrl: string): Promise<StudentProfile>;
    adminReview(profileId: string, status: VerificationStatus): Promise<StudentProfile>;
    findOne(id: string): Promise<StudentProfile>;
    findAll(): Promise<StudentProfile[]>;
}
