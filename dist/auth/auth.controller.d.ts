import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../users/dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        user_type: import("../common/enums").UserType;
        gender: import("../common/enums").Gender;
        avatar_url: string;
        created_at: Date;
        updated_at: Date;
        tutor_profile: import("../tutor-profiles/entities/tutor-profile.entity").TutorProfile;
        parent_profile: import("../parent-profiles/entities/parent-profile.entity").ParentProfile;
        student_profile: import("../student-profiles/entities/student-profile.entity").StudentProfile;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    getMe(req: any): Promise<any>;
}
