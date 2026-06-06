import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorProfilesController } from './tutor-profiles.controller';
import { TutorProfilesService } from './tutor-profiles.service';
import { TutorProfile } from './entities/tutor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TutorProfile])],
  controllers: [TutorProfilesController],
  providers: [TutorProfilesService],
  exports: [TutorProfilesService],
})
export class TutorProfilesModule {}
