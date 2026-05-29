import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { SubjectCategory, SubjectLevel } from '../common/enums';

@Injectable()
export class SubjectsService implements OnModuleInit {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async onModuleInit() {
    await this.seedSubjects();
  }

  async findAll() {
    return this.subjectRepository.find();
  }

  async findByCategory(category: SubjectCategory) {
    return this.subjectRepository.find({ where: { category } });
  }

  private async seedSubjects() {
    const count = await this.subjectRepository.count();
    if (count > 0) return;

    const subjectsToSeed = [
      // Core Academic Subjects
      { name: 'Mathematics', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'English Language', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'English Literature', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'Science (General)', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'Biology', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'Chemistry', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'Physics', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'Combined Science', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'Computer Science', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'ICT (Information & Communication Technology)', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'Geography', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },
      { name: 'History', category: SubjectCategory.ACADEMIC, level: SubjectLevel.GENERAL },

      // Primary School
      { name: 'KS1 Maths', category: SubjectCategory.PRIMARY, level: SubjectLevel.KS1 },
      { name: 'KS2 Maths', category: SubjectCategory.PRIMARY, level: SubjectLevel.KS2 },
      { name: 'KS1 English', category: SubjectCategory.PRIMARY, level: SubjectLevel.KS1 },
      { name: 'KS2 English', category: SubjectCategory.PRIMARY, level: SubjectLevel.KS2 },
      { name: 'Basic Science', category: SubjectCategory.PRIMARY, level: SubjectLevel.GENERAL },
      { name: 'Reading & Phonics', category: SubjectCategory.PRIMARY, level: SubjectLevel.GENERAL },
      { name: 'SATs Preparation (Year 2 & Year 6)', category: SubjectCategory.PRIMARY, level: SubjectLevel.GENERAL },

      // Secondary School (GCSE)
      { name: 'GCSE Maths', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },
      { name: 'GCSE English Language', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },
      { name: 'GCSE English Literature', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },
      { name: 'GCSE Biology', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },
      { name: 'GCSE Chemistry', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },
      { name: 'GCSE Physics', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },
      { name: 'GCSE Computer Science', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },
      { name: 'GCSE Geography', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },
      { name: 'GCSE History', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },
      { name: 'GCSE Religious Studies', category: SubjectCategory.SECONDARY, level: SubjectLevel.GCSE },

      // A-Level
      { name: 'A-Level Mathematics', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },
      { name: 'A-Level Further Maths', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },
      { name: 'A-Level Biology', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },
      { name: 'A-Level Chemistry', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },
      { name: 'A-Level Physics', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },
      { name: 'A-Level English Literature', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },
      { name: 'A-Level Economics', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },
      { name: 'A-Level Business Studies', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },
      { name: 'A-Level Psychology', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },
      { name: 'A-Level Computer Science', category: SubjectCategory.A_LEVEL, level: SubjectLevel.A_LEVEL },

      // Islamic Studies
      { name: 'Quran Recitation (Tajweed)', category: SubjectCategory.ISLAMIC, level: SubjectLevel.GENERAL },
      { name: 'Quran Memorisation (Hifz)', category: SubjectCategory.ISLAMIC, level: SubjectLevel.GENERAL },
      { name: 'Islamic Studies (General)', category: SubjectCategory.ISLAMIC, level: SubjectLevel.GENERAL },
      { name: 'Arabic Language', category: SubjectCategory.ISLAMIC, level: SubjectLevel.GENERAL },
      { name: 'Islamic History', category: SubjectCategory.ISLAMIC, level: SubjectLevel.GENERAL },
      { name: 'Fiqh (Islamic Law basics)', category: SubjectCategory.ISLAMIC, level: SubjectLevel.GENERAL },
      { name: 'Seerah (Prophet ﷺ biography)', category: SubjectCategory.ISLAMIC, level: SubjectLevel.GENERAL },

      // Languages
      { name: 'Arabic', category: SubjectCategory.LANGUAGES, level: SubjectLevel.GENERAL },
      { name: 'English (ESL for non-native speakers)', category: SubjectCategory.LANGUAGES, level: SubjectLevel.GENERAL },
      { name: 'French', category: SubjectCategory.LANGUAGES, level: SubjectLevel.GENERAL },
      { name: 'Spanish', category: SubjectCategory.LANGUAGES, level: SubjectLevel.GENERAL },
      { name: 'Urdu', category: SubjectCategory.LANGUAGES, level: SubjectLevel.GENERAL },
      { name: 'Bengali', category: SubjectCategory.LANGUAGES, level: SubjectLevel.GENERAL },
      { name: 'Turkish', category: SubjectCategory.LANGUAGES, level: SubjectLevel.GENERAL },
      { name: 'German', category: SubjectCategory.LANGUAGES, level: SubjectLevel.GENERAL },
      { name: 'Italian', category: SubjectCategory.LANGUAGES, level: SubjectLevel.GENERAL },

      // University
      { name: 'Essay Writing Skills', category: SubjectCategory.UNIVERSITY, level: SubjectLevel.UNIVERSITY },
      { name: 'Academic Writing', category: SubjectCategory.UNIVERSITY, level: SubjectLevel.UNIVERSITY },
      { name: 'Research Skills', category: SubjectCategory.UNIVERSITY, level: SubjectLevel.UNIVERSITY },
      { name: 'Study Skills', category: SubjectCategory.UNIVERSITY, level: SubjectLevel.UNIVERSITY },
      { name: 'Exam Preparation', category: SubjectCategory.UNIVERSITY, level: SubjectLevel.UNIVERSITY },
      { name: 'University Entrance Exams (e.g. UCAT, LNAT)', category: SubjectCategory.UNIVERSITY, level: SubjectLevel.UNIVERSITY },

      // Skills
      { name: 'Coding / Programming (Python, Java, etc.)', category: SubjectCategory.SKILLS, level: SubjectLevel.GENERAL },
      { name: 'Web Development', category: SubjectCategory.SKILLS, level: SubjectLevel.GENERAL },
      { name: 'Graphic Design', category: SubjectCategory.SKILLS, level: SubjectLevel.GENERAL },
      { name: 'Public Speaking', category: SubjectCategory.SKILLS, level: SubjectLevel.GENERAL },
      { name: 'Presentation Skills', category: SubjectCategory.SKILLS, level: SubjectLevel.GENERAL },
      { name: 'Critical Thinking', category: SubjectCategory.SKILLS, level: SubjectLevel.GENERAL },
      { name: 'Problem Solving', category: SubjectCategory.SKILLS, level: SubjectLevel.GENERAL },

      // Special Support
      { name: 'SEN Support', category: SubjectCategory.SPECIAL_SUPPORT, level: SubjectLevel.GENERAL },
      { name: 'Dyslexia Support', category: SubjectCategory.SPECIAL_SUPPORT, level: SubjectLevel.GENERAL },
      { name: 'ADHD Learning Support', category: SubjectCategory.SPECIAL_SUPPORT, level: SubjectLevel.GENERAL },
      { name: 'Catch-up Learning', category: SubjectCategory.SPECIAL_SUPPORT, level: SubjectLevel.GENERAL },
      { name: 'Confidence Building', category: SubjectCategory.SPECIAL_SUPPORT, level: SubjectLevel.GENERAL },
    ];

    await this.subjectRepository.save(subjectsToSeed);
    console.log('Successfully seeded subjects');
  }
}
