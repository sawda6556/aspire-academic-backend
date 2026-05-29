import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorProfile } from './entities/tutor-profile.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { VerificationStatus, DbsStatus } from '../common/enums';

@Injectable()
export class TutorProfilesService {
  constructor(
    @InjectRepository(TutorProfile)
    private tutorProfilesRepository: Repository<TutorProfile>,
  ) {}

  async findByUserId(userId: string): Promise<TutorProfile> {
    const profile = await this.tutorProfilesRepository.findOne({ 
      where: { user_id: userId },
      relations: ['subjects_v2']
    });
    if (!profile) {
      throw new NotFoundException('Tutor profile not found');
    }
    return profile;
  }

  async update(userId: string, updateDto: UpdateTutorProfileDto): Promise<TutorProfile> {
    const profile = await this.findByUserId(userId);
    const { subject_ids, ...rest } = updateDto;
    
    Object.assign(profile, rest);

    if (subject_ids && Array.isArray(subject_ids)) {
      const subjects = await this.tutorProfilesRepository.manager.find(Subject, {
        where: subject_ids.map(id => ({ id }))
      });
      profile.subjects_v2 = subjects;
    }

    return this.tutorProfilesRepository.save(profile);
  }

  async submitForVerification(userId: string, idUrl: string, certUrl: string, addressUrl: string): Promise<TutorProfile> {
    const profile = await this.findByUserId(userId);
    profile.id_document_url = idUrl;
    profile.cert_document_url = certUrl;
    profile.address_proof_url = addressUrl;
    profile.verification_status = VerificationStatus.PENDING;
    return this.tutorProfilesRepository.save(profile);
  }

  async adminReview(profileId: string, status: VerificationStatus): Promise<TutorProfile> {
    const profile = await this.tutorProfilesRepository.findOne({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException('Tutor profile not found');
    }
    profile.verification_status = status;
    if (status === VerificationStatus.APPROVED) {
      profile.verified_at = new Date();
    }
    return this.tutorProfilesRepository.save(profile);
  }

  async adminReviewDbs(profileId: string, status: DbsStatus): Promise<TutorProfile> {
    const profile = await this.tutorProfilesRepository.findOne({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException('Tutor profile not found');
    }
    profile.dbs_verified_status = status;
    if (status === DbsStatus.VERIFIED) {
      profile.dbs_last_checked_at = new Date();
    }
    return this.tutorProfilesRepository.save(profile);
  }

  async findOne(id: string): Promise<TutorProfile> {
    const profile = await this.tutorProfilesRepository.findOne({ 
      where: { id },
      relations: ['subjects_v2']
    });
    if (!profile) {
      throw new NotFoundException('Tutor profile not found');
    }
    return profile;
  }

  async findActiveTutors(): Promise<TutorProfile[]> {
    return this.tutorProfilesRepository.find({
      where: { verification_status: VerificationStatus.APPROVED },
      relations: ['subjects_v2']
    });
  }

  async findAll(): Promise<TutorProfile[]> {
    return this.tutorProfilesRepository.find({
      relations: ['subjects_v2']
    });
  }
}
