import { User } from '../../users/entities/user.entity';
import { Resource } from './resource.entity';
export declare class ResourcePurchase {
    id: string;
    user_id: string;
    resource_id: string;
    price_at_purchase: number;
    stripe_payment_id: string;
    created_at: Date;
    user: User;
    resource: Resource;
}
