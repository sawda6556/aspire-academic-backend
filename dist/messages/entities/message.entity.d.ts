import { User } from '../../users/entities/user.entity';
export declare class Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    attachment_url: string;
    created_at: Date;
    sender: User;
    receiver: User;
}
