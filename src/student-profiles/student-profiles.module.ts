import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfilesController } from './student-profiles.controller';
import { StudentProfilesService } from './student-profiles.service';
import { StudentProfile } from './entities/student-profile.entity';

import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudentProfile]), MailModule],
  controllers: [StudentProfilesController],
  providers: [StudentProfilesService],
  exports: [StudentProfilesService],
})
export class StudentProfilesModule {}
