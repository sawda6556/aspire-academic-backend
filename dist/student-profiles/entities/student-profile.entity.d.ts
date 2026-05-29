import { User } from '../../users/entities/user.entity';
import { ParentProfile } from '../../parent-profiles/entities/parent-profile.entity';
import { VerificationStatus } from '../../common/enums';
export declare class StudentProfile {
    id: string;
    user: User;
    user_id: string;
    full_name: string;
    parent: ParentProfile;
    parent_id: string;
    verification_status: VerificationStatus;
    id_document_url: string;
    verified_at: Date;
}
