import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorProfile } from './entities/tutor-profile.entity';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { VerificationStatus } from '../common/enums';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TutorProfilesService {
  constructor(
    @InjectRepository(TutorProfile)
    private tutorProfilesRepository: Repository<TutorProfile>,
    private readonly mailService: MailService,
  ) {}

  async findByUserId(userId: string): Promise<TutorProfile> {
    const profile = await this.tutorProfilesRepository.findOne({ where: { user_id: userId } });
    if (!profile) {
      throw new NotFoundException('Tutor profile not found');
    }
    return profile;
  }

  async update(userId: string, updateDto: UpdateTutorProfileDto): Promise<TutorProfile> {
    const profile = await this.findByUserId(userId);
    Object.assign(profile, updateDto);
    return this.tutorProfilesRepository.save(profile);
  }

  async submitForVerification(userId: string, idUrl: string, certUrl: string): Promise<TutorProfile> {
    const profile = await this.tutorProfilesRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Tutor profile not found');
    }
    profile.id_document_url = idUrl;
    profile.cert_document_url = certUrl;
    profile.verification_status = VerificationStatus.PENDING;
    const savedProfile = await this.tutorProfilesRepository.save(profile);

    // Notify admin
    this.mailService.notifyAdminOnVerificationUpload(profile.user, [idUrl, certUrl]).catch(err => {
      console.error('Failed to notify admin on verification upload:', err);
    });

    return savedProfile;
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

  async findActiveTutors(): Promise<TutorProfile[]> {
    return this.tutorProfilesRepository.find({
      where: { verification_status: VerificationStatus.APPROVED },
    });
  }

  async findAll(): Promise<TutorProfile[]> {
    return this.tutorProfilesRepository.find({
      relations: ['user'],
    });
  }
}
