import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from './entities/student-profile.entity';
import { VerificationStatus } from '../common/enums';

@Injectable()
export class StudentProfilesService {
  constructor(
    @InjectRepository(StudentProfile)
    private studentProfilesRepository: Repository<StudentProfile>,
  ) {}

  async findByUserId(userId: string): Promise<StudentProfile> {
    const profile = await this.studentProfilesRepository.findOne({ where: { user_id: userId } });
    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }
    return profile;
  }

  async submitForVerification(userId: string, idUrl: string): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    profile.id_document_url = idUrl;
    profile.verification_status = VerificationStatus.PENDING;
    return this.studentProfilesRepository.save(profile);
  }

  async adminReview(profileId: string, status: VerificationStatus): Promise<StudentProfile> {
    const profile = await this.studentProfilesRepository.findOne({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }
    profile.verification_status = status;
    if (status === VerificationStatus.APPROVED) {
      profile.verified_at = new Date();
    }
    return this.studentProfilesRepository.save(profile);
  }

  async findOne(id: string): Promise<StudentProfile> {
    const profile = await this.studentProfilesRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }
    return profile;
  }

  async findAll(): Promise<StudentProfile[]> {
    return this.studentProfilesRepository.find();
  }
}
