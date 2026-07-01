import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { ParentProfile } from '../parent-profiles/entities/parent-profile.entity';
import { StudentProfile } from '../student-profiles/entities/student-profile.entity';
import { RegisterDto, LoginDto } from '../users/dto/auth.dto';
import { UserType, Gender } from '../common/enums';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private dataSource: DataSource,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, user_type, gender, full_name, parent_id, profile_data } = registerDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar_url = this.getAvatarUrl(gender);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = queryRunner.manager.create(User, {
        email,
        password_hash: hashedPassword,
        user_type,
        gender,
        avatar_url,
      });

      const savedUser = await queryRunner.manager.save(user);

      if (user_type === UserType.TUTOR) {
        const tutorProfile = queryRunner.manager.create(TutorProfile, {
          user_id: savedUser.id,
          full_name,
        });
        await queryRunner.manager.save(tutorProfile);
      } else if (user_type === UserType.PARENT) {
        const parentProfile = queryRunner.manager.create(ParentProfile, {
          user_id: savedUser.id,
          full_name,
        });
        await queryRunner.manager.save(parentProfile);
      } else if (user_type === UserType.STUDENT) {
        const studentProfile = queryRunner.manager.create(StudentProfile, {
          user_id: savedUser.id,
          full_name,
          parent_id,
        });
        await queryRunner.manager.save(studentProfile);
      }

      await queryRunner.commitTransaction();

      // Send welcome email and notify admin
      const userWithFullName = { ...savedUser, full_name };
      this.mailService.sendWelcomeEmail(userWithFullName).catch(err => 
        console.error('Failed to send welcome email:', err)
      );
      this.mailService.notifyAdminOnRegistration(userWithFullName, profile_data || { full_name, parent_id }).catch(err =>
        console.error('Failed to notify admin on registration:', err)
      );

      const { password_hash, ...result } = savedUser;
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password_hash', 'user_type'],
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.user_type };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private getAvatarUrl(gender: Gender): string {
    // Placeholder logic for avatar auto-assignment
    if (gender === Gender.FEMALE) {
      return '/assets/avatars/female-modest.png';
    }
    return '/assets/avatars/male-modest.png';
  }
}
