import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { ParentProfile } from '../parent-profiles/entities/parent-profile.entity';
import { StudentProfile } from '../student-profiles/entities/student-profile.entity';
import { Subject } from '../subjects/entities/subject.entity';
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
        if (!profile_data?.id_document_url || !profile_data?.address_proof_url) {
          throw new BadRequestException('ID document and address proof are mandatory for tutors');
        }
        let subjectsV2: Subject[] = [];
        if (profile_data?.subjects && Array.isArray(profile_data.subjects)) {
          subjectsV2 = await queryRunner.manager.find(Subject, {
            where: profile_data.subjects.map(id => ({ id }))
          });
        }

        const tutorProfile = queryRunner.manager.create(TutorProfile, {
          user_id: savedUser.id,
          full_name,
          country: profile_data?.country,
          subjects: profile_data?.subjects,
          subjects_v2: subjectsV2,
          qualifications: profile_data?.qualifications,
          bio: profile_data?.bio,
          id_document_url: profile_data?.id_document_url,
          address_proof_url: profile_data?.address_proof_url,
          cert_document_url: profile_data?.cert_document_url,
          dbs_certificate_url: profile_data?.dbs_certificate_url,
          dbs_certificate_number: profile_data?.dbs_certificate_number,
          is_on_update_service: profile_data?.is_on_update_service || false,
        });
        await queryRunner.manager.save(tutorProfile);
      } else if (user_type === UserType.PARENT) {
        const parentProfile = queryRunner.manager.create(ParentProfile, {
          user_id: savedUser.id,
          full_name,
        });
        await queryRunner.manager.save(parentProfile);
      } else if (user_type === UserType.STUDENT) {
        if (!parent_id && !profile_data?.id_document_url) {
          throw new BadRequestException('ID document is mandatory for independent students (18+)');
        }
        const studentProfile = queryRunner.manager.create(StudentProfile, {
          user_id: savedUser.id,
          full_name,
          parent_id,
          id_document_url: profile_data?.id_document_url,
        });
        await queryRunner.manager.save(studentProfile);
      }

      await queryRunner.commitTransaction();

      // Notify admin on successful registration
      this.mailService.notifyAdminOnRegistration(savedUser, profile_data);

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
    if (gender === Gender.FEMALE) {
      return '/assets/avatars/female-avatar-hijab.png';
    }
    return '/assets/avatars/male-avatar.svg';
  }
}
