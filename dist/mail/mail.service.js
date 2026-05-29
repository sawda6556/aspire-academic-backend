"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = class MailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get('MAIL_PORT'),
            secure: this.configService.get('MAIL_SECURE', false),
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }
    async sendMail(to, subject, text, attachments) {
        try {
            await this.transporter.sendMail({
                from: this.configService.get('MAIL_FROM', '"Aspire Academic Co." <noreply@aspireacademic.com>'),
                to,
                subject,
                text,
                attachments,
            });
        }
        catch (error) {
            console.error('Failed to send email:', error);
        }
    }
    async notifyAdminOnRegistration(user, profile) {
        const adminEmail = 'carakay68@gmail.com';
        const subject = `New ${user.user_type} Registration: ${user.full_name || user.email}`;
        const text = `
      A new user has registered on Aspire Academic Co.
      
      User Details:
      - Email: ${user.email}
      - Type: ${user.user_type}
      - Name: ${user.full_name}
      - Gender: ${user.gender}
      
      Profile Details:
      ${JSON.stringify(profile, null, 2)}
      
      Legal Agreements:
      - The user has signed all required legal agreements during the onboarding process.
    `;
        await this.sendMail(adminEmail, subject, text);
    }
    async notifyAdminOnVerificationUpload(user, documentUrls) {
        const adminEmail = 'carakay68@gmail.com';
        const subject = `Verification Documents Uploaded: ${user.email}`;
        const text = `
      User ${user.email} has uploaded new verification documents.
      
      Document URLs:
      ${documentUrls.map(url => `- ${url}`).join('\n')}
      
      Please review these documents in the admin dashboard.
    `;
        await this.sendMail(adminEmail, subject, text);
    }
    async sendPaymentReceipt(to, details) {
        const subject = `Receipt for your purchase at Aspire Academic Co. - ${details.orderId}`;
        const text = `
      Thank you for your purchase!
      
      Order Details:
      - Order ID: ${details.orderId}
      - Date: ${details.date.toLocaleDateString()}
      - Total: ${details.amount} ${details.currency.toUpperCase()}
      
      Items:
      ${details.items.map(item => `- ${item}`).join('\n')}
      
      If you have any questions, please contact our support at info@aspireacademicco.co.uk.
      
      Best regards,
      The Aspire Academic Co. Team
    `;
        await this.sendMail(to, subject, text);
    }
    async sendDirectEmail(to, subject, message) {
        const text = `
      ${message}
      
      ---
      This email was sent to you by the administration of Aspire Academic Co.
      If you have any questions, please contact our support at info@aspireacademicco.co.uk.
    `;
        await this.sendMail(to, subject, text);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map