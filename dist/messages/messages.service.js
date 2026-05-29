"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
let MessagesService = class MessagesService {
    messageRepository;
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async create(senderId, receiverId, content, attachmentUrl) {
        const message = this.messageRepository.create({
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            attachment_url: attachmentUrl,
        });
        return await this.messageRepository.save(message);
    }
    async findAllBetweenUsers(userId1, userId2) {
        return await this.messageRepository.find({
            where: [
                { sender_id: userId1, receiver_id: userId2 },
                { sender_id: userId2, receiver_id: userId1 },
            ],
            order: { created_at: 'ASC' },
        });
    }
    async findRecentConversations(userId) {
        const query = `
      SELECT DISTINCT ON (other_user_id)
        CASE 
          when sender_id = $1 then receiver_id 
          else sender_id 
        END as other_user_id,
        content,
        created_at,
        id
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
      ORDER BY other_user_id, created_at DESC
    `;
        const results = await this.messageRepository.query(query, [userId]);
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const conversations = await Promise.all(results.map(async (res) => {
            const otherUser = await this.messageRepository.manager.getRepository('User').findOne({
                where: { id: res.other_user_id },
                select: ['id', 'email', 'avatar_url'],
            });
            let full_name = 'User';
            const tutorProfile = await this.messageRepository.manager.getRepository('TutorProfile').findOne({ where: { user_id: res.other_user_id } });
            const parentProfile = await this.messageRepository.manager.getRepository('ParentProfile').findOne({ where: { user_id: res.other_user_id } });
            const studentProfile = await this.messageRepository.manager.getRepository('StudentProfile').findOne({ where: { user_id: res.other_user_id } });
            if (tutorProfile)
                full_name = tutorProfile.full_name;
            else if (parentProfile)
                full_name = parentProfile.full_name;
            else if (studentProfile)
                full_name = studentProfile.full_name;
            return {
                otherUser: {
                    id: res.other_user_id,
                    full_name,
                    avatar_url: otherUser?.avatar_url,
                    online: false,
                },
                lastMessage: {
                    id: res.id,
                    content: res.content,
                    created_at: res.created_at,
                    sender_id: userId === res.sender_id ? userId : res.other_user_id,
                    receiver_id: userId === res.sender_id ? res.other_user_id : userId,
                },
                unreadCount: 0,
            };
        }));
        return conversations;
    }
    async hasAlreadyMessaged(userId1, userId2) {
        const count = await this.messageRepository.count({
            where: [
                { sender_id: userId1, receiver_id: userId2 },
                { sender_id: userId2, receiver_id: userId1 },
            ],
        });
        return count > 0;
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map