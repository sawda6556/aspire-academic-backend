import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { SubjectCategory } from '../common/enums';
export declare class SubjectsService implements OnModuleInit {
    private readonly subjectRepository;
    constructor(subjectRepository: Repository<Subject>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<Subject[]>;
    findByCategory(category: SubjectCategory): Promise<Subject[]>;
    private seedSubjects;
}
