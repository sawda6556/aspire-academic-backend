import { TutorProfile } from '../../tutor-profiles/entities/tutor-profile.entity';
import { Category } from './category.entity';
import { ResourceStatus } from '../../common/enums';
import { ResourceReview } from './resource-review.entity';
export declare class Resource {
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
    status: ResourceStatus;
    average_rating: number;
    review_count: number;
    created_at: Date;
    updated_at: Date;
    tutor: TutorProfile;
    category: Category;
    reviews: ResourceReview[];
}
