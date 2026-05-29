import { Resource } from './resource.entity';
export declare class Category {
    id: string;
    name: string;
    slug: string;
    icon_url: string;
    created_at: Date;
    resources: Resource[];
}
