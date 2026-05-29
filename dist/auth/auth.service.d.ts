import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { ParentProfile } from '../parent-profiles/entities/parent-profile.entity';
import { StudentProfile } from '../student-profiles/entities/student-profile.entity';
import { RegisterDto, LoginDto } from '../users/dto/auth.dto';
import { UserType, Gender } from '../common/enums';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private dataSource;
    private mailService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, dataSource: DataSource, mailService: MailService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        user_type: UserType;
        gender: Gender;
        avatar_url: string;
        created_at: Date;
        updated_at: Date;
        tutor_profile: TutorProfile;
        parent_profile: ParentProfile;
        student_profile: StudentProfile;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    private getAvatarUrl;
}
