import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Resource } from './resource.entity';

@Entity('resource_purchases')
export class ResourcePurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  resource_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_at_purchase: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  platform_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tutor_revenue: number;

  @Column({ nullable: true })
  stripe_payment_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Resource)
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;
}
