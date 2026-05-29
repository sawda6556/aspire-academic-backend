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
exports.TutorProfilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const tutor_profiles_service_1 = require("./tutor-profiles.service");
const mail_service_1 = require("../mail/mail.service");
const update_tutor_profile_dto_1 = require("./dto/update-tutor-profile.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const verification_guard_1 = require("../auth/guards/verification.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const enums_1 = require("../common/enums");
const multer_1 = require("multer");
const path_1 = require("path");
let TutorProfilesController = class TutorProfilesController {
    tutorProfilesService;
    mailService;
    constructor(tutorProfilesService, mailService) {
        this.tutorProfilesService = tutorProfilesService;
        this.mailService = mailService;
    }
    async getMarketplace() {
        return this.tutorProfilesService.findActiveTutors();
    }
    async getAll() {
        return this.tutorProfilesService.findAll();
    }
    async getMyProfile(req) {
        return this.tutorProfilesService.findByUserId(req.user.id);
    }
    async updateMyProfile(req, updateDto) {
        return this.tutorProfilesService.update(req.user.id, updateDto);
    }
    async submitVerification(req, files) {
        const idUrl = files.id_document
            ? `/uploads/verification/${files.id_document[0].filename}`
            : '';
        const certUrl = files.cert_document
            ? `/uploads/verification/${files.cert_document[0].filename}`
            : '';
        const addressUrl = files.address_proof
            ? `/uploads/verification/${files.address_proof[0].filename}`
            : '';
        const result = await this.tutorProfilesService.submitForVerification(req.user.id, idUrl, certUrl, addressUrl);
        const documentUrls = [];
        if (idUrl)
            documentUrls.push(idUrl);
        if (certUrl)
            documentUrls.push(certUrl);
        if (addressUrl)
            documentUrls.push(addressUrl);
        if (documentUrls.length > 0) {
            this.mailService.notifyAdminOnVerificationUpload(req.user, documentUrls);
        }
        return result;
    }
    async getProfile(id) {
        return this.tutorProfilesService.findOne(id);
    }
    async adminReview(id, status) {
        return this.tutorProfilesService.adminReview(id, status);
    }
    async adminReviewDbs(id, status) {
        return this.tutorProfilesService.adminReviewDbs(id, status);
    }
};
exports.TutorProfilesController = TutorProfilesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, verification_guard_1.VerificationGuard),
    (0, common_1.Get)('marketplace'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TutorProfilesController.prototype, "getMarketplace", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TutorProfilesController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserType.TUTOR),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TutorProfilesController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserType.TUTOR),
    (0, common_1.Put)('me'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_tutor_profile_dto_1.UpdateTutorProfileDto]),
    __metadata("design:returntype", Promise)
], TutorProfilesController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserType.TUTOR),
    (0, common_1.Post)('verify'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'id_document', maxCount: 1 },
        { name: 'cert_document', maxCount: 1 },
        { name: 'address_proof', maxCount: 1 },
    ], {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                return cb(new common_1.BadRequestException('Only images and PDFs are allowed'), false);
            }
            cb(null, true);
        },
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/verification',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TutorProfilesController.prototype, "submitVerification", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, verification_guard_1.VerificationGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TutorProfilesController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)('admin/review/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TutorProfilesController.prototype, "adminReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)('admin/review-dbs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TutorProfilesController.prototype, "adminReviewDbs", null);
exports.TutorProfilesController = TutorProfilesController = __decorate([
    (0, common_1.Controller)('tutor-profiles'),
    __metadata("design:paramtypes", [tutor_profiles_service_1.TutorProfilesService,
        mail_service_1.MailService])
], TutorProfilesController);
//# sourceMappingURL=tutor-profiles.controller.js.map