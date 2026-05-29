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
exports.AvailabilityController = void 0;
const common_1 = require("@nestjs/common");
const availability_service_1 = require("./availability.service");
const create_availability_dto_1 = require("./dto/create-availability.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const enums_1 = require("../common/enums");
const typeorm_1 = require("@nestjs/typeorm");
const tutor_profile_entity_1 = require("../tutor-profiles/entities/tutor-profile.entity");
const typeorm_2 = require("typeorm");
let AvailabilityController = class AvailabilityController {
    availabilityService;
    tutorProfileRepository;
    constructor(availabilityService, tutorProfileRepository) {
        this.availabilityService = availabilityService;
        this.tutorProfileRepository = tutorProfileRepository;
    }
    async create(req, dto) {
        if (req.user.user_type !== enums_1.UserType.TUTOR) {
            throw new common_1.ForbiddenException('Only tutors can set availability');
        }
        const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
        if (!tutorProfile) {
            throw new common_1.ForbiddenException('Tutor profile not found');
        }
        return this.availabilityService.create(tutorProfile.id, dto);
    }
    async findAll(tutorId) {
        return this.availabilityService.findAllByTutor(tutorId);
    }
    async remove(req, id) {
        if (req.user.user_type !== enums_1.UserType.TUTOR) {
            throw new common_1.ForbiddenException('Only tutors can remove availability');
        }
        const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
        if (!tutorProfile) {
            throw new common_1.ForbiddenException('Tutor profile not found');
        }
        return this.availabilityService.remove(id, tutorProfile.id);
    }
};
exports.AvailabilityController = AvailabilityController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_availability_dto_1.CreateAvailabilityDto]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('tutor/:tutorId'),
    __param(0, (0, common_1.Param)('tutorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AvailabilityController.prototype, "remove", null);
exports.AvailabilityController = AvailabilityController = __decorate([
    (0, common_1.Controller)('availability'),
    __param(1, (0, typeorm_1.InjectRepository)(tutor_profile_entity_1.TutorProfile)),
    __metadata("design:paramtypes", [availability_service_1.AvailabilityService,
        typeorm_2.Repository])
], AvailabilityController);
//# sourceMappingURL=availability.controller.js.map