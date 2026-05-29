import { ResourcesService } from './resources.service';
import { TutorProfile } from '../tutor-profiles/entities/tutor-profile.entity';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    private readonly tutorProfileRepository;
    constructor(resourcesService: ResourcesService, tutorProfileRepository: Repository<TutorProfile>);
    findAll(query: any): Promise<{
        items: import("./entities/resource.entity").Resource[];
        total: number;
        page: any;
        limit: any;
    }>;
    getCategories(): Promise<import("./entities/category.entity").Category[]>;
    getPurchased(req: any): Promise<{
        download_url: string;
        purchased_at: Date;
        id: string;
        tutor_id: string;
        title: string;
        description: string;
        price: number;
        file_url: string;
        preview_url: string;
        category_id: string;
        subjects: string[];
        grade_level: string;
        status: import("../common/enums").ResourceStatus;
        average_rating: number;
        review_count: number;
        created_at: Date;
        updated_at: Date;
        tutor: TutorProfile;
        category: import("./entities/category.entity").Category;
        reviews: import("./entities/resource-review.entity").ResourceReview[];
    }[]>;
    findOne(id: string): Promise<import("./entities/resource.entity").Resource>;
    buy(req: any, id: string, paymentMethodId: string): Promise<import("./entities/resource-purchase.entity").ResourcePurchase>;
    addReview(req: any, id: string, reviewData: {
        rating: number;
        comment: string;
    }): Promise<import("./entities/resource-review.entity").ResourceReview>;
    create(req: any, dto: CreateResourceDto): Promise<import("./entities/resource.entity").Resource>;
    update(req: any, id: string, dto: UpdateResourceDto): Promise<import("./entities/resource.entity").Resource>;
    getTutorResources(req: any): Promise<import("./entities/resource.entity").Resource[]>;
}
