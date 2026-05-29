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
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const resources_service_1 = require("./resources.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const enums_1 = require("../common/enums");
const typeorm_1 = require("@nestjs/typeorm");
const tutor_profile_entity_1 = require("../tutor-profiles/entities/tutor-profile.entity");
const typeorm_2 = require("typeorm");
const create_resource_dto_1 = require("./dto/create-resource.dto");
const update_resource_dto_1 = require("./dto/update-resource.dto");
let ResourcesController = class ResourcesController {
    resourcesService;
    tutorProfileRepository;
    constructor(resourcesService, tutorProfileRepository) {
        this.resourcesService = resourcesService;
        this.tutorProfileRepository = tutorProfileRepository;
    }
    async findAll(query) {
        return this.resourcesService.findAll(query);
    }
    async getCategories() {
        return this.resourcesService.findAllCategories();
    }
    async getPurchased(req) {
        return this.resourcesService.findPurchased(req.user.id);
    }
    async findOne(id) {
        return this.resourcesService.findOne(id);
    }
    async buy(req, id, paymentMethodId) {
        return this.resourcesService.purchase(req.user.id, id, paymentMethodId);
    }
    async addReview(req, id, reviewData) {
        return this.resourcesService.addReview(req.user.id, id, reviewData.rating, reviewData.comment);
    }
    async create(req, dto) {
        const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
        if (!tutorProfile) {
            throw new common_1.ForbiddenException('Tutor profile not found');
        }
        return this.resourcesService.create(tutorProfile.id, dto);
    }
    async update(req, id, dto) {
        const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
        if (!tutorProfile) {
            throw new common_1.ForbiddenException('Tutor profile not found');
        }
        return this.resourcesService.update(id, tutorProfile.id, dto);
    }
    async getTutorResources(req) {
        const tutorProfile = await this.tutorProfileRepository.findOne({ where: { user_id: req.user.id } });
        if (!tutorProfile) {
            throw new common_1.ForbiddenException('Tutor profile not found');
        }
        return this.resourcesService.findTutorResources(tutorProfile.id);
    }
};
exports.ResourcesController = ResourcesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('purchased'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getPurchased", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/buy'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('payment_method_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "buy", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/reviews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "addReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserType.TUTOR),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_resource_dto_1.CreateResourceDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserType.TUTOR),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_resource_dto_1.UpdateResourceDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserType.TUTOR),
    (0, common_1.Get)('tutor/my-resources'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getTutorResources", null);
exports.ResourcesController = ResourcesController = __decorate([
    (0, common_1.Controller)('resources'),
    __param(1, (0, typeorm_1.InjectRepository)(tutor_profile_entity_1.TutorProfile)),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService,
        typeorm_2.Repository])
], ResourcesController);
//# sourceMappingURL=resources.controller.js.map