import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
export declare class MessagesService {
    private readonly messageRepository;
    constructor(messageRepository: Repository<Message>);
    create(senderId: string, receiverId: string, content: string, attachmentUrl?: string): Promise<Message>;
    findAllBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
    findRecentConversations(userId: string): Promise<any[]>;
    hasAlreadyMessaged(userId1: string, userId2: string): Promise<boolean>;
}
