import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ParentProfile } from '../../parent-profiles/entities/parent-profile.entity';
import { VerificationStatus } from '../../common/enums';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.student_profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column()
  full_name: string;

  @ManyToOne(() => ParentProfile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: ParentProfile;

  @Column({ name: 'parent_id', nullable: true })
  parent_id: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verification_status: VerificationStatus;

  @Column({ nullable: true })
  id_document_url: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  verified_at: Date;
}
