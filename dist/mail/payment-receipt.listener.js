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
exports.PaymentReceiptListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mail_service_1 = require("./mail.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let PaymentReceiptListener = class PaymentReceiptListener {
    mailService;
    usersRepository;
    constructor(mailService, usersRepository) {
        this.mailService = mailService;
        this.usersRepository = usersRepository;
    }
    async handlePaymentSuccess(payload) {
        try {
            const user = await this.usersRepository.findOne({ where: { id: payload.userId } });
            if (!user) {
                console.error(`User ${payload.userId} not found for receipt`);
                return;
            }
            await this.mailService.sendPaymentReceipt(user.email, {
                orderId: payload.orderId,
                amount: payload.amount,
                currency: payload.currency,
                items: payload.items,
                date: payload.date,
            });
        }
        catch (error) {
            console.error('Error handling payment.success event:', error);
        }
    }
};
exports.PaymentReceiptListener = PaymentReceiptListener;
__decorate([
    (0, event_emitter_1.OnEvent)('payment.success'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentReceiptListener.prototype, "handlePaymentSuccess", null);
exports.PaymentReceiptListener = PaymentReceiptListener = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [mail_service_1.MailService,
        typeorm_2.Repository])
], PaymentReceiptListener);
//# sourceMappingURL=payment-receipt.listener.js.map