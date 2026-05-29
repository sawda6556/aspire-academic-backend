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
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const messages_service_1 = require("./messages.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const send_message_dto_1 = require("./dto/send-message.dto");
const bookings_service_1 = require("../bookings/bookings.service");
const users_service_1 = require("../users/users.service");
const enums_1 = require("../common/enums");
let MessagesGateway = class MessagesGateway {
    messagesService;
    jwtService;
    bookingsService;
    usersService;
    server;
    connectedUsers = new Map();
    constructor(messagesService, jwtService, bookingsService, usersService) {
        this.messagesService = messagesService;
        this.jwtService = jwtService;
        this.bookingsService = bookingsService;
        this.usersService = usersService;
    }
    async handleConnection(client) {
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
        }
        catch (e) {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedUsers.delete(client.id);
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleMessage(client, data) {
        const senderId = this.connectedUsers.get(client.id);
        if (!senderId)
            throw new websockets_1.WsException('Unauthorized');
        const hasHistory = await this.messagesService.hasAlreadyMessaged(senderId, data.receiverId);
        const hasBooking = await this.bookingsService.hasRelationship(senderId, data.receiverId);
        let canMessage = hasHistory || hasBooking;
        if (!canMessage) {
            const sender = await this.usersService.findOne(senderId);
            const receiver = await this.usersService.findOne(data.receiverId);
            if (sender && receiver) {
                const isSenderAuthorizedToInquire = sender.user_type === enums_1.UserType.STUDENT || sender.user_type === enums_1.UserType.PARENT;
                const isReceiverTutor = receiver.user_type === enums_1.UserType.TUTOR;
                if (isSenderAuthorizedToInquire && isReceiverTutor) {
                    canMessage = true;
                }
            }
        }
        if (!canMessage) {
            throw new websockets_1.WsException('You can only message users you have a booking with or tutors you are inquiring with.');
        }
        const message = await this.messagesService.create(senderId, data.receiverId, data.content, data.attachmentUrl);
        this.server.to(data.receiverId).emit('newMessage', message);
        return message;
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMessage", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        jwt_1.JwtService,
        bookings_service_1.BookingsService,
        users_service_1.UsersService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map