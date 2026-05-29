import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';
import { StudentProfile } from '../../student-profiles/entities/student-profile.entity';
import { BookingStatus } from '../../common/enums';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tutor_id: string;

  @Column()
  student_id: string;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ default: false })
  is_trial: boolean;

  @Column({ nullable: true })
  video_meeting_url: string;

  @Column({ default: false })
  reminder_24h_sent: boolean;

  @Column({ default: false })
  reminder_1h_sent: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => TutorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor: TutorProfile;

  @ManyToOne(() => StudentProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: StudentProfile;
}
