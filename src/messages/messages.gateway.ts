import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { JwtService } from '@nestjs/jwt';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { BookingsService } from '../bookings/bookings.service';
import { UsersService } from '../users/users.service';
import { UserType } from '../common/enums';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, string> = new Map(); // socketId -> userId

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
    private readonly bookingsService: BookingsService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      });
      
      this.connectedUsers.set(client.id, payload.sub);
      client.join(payload.sub);
      console.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ) {
    const senderId = this.connectedUsers.get(client.id);
    if (!senderId) throw new WsException('Unauthorized');

    // Security check: Verify professional relationship
    const hasHistory = await this.messagesService.hasAlreadyMessaged(senderId, data.receiverId);
    const hasBooking = await this.bookingsService.hasRelationship(senderId, data.receiverId);
    
    let canMessage = hasHistory || hasBooking;

    if (!canMessage) {
      // Allow if Student/Parent messages a Tutor (creating an inquiry)
      const sender = await this.usersService.findOne(senderId);
      const receiver = await this.usersService.findOne(data.receiverId);

      if (sender && receiver) {
        const isSenderAuthorizedToInquire = sender.user_type === UserType.STUDENT || sender.user_type === UserType.PARENT;
        const isReceiverTutor = receiver.user_type === UserType.TUTOR;
        
        if (isSenderAuthorizedToInquire && isReceiverTutor) {
          canMessage = true;
        }
      }
    }

    if (!canMessage) {
      throw new WsException('You can only message users you have a booking with or tutors you are inquiring with.');
    }
    
    const message = await this.messagesService.create(
      senderId,
      data.receiverId,
      data.content,
      data.attachmentUrl,
    );

    // Emit to receiver's room
    this.server.to(data.receiverId).emit('newMessage', message);
    
    // Emit back to sender
    return message;
  }
}
