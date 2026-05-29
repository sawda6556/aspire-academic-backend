import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentProfilesController } from './parent-profiles.controller';
import { ParentProfilesService } from './parent-profiles.service';
import { ParentProfile } from './entities/parent-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParentProfile])],
  controllers: [ParentProfilesController],
  providers: [ParentProfilesService],
  exports: [ParentProfilesService],
})
export class ParentProfilesModule {}
