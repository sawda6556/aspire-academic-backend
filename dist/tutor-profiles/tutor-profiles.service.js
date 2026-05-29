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
exports.TutorProfilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tutor_profile_entity_1 = require("./entities/tutor-profile.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
const enums_1 = require("../common/enums");
let TutorProfilesService = class TutorProfilesService {
    tutorProfilesRepository;
    constructor(tutorProfilesRepository) {
        this.tutorProfilesRepository = tutorProfilesRepository;
    }
    async findByUserId(userId) {
        const profile = await this.tutorProfilesRepository.findOne({
            where: { user_id: userId },
            relations: ['subjects_v2']
        });
        if (!profile) {
            throw new common_1.NotFoundException('Tutor profile not found');
        }
        return profile;
    }
    async update(userId, updateDto) {
        const profile = await this.findByUserId(userId);
        const { subject_ids, ...rest } = updateDto;
        Object.assign(profile, rest);
        if (subject_ids && Array.isArray(subject_ids)) {
            const subjects = await this.tutorProfilesRepository.manager.find(subject_entity_1.Subject, {
                where: subject_ids.map(id => ({ id }))
            });
            profile.subjects_v2 = subjects;
        }
        return this.tutorProfilesRepository.save(profile);
    }
    async submitForVerification(userId, idUrl, certUrl, addressUrl) {
        const profile = await this.findByUserId(userId);
        profile.id_document_url = idUrl;
        profile.cert_document_url = certUrl;
        profile.address_proof_url = addressUrl;
        profile.verification_status = enums_1.VerificationStatus.PENDING;
        return this.tutorProfilesRepository.save(profile);
    }
    async adminReview(profileId, status) {
        const profile = await this.tutorProfilesRepository.findOne({ where: { id: profileId } });
        if (!profile) {
            throw new common_1.NotFoundException('Tutor profile not found');
        }
        profile.verification_status = status;
        if (status === enums_1.VerificationStatus.APPROVED) {
            profile.verified_at = new Date();
        }
        return this.tutorProfilesRepository.save(profile);
    }
    async adminReviewDbs(profileId, status) {
        const profile = await this.tutorProfilesRepository.findOne({ where: { id: profileId } });
        if (!profile) {
            throw new common_1.NotFoundException('Tutor profile not found');
        }
        profile.dbs_verified_status = status;
        if (status === enums_1.DbsStatus.VERIFIED) {
            profile.dbs_last_checked_at = new Date();
        }
        return this.tutorProfilesRepository.save(profile);
    }
    async findOne(id) {
        const profile = await this.tutorProfilesRepository.findOne({
            where: { id },
            relations: ['subjects_v2']
        });
        if (!profile) {
            throw new common_1.NotFoundException('Tutor profile not found');
        }
        return profile;
    }
    async findActiveTutors() {
        return this.tutorProfilesRepository.find({
            where: { verification_status: enums_1.VerificationStatus.APPROVED },
            relations: ['subjects_v2']
        });
    }
    async findAll() {
        return this.tutorProfilesRepository.find({
            relations: ['subjects_v2']
        });
    }
};
exports.TutorProfilesService = TutorProfilesService;
exports.TutorProfilesService = TutorProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tutor_profile_entity_1.TutorProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TutorProfilesService);
//# sourceMappingURL=tutor-profiles.service.js.map