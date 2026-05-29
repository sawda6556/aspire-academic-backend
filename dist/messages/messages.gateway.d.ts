import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { JwtService } from '@nestjs/jwt';
import { SendMessageDto } from './dto/send-message.dto';
import { BookingsService } from '../bookings/bookings.service';
import { UsersService } from '../users/users.service';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    private readonly jwtService;
    private readonly bookingsService;
    private readonly usersService;
    server: Server;
    private connectedUsers;
    constructor(messagesService: MessagesService, jwtService: JwtService, bookingsService: BookingsService, usersService: UsersService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, data: SendMessageDto): Promise<import("./entities/message.entity").Message>;
}
