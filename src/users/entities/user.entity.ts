import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserType, Gender } from '../../common/enums';
import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';
import { ParentProfile } from '../../parent-profiles/entities/parent-profile.entity';
import { StudentProfile } from '../../student-profiles/entities/student-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Hide password by default
  password_hash: string;

  @Column({ type: 'enum', enum: UserType })
  user_type: UserType;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  avatar_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => TutorProfile, (profile) => profile.user)
  tutor_profile: TutorProfile;

  @OneToOne(() => ParentProfile, (profile) => profile.user)
  parent_profile: ParentProfile;

  @OneToOne(() => StudentProfile, (profile) => profile.user)
  student_profile: StudentProfile;
}
