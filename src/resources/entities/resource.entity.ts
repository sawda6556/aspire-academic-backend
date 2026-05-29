import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';
import { Category } from './category.entity';
import { ResourceStatus } from '../../common/enums';
import { ResourceReview } from './resource-review.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tutor_id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  file_url: string;

  @Column({ nullable: true })
  preview_url: string;

  @Column()
  category_id: string;

  @Column({ type: 'jsonb', nullable: true })
  subjects: string[];

  @Column({ nullable: true })
  grade_level: string;

  @Column({ type: 'enum', enum: ResourceStatus, default: ResourceStatus.DRAFT })
  status: ResourceStatus;

  @Column({ type: 'float', default: 0.0 })
  average_rating: number;

  @Column({ type: 'int', default: 0 })
  review_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => TutorProfile)
  @JoinColumn({ name: 'tutor_id' })
  tutor: TutorProfile;

  @ManyToOne(() => Category, (category) => category.resources)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ResourceReview, (review) => review.resource)
  reviews: ResourceReview[];
}
