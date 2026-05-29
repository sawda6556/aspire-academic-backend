import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';
export declare class Availability {
    id: string;
    tutor_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    tutor: TutorProfile;
}
