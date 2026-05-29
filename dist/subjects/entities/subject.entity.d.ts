import { SubjectCategory, SubjectLevel } from '../../common/enums';
import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';
export declare class Subject {
    id: string;
    name: string;
    category: SubjectCategory;
    level: SubjectLevel;
    tutors: TutorProfile[];
}
