"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationGuard = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../common/enums");
let VerificationGuard = class VerificationGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        if (user.user_type === enums_1.UserType.PARENT) {
            return true;
        }
        let status = enums_1.VerificationStatus.PENDING;
        if (user.user_type === enums_1.UserType.TUTOR) {
            status = user.tutor_profile?.verification_status;
        }
        else if (user.user_type === enums_1.UserType.STUDENT) {
            if (!user.student_profile?.parent_id) {
                status = user.student_profile?.verification_status;
            }
            else {
                return true;
            }
        }
        if (status !== enums_1.VerificationStatus.APPROVED) {
            throw new common_1.ForbiddenException('Your account is not yet approved. Please complete your profile and wait for admin verification.');
        }
        return true;
    }
};
exports.VerificationGuard = VerificationGuard;
exports.VerificationGuard = VerificationGuard = __decorate([
    (0, common_1.Injectable)()
], VerificationGuard);
//# sourceMappingURL=verification.guard.js.map