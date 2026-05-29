import { TutorProfilesService } from './tutor-profiles.service';
import { MailService } from '../mail/mail.service';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { VerificationStatus, DbsStatus } from '../common/enums';
export declare class TutorProfilesController {
    private readonly tutorProfilesService;
    private readonly mailService;
    constructor(tutorProfilesService: TutorProfilesService, mailService: MailService);
    getMarketplace(): Promise<import("./entities/tutor-profile.entity").TutorProfile[]>;
    getAll(): Promise<import("./entities/tutor-profile.entity").TutorProfile[]>;
    getMyProfile(req: any): Promise<import("./entities/tutor-profile.entity").TutorProfile>;
    updateMyProfile(req: any, updateDto: UpdateTutorProfileDto): Promise<import("./entities/tutor-profile.entity").TutorProfile>;
    submitVerification(req: any, files: {
        id_document?: Express.Multer.File[];
        cert_document?: Express.Multer.File[];
        address_proof?: Express.Multer.File[];
    }): Promise<import("./entities/tutor-profile.entity").TutorProfile>;
    getProfile(id: string): Promise<import("./entities/tutor-profile.entity").TutorProfile>;
    adminReview(id: string, status: VerificationStatus): Promise<import("./entities/tutor-profile.entity").TutorProfile>;
    adminReviewDbs(id: string, status: DbsStatus): Promise<import("./entities/tutor-profile.entity").TutorProfile>;
}
