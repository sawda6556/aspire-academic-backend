import { StudentProfilesService } from './student-profiles.service';
import { MailService } from '../mail/mail.service';
import { VerificationStatus } from '../common/enums';
export declare class StudentProfilesController {
    private readonly studentProfilesService;
    private readonly mailService;
    constructor(studentProfilesService: StudentProfilesService, mailService: MailService);
    getAll(): Promise<import("./entities/student-profile.entity").StudentProfile[]>;
    getMyProfile(req: any): Promise<import("./entities/student-profile.entity").StudentProfile>;
    submitVerification(req: any, files: {
        id_document?: Express.Multer.File[];
    }): Promise<import("./entities/student-profile.entity").StudentProfile>;
    adminReview(id: string, status: VerificationStatus): Promise<import("./entities/student-profile.entity").StudentProfile>;
}
