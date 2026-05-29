import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';
import { StudentProfile } from '../../student-profiles/entities/student-profile.entity';
import { BookingStatus } from '../../common/enums';
export declare class Booking {
    id: string;
    tutor_id: string;
    student_id: string;
    start_time: Date;
    end_time: Date;
    status: BookingStatus;
    is_trial: boolean;
    video_meeting_url: string;
    reminder_24h_sent: boolean;
    reminder_1h_sent: boolean;
    created_at: Date;
    updated_at: Date;
    tutor: TutorProfile;
    student: StudentProfile;
}
