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
exports.StudentProfilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_profile_entity_1 = require("./entities/student-profile.entity");
const enums_1 = require("../common/enums");
let StudentProfilesService = class StudentProfilesService {
    studentProfilesRepository;
    constructor(studentProfilesRepository) {
        this.studentProfilesRepository = studentProfilesRepository;
    }
    async findByUserId(userId) {
        const profile = await this.studentProfilesRepository.findOne({ where: { user_id: userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        return profile;
    }
    async submitForVerification(userId, idUrl) {
        const profile = await this.findByUserId(userId);
        profile.id_document_url = idUrl;
        profile.verification_status = enums_1.VerificationStatus.PENDING;
        return this.studentProfilesRepository.save(profile);
    }
    async adminReview(profileId, status) {
        const profile = await this.studentProfilesRepository.findOne({ where: { id: profileId } });
        if (!profile) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        profile.verification_status = status;
        if (status === enums_1.VerificationStatus.APPROVED) {
            profile.verified_at = new Date();
        }
        return this.studentProfilesRepository.save(profile);
    }
    async findOne(id) {
        const profile = await this.studentProfilesRepository.findOne({ where: { id } });
        if (!profile) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        return profile;
    }
    async findAll() {
        return this.studentProfilesRepository.find();
    }
};
exports.StudentProfilesService = StudentProfilesService;
exports.StudentProfilesService = StudentProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_profile_entity_1.StudentProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudentProfilesService);
//# sourceMappingURL=student-profiles.service.js.map