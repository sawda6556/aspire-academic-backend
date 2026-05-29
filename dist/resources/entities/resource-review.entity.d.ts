import { User } from '../../users/entities/user.entity';
import { Resource } from './resource.entity';
export declare class ResourceReview {
    id: string;
    resource_id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: Date;
    resource: Resource;
    user: User;
}
