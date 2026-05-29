import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';

@Entity('availability')
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tutor_id: string;

  @Column({ type: 'int' })
  day_of_week: number; // 0-6

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @ManyToOne(() => TutorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor: TutorProfile;
}
