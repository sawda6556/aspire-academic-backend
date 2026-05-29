import { UserType, Gender } from '../../common/enums';
import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';
import { ParentProfile } from '../../parent-profiles/entities/parent-profile.entity';
import { StudentProfile } from '../../student-profiles/entities/student-profile.entity';
export declare class User {
    id: string;
    email: string;
    password_hash: string;
    user_type: UserType;
    gender: Gender;
    avatar_url: string;
    created_at: Date;
    updated_at: Date;
    tutor_profile: TutorProfile;
    parent_profile: ParentProfile;
    student_profile: StudentProfile;
}
