import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { SubjectCategory, SubjectLevel } from '../../common/enums';
import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: SubjectCategory,
  })
  category: SubjectCategory;

  @Column({
    type: 'enum',
    enum: SubjectLevel,
    default: SubjectLevel.GENERAL,
  })
  level: SubjectLevel;

  @ManyToMany(() => TutorProfile, (tutor) => tutor.subjects_v2)
  tutors: TutorProfile[];
}
