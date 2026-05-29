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

export enum DbsStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REQUIRED = 'REQUIRED',
  REJECTED = 'REJECTED',
}

export enum ResourceStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum SubjectCategory {
  ACADEMIC = 'Academic',
  PRIMARY = 'Primary School',
  SECONDARY = 'Secondary School (GCSE)',
  A_LEVEL = 'A-Level / Advanced',
  ISLAMIC = 'Islamic Studies',
  LANGUAGES = 'Languages',
  UNIVERSITY = 'University & Adult Learning',
  SKILLS = 'Skills & Development',
  SPECIAL_SUPPORT = 'Special Support',
}

export enum SubjectLevel {
  KS1 = 'KS1',
  KS2 = 'KS2',
  KS3 = 'KS3',
  GCSE = 'GCSE',
  A_LEVEL = 'A-Level',
  UNIVERSITY = 'University',
  ADULT = 'Adult',
  GENERAL = 'General',
}
