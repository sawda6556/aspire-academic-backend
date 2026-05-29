import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getHistory(req: any, otherUserId: string): Promise<import("./entities/message.entity").Message[]>;
    getConversations(req: any): Promise<any[]>;
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        name: string;
        size: number;
    }>;
}
