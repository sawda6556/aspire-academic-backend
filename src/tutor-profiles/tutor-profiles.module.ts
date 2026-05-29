import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorProfilesController } from './tutor-profiles.controller';
import { TutorProfilesService } from './tutor-profiles.service';
import { TutorProfile } from './entities/tutor-profile.entity';

import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([TutorProfile]), MailModule],
  controllers: [TutorProfilesController],
  providers: [TutorProfilesService],
  exports: [TutorProfilesService],
})
export class TutorProfilesModule {}
