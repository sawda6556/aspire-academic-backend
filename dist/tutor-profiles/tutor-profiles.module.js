"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tutor_profiles_controller_1 = require("./tutor-profiles.controller");
const tutor_profiles_service_1 = require("./tutor-profiles.service");
const tutor_profile_entity_1 = require("./entities/tutor-profile.entity");
const mail_module_1 = require("../mail/mail.module");
let TutorProfilesModule = class TutorProfilesModule {
};
exports.TutorProfilesModule = TutorProfilesModule;
exports.TutorProfilesModule = TutorProfilesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tutor_profile_entity_1.TutorProfile]), mail_module_1.MailModule],
        controllers: [tutor_profiles_controller_1.TutorProfilesController],
        providers: [tutor_profiles_service_1.TutorProfilesService],
        exports: [tutor_profiles_service_1.TutorProfilesService],
    })
], TutorProfilesModule);
//# sourceMappingURL=tutor-profiles.module.js.map