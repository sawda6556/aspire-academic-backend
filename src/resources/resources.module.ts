import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { Resource } from './entities/resource.entity';
import { Category } from './entities/category.entity';
import { ResourcePurchase } from './entities/resource-purchase.entity';
import { ResourceReview } from './entities/resource-review.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resource,
      Category,
      ResourcePurchase,
      ResourceReview,
      TutorProfile,
    ]),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
