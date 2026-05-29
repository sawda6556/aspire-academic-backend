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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorProfile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const enums_1 = require("../../common/enums");
const subject_entity_1 = require("../../subjects/entities/subject.entity");
let TutorProfile = class TutorProfile {
    id;
    user;
    user_id;
    full_name;
    country;
    bio;
    hourly_rate;
    subjects;
    languages;
    qualifications;
    experience;
    verification_status;
    dbs_certificate_url;
    dbs_verified_status;
    dbs_certificate_number;
    is_on_update_service;
    dbs_last_checked_at;
    id_document_url;
    cert_document_url;
    address_proof_url;
    verified_at;
    subjects_v2;
};
exports.TutorProfile = TutorProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TutorProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.tutor_profile, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], TutorProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], TutorProfile.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TutorProfile.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TutorProfile.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TutorProfile.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], TutorProfile.prototype, "hourly_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], TutorProfile.prototype, "subjects", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], TutorProfile.prototype, "languages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TutorProfile.prototype, "qualifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TutorProfile.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.VerificationStatus,
        default: enums_1.VerificationStatus.PENDING,
    }),
    __metadata("design:type", String)
], TutorProfile.prototype, "verification_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TutorProfile.prototype, "dbs_certificate_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.DbsStatus,
        default: enums_1.DbsStatus.PENDING,
    }),
    __metadata("design:type", String)
], TutorProfile.prototype, "dbs_verified_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TutorProfile.prototype, "dbs_certificate_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TutorProfile.prototype, "is_on_update_service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TutorProfile.prototype, "dbs_last_checked_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TutorProfile.prototype, "id_document_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TutorProfile.prototype, "cert_document_url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TutorProfile.prototype, "address_proof_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TutorProfile.prototype, "verified_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => subject_entity_1.Subject, (subject) => subject.tutors),
    (0, typeorm_1.JoinTable)({
        name: 'tutor_subjects',
        joinColumn: { name: 'tutor_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'subject_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], TutorProfile.prototype, "subjects_v2", void 0);
exports.TutorProfile = TutorProfile = __decorate([
    (0, typeorm_1.Entity)('tutor_profiles')
], TutorProfile);
//# sourceMappingURL=tutor-profile.entity.js.map