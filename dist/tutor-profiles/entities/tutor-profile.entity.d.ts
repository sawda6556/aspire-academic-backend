import { User } from '../../users/entities/user.entity';
import { VerificationStatus, DbsStatus } from '../../common/enums';
import { Subject } from '../../subjects/entities/subject.entity';
export declare class TutorProfile {
    id: string;
    user: User;
    user_id: string;
    full_name: string;
    country: string;
    bio: string;
    hourly_rate: number;
    subjects: string[];
    languages: string[];
    qualifications: string;
    experience: string;
    verification_status: VerificationStatus;
    dbs_certificate_url: string;
    dbs_verified_status: DbsStatus;
    dbs_certificate_number: string;
    is_on_update_service: boolean;
    dbs_last_checked_at: Date;
    id_document_url: string;
    cert_document_url: string;
    address_proof_url: string;
    verified_at: Date;
    subjects_v2: Subject[];
}
