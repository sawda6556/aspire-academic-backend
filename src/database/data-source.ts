import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { ParentProfile } from '../parent-profiles/entities/parent-profile.entity';
import { StudentProfile } from '../student-profiles/entities/student-profile.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Availability } from '../availability/entities/availability.entity';
import { Resource } from '../resources/entities/resource.entity';
import { Category } from '../resources/entities/category.entity';
import { ResourcePurchase } from '../resources/entities/resource-purchase.entity';
import { ResourceReview } from '../resources/entities/resource-review.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    User,
    TutorProfile,
    ParentProfile,
    StudentProfile,
    Subject,
    Booking,
    Availability,
    Resource,
    Category,
    ResourcePurchase,
    ResourceReview,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
