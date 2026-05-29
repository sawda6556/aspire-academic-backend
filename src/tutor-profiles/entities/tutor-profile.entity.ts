import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VerificationStatus, DbsStatus } from '../../common/enums';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('tutor_profiles')
export class TutorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.tutor_profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourly_rate: number;

  @Column({ type: 'jsonb', nullable: true })
  subjects: string[];

  @Column({ type: 'jsonb', nullable: true })
  languages: string[];

  @Column({ type: 'text', nullable: true })
  qualifications: string;

  @Column({ type: 'text', nullable: true })
  experience: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verification_status: VerificationStatus;

  @Column({ nullable: true })
  dbs_certificate_url: string;

  @Column({
    type: 'enum',
    enum: DbsStatus,
    default: DbsStatus.PENDING,
  })
  dbs_verified_status: DbsStatus;

  @Column({ nullable: true })
  dbs_certificate_number: string;

  @Column({ default: false })
  is_on_update_service: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dbs_last_checked_at: Date;

  @Column()
  id_document_url: string;

  @Column({ nullable: true })
  cert_document_url: string;

  @Column()
  address_proof_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  verified_at: Date;

  @ManyToMany(() => Subject, (subject) => subject.tutors)
  @JoinTable({
    name: 'tutor_subjects',
    joinColumn: { name: 'tutor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subject_id', referencedColumnName: 'id' },
  })
  subjects_v2: Subject[];
}
