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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const availability_entity_1 = require("./entities/availability.entity");
let AvailabilityService = class AvailabilityService {
    availabilityRepository;
    constructor(availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }
    async create(tutorId, dto) {
        const availability = this.availabilityRepository.create({
            tutor_id: tutorId,
            ...dto,
        });
        return await this.availabilityRepository.save(availability);
    }
    async findAllByTutor(tutorId) {
        return await this.availabilityRepository.find({
            where: { tutor_id: tutorId },
            order: { day_of_week: 'ASC', start_time: 'ASC' },
        });
    }
    async remove(id, tutorId) {
        const availability = await this.availabilityRepository.findOne({
            where: { id, tutor_id: tutorId },
        });
        if (!availability) {
            throw new common_1.NotFoundException('Availability not found');
        }
        return await this.availabilityRepository.remove(availability);
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(availability_entity_1.Availability)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map