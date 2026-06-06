import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { ParentProfile } from '../parent-profiles/entities/parent-profile.entity';
import { StudentProfile } from '../student-profiles/entities/student-profile.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, TutorProfile, ParentProfile, StudentProfile],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
