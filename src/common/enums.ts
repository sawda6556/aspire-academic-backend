export enum UserType {
  TUTOR = 'TUTOR',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum ResourceStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

export enum SubjectCategory {
  ACADEMIC = 'Academic',
  ISLAMIC = 'Islamic Studies',
  LANGUAGES = 'Languages',
  SKILLS = 'Skills & Development',
  PRIMARY = 'Primary School',
  SECONDARY = 'Secondary School (GCSE)',
  A_LEVEL = 'A-Level / Advanced',
  UNIVERSITY = 'University & Adult Learning',
  SPECIAL_SUPPORT = 'Special Support',
  OTHER = 'Other',
}

export enum SubjectLevel {
  GENERAL = 'General',
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  PRIMARY = 'Primary School',
  SECONDARY = 'Secondary School',
  KS1 = 'KS1',
  KS2 = 'KS2',
  KS3 = 'KS3',
  GCSE = 'GCSE',
  A_LEVEL = 'A-Level',
  UNIVERSITY = 'University',
  ADULT = 'Adult',
}
