import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Resource } from './resource.entity';

@Entity('resource_reviews')
export class ResourceReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resource_id: string;

  @Column()
  user_id: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Resource, (resource) => resource.reviews)
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
