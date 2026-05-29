import { SubjectsService } from './subjects.service';
import { SubjectCategory } from '../common/enums';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    findAll(category?: SubjectCategory): Promise<import("./entities/subject.entity").Subject[]>;
}
