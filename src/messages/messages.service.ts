import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(senderId: string, receiverId: string, content: string, attachmentUrl?: string) {
    const message = this.messageRepository.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      attachment_url: attachmentUrl,
    });
    return await this.messageRepository.save(message);
  }

  async findAllBetweenUsers(userId1: string, userId2: string) {
    return await this.messageRepository.find({
      where: [
        { sender_id: userId1, receiver_id: userId2 },
        { sender_id: userId2, receiver_id: userId1 },
      ],
      order: { created_at: 'ASC' },
    });
  }

  async findRecentConversations(userId: string) {
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
    
    // Sort by latest message
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Fetch user details for each conversation
    const conversations = await Promise.all(results.map(async (res) => {
      const otherUser = await this.messageRepository.manager.getRepository('User').findOne({
        where: { id: res.other_user_id },
        select: ['id', 'email', 'avatar_url'], // Assuming User entity has these
      });
      
      // Try to find the profile name
      let full_name = 'User';
      const tutorProfile = await this.messageRepository.manager.getRepository('TutorProfile').findOne({ where: { user_id: res.other_user_id } });
      const parentProfile = await this.messageRepository.manager.getRepository('ParentProfile').findOne({ where: { user_id: res.other_user_id } });
      const studentProfile = await this.messageRepository.manager.getRepository('StudentProfile').findOne({ where: { user_id: res.other_user_id } });
      
      if (tutorProfile) full_name = tutorProfile.full_name;
      else if (parentProfile) full_name = parentProfile.full_name;
      else if (studentProfile) full_name = studentProfile.full_name;

      return {
        otherUser: {
          id: res.other_user_id,
          full_name,
          avatar_url: otherUser?.avatar_url,
          online: false, // In a real app, track this in Redis/Memory
        },
        lastMessage: {
          id: res.id,
          content: res.content,
          created_at: res.created_at,
          sender_id: userId === res.sender_id ? userId : res.other_user_id,
          receiver_id: userId === res.sender_id ? res.other_user_id : userId,
        },
        unreadCount: 0, // Implement unread logic later
      };
    }));

    return conversations;
  }

  async hasAlreadyMessaged(userId1: string, userId2: string): Promise<boolean> {
    const count = await this.messageRepository.count({
      where: [
        { sender_id: userId1, receiver_id: userId2 },
        { sender_id: userId2, receiver_id: userId1 },
      ],
    });
    return count > 0;
  }
}
