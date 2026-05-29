"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
const tutor_profile_entity_1 = require("../tutor-profiles/entities/tutor-profile.entity");
const parent_profile_entity_1 = require("../parent-profiles/entities/parent-profile.entity");
const student_profile_entity_1 = require("../student-profiles/entities/student-profile.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
const enums_1 = require("../common/enums");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    dataSource;
    mailService;
    constructor(usersRepository, jwtService, dataSource, mailService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.dataSource = dataSource;
        this.mailService = mailService;
    }
    async register(registerDto) {
        const { email, password, user_type, gender, full_name, parent_id, profile_data } = registerDto;
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatar_url = this.getAvatarUrl(gender);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = queryRunner.manager.create(user_entity_1.User, {
                email,
                password_hash: hashedPassword,
                user_type,
                gender,
                avatar_url,
            });
            const savedUser = await queryRunner.manager.save(user);
            if (user_type === enums_1.UserType.TUTOR) {
                if (!profile_data?.id_document_url || !profile_data?.address_proof_url) {
                    throw new common_1.BadRequestException('ID document and address proof are mandatory for tutors');
                }
                let subjectsV2 = [];
                if (profile_data?.subjects && Array.isArray(profile_data.subjects)) {
                    subjectsV2 = await queryRunner.manager.find(subject_entity_1.Subject, {
                        where: profile_data.subjects.map(id => ({ id }))
                    });
                }
                const tutorProfile = queryRunner.manager.create(tutor_profile_entity_1.TutorProfile, {
                    user_id: savedUser.id,
                    full_name,
                    country: profile_data?.country,
                    subjects: profile_data?.subjects,
                    subjects_v2: subjectsV2,
                    qualifications: profile_data?.qualifications,
                    bio: profile_data?.bio,
                    id_document_url: profile_data?.id_document_url,
                    address_proof_url: profile_data?.address_proof_url,
                    cert_document_url: profile_data?.cert_document_url,
                    dbs_certificate_url: profile_data?.dbs_certificate_url,
                    dbs_certificate_number: profile_data?.dbs_certificate_number,
                    is_on_update_service: profile_data?.is_on_update_service || false,
                });
                await queryRunner.manager.save(tutorProfile);
            }
            else if (user_type === enums_1.UserType.PARENT) {
                const parentProfile = queryRunner.manager.create(parent_profile_entity_1.ParentProfile, {
                    user_id: savedUser.id,
                    full_name,
                });
                await queryRunner.manager.save(parentProfile);
            }
            else if (user_type === enums_1.UserType.STUDENT) {
                if (!parent_id && !profile_data?.id_document_url) {
                    throw new common_1.BadRequestException('ID document is mandatory for independent students (18+)');
                }
                const studentProfile = queryRunner.manager.create(student_profile_entity_1.StudentProfile, {
                    user_id: savedUser.id,
                    full_name,
                    parent_id,
                    id_document_url: profile_data?.id_document_url,
                });
                await queryRunner.manager.save(studentProfile);
            }
            await queryRunner.commitTransaction();
            this.mailService.notifyAdminOnRegistration(savedUser, profile_data);
            const { password_hash, ...result } = savedUser;
            return result;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password_hash', 'user_type'],
        });
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.user_type };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    getAvatarUrl(gender) {
        if (gender === enums_1.Gender.FEMALE) {
            return '/assets/avatars/female-avatar-hijab.png';
        }
        return '/assets/avatars/male-avatar.svg';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.DataSource,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map