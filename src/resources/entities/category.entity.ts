import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Resource } from './resource.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  icon_url: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Resource, (resource) => resource.category)
  resources: Resource[];
}
