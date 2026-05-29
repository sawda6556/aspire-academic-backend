"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subject_entity_1 = require("./entities/subject.entity");
const enums_1 = require("../common/enums");
let SubjectsService = class SubjectsService {
    subjectRepository;
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    async onModuleInit() {
        await this.seedSubjects();
    }
    async findAll() {
        return this.subjectRepository.find();
    }
    async findByCategory(category) {
        return this.subjectRepository.find({ where: { category } });
    }
    async seedSubjects() {
        const count = await this.subjectRepository.count();
        if (count > 0)
            return;
        const subjectsToSeed = [
            { name: 'Mathematics', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'English Language', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'English Literature', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Science (General)', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Biology', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Chemistry', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Physics', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Combined Science', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Computer Science', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'ICT (Information & Communication Technology)', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Geography', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'History', category: enums_1.SubjectCategory.ACADEMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'KS1 Maths', category: enums_1.SubjectCategory.PRIMARY, level: enums_1.SubjectLevel.KS1 },
            { name: 'KS2 Maths', category: enums_1.SubjectCategory.PRIMARY, level: enums_1.SubjectLevel.KS2 },
            { name: 'KS1 English', category: enums_1.SubjectCategory.PRIMARY, level: enums_1.SubjectLevel.KS1 },
            { name: 'KS2 English', category: enums_1.SubjectCategory.PRIMARY, level: enums_1.SubjectLevel.KS2 },
            { name: 'Basic Science', category: enums_1.SubjectCategory.PRIMARY, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Reading & Phonics', category: enums_1.SubjectCategory.PRIMARY, level: enums_1.SubjectLevel.GENERAL },
            { name: 'SATs Preparation (Year 2 & Year 6)', category: enums_1.SubjectCategory.PRIMARY, level: enums_1.SubjectLevel.GENERAL },
            { name: 'GCSE Maths', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'GCSE English Language', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'GCSE English Literature', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'GCSE Biology', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'GCSE Chemistry', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'GCSE Physics', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'GCSE Computer Science', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'GCSE Geography', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'GCSE History', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'GCSE Religious Studies', category: enums_1.SubjectCategory.SECONDARY, level: enums_1.SubjectLevel.GCSE },
            { name: 'A-Level Mathematics', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'A-Level Further Maths', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'A-Level Biology', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'A-Level Chemistry', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'A-Level Physics', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'A-Level English Literature', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'A-Level Economics', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'A-Level Business Studies', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'A-Level Psychology', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'A-Level Computer Science', category: enums_1.SubjectCategory.A_LEVEL, level: enums_1.SubjectLevel.A_LEVEL },
            { name: 'Quran Recitation (Tajweed)', category: enums_1.SubjectCategory.ISLAMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Quran Memorisation (Hifz)', category: enums_1.SubjectCategory.ISLAMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Islamic Studies (General)', category: enums_1.SubjectCategory.ISLAMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Arabic Language', category: enums_1.SubjectCategory.ISLAMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Islamic History', category: enums_1.SubjectCategory.ISLAMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Fiqh (Islamic Law basics)', category: enums_1.SubjectCategory.ISLAMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Seerah (Prophet ﷺ biography)', category: enums_1.SubjectCategory.ISLAMIC, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Arabic', category: enums_1.SubjectCategory.LANGUAGES, level: enums_1.SubjectLevel.GENERAL },
            { name: 'English (ESL for non-native speakers)', category: enums_1.SubjectCategory.LANGUAGES, level: enums_1.SubjectLevel.GENERAL },
            { name: 'French', category: enums_1.SubjectCategory.LANGUAGES, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Spanish', category: enums_1.SubjectCategory.LANGUAGES, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Urdu', category: enums_1.SubjectCategory.LANGUAGES, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Bengali', category: enums_1.SubjectCategory.LANGUAGES, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Turkish', category: enums_1.SubjectCategory.LANGUAGES, level: enums_1.SubjectLevel.GENERAL },
            { name: 'German', category: enums_1.SubjectCategory.LANGUAGES, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Italian', category: enums_1.SubjectCategory.LANGUAGES, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Essay Writing Skills', category: enums_1.SubjectCategory.UNIVERSITY, level: enums_1.SubjectLevel.UNIVERSITY },
            { name: 'Academic Writing', category: enums_1.SubjectCategory.UNIVERSITY, level: enums_1.SubjectLevel.UNIVERSITY },
            { name: 'Research Skills', category: enums_1.SubjectCategory.UNIVERSITY, level: enums_1.SubjectLevel.UNIVERSITY },
            { name: 'Study Skills', category: enums_1.SubjectCategory.UNIVERSITY, level: enums_1.SubjectLevel.UNIVERSITY },
            { name: 'Exam Preparation', category: enums_1.SubjectCategory.UNIVERSITY, level: enums_1.SubjectLevel.UNIVERSITY },
            { name: 'University Entrance Exams (e.g. UCAT, LNAT)', category: enums_1.SubjectCategory.UNIVERSITY, level: enums_1.SubjectLevel.UNIVERSITY },
            { name: 'Coding / Programming (Python, Java, etc.)', category: enums_1.SubjectCategory.SKILLS, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Web Development', category: enums_1.SubjectCategory.SKILLS, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Graphic Design', category: enums_1.SubjectCategory.SKILLS, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Public Speaking', category: enums_1.SubjectCategory.SKILLS, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Presentation Skills', category: enums_1.SubjectCategory.SKILLS, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Critical Thinking', category: enums_1.SubjectCategory.SKILLS, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Problem Solving', category: enums_1.SubjectCategory.SKILLS, level: enums_1.SubjectLevel.GENERAL },
            { name: 'SEN Support', category: enums_1.SubjectCategory.SPECIAL_SUPPORT, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Dyslexia Support', category: enums_1.SubjectCategory.SPECIAL_SUPPORT, level: enums_1.SubjectLevel.GENERAL },
            { name: 'ADHD Learning Support', category: enums_1.SubjectCategory.SPECIAL_SUPPORT, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Catch-up Learning', category: enums_1.SubjectCategory.SPECIAL_SUPPORT, level: enums_1.SubjectLevel.GENERAL },
            { name: 'Confidence Building', category: enums_1.SubjectCategory.SPECIAL_SUPPORT, level: enums_1.SubjectLevel.GENERAL },
        ];
        await this.subjectRepository.save(subjectsToSeed);
        console.log('Successfully seeded subjects');
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map