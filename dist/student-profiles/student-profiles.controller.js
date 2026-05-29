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
exports.StudentProfilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const student_profiles_service_1 = require("./student-profiles.service");
const mail_service_1 = require("../mail/mail.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const enums_1 = require("../common/enums");
const multer_1 = require("multer");
const path_1 = require("path");
let StudentProfilesController = class StudentProfilesController {
    studentProfilesService;
    mailService;
    constructor(studentProfilesService, mailService) {
        this.studentProfilesService = studentProfilesService;
        this.mailService = mailService;
    }
    async getAll() {
        return this.studentProfilesService.findAll();
    }
    async getMyProfile(req) {
        return this.studentProfilesService.findByUserId(req.user.id);
    }
    async submitVerification(req, files) {
        const idUrl = files.id_document ? `/uploads/verification/${files.id_document[0].filename}` : '';
        const result = await this.studentProfilesService.submitForVerification(req.user.id, idUrl);
        if (idUrl) {
            this.mailService.notifyAdminOnVerificationUpload(req.user, [idUrl]);
        }
        return result;
    }
    async adminReview(id, status) {
        return this.studentProfilesService.adminReview(id, status);
    }
};
exports.StudentProfilesController = StudentProfilesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentProfilesController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentProfilesController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('verify'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'id_document', maxCount: 1 },
    ], {
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
], StudentProfilesController.prototype, "submitVerification", null);
__decorate([
    (0, common_1.Post)('admin/review/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StudentProfilesController.prototype, "adminReview", null);
exports.StudentProfilesController = StudentProfilesController = __decorate([
    (0, common_1.Controller)('student-profiles'),
    __metadata("design:paramtypes", [student_profiles_service_1.StudentProfilesService,
        mail_service_1.MailService])
], StudentProfilesController);
//# sourceMappingURL=student-profiles.controller.js.map