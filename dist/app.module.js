"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const tutor_profiles_module_1 = require("./tutor-profiles/tutor-profiles.module");
const parent_profiles_module_1 = require("./parent-profiles/parent-profiles.module");
const student_profiles_module_1 = require("./student-profiles/student-profiles.module");
const auth_module_1 = require("./auth/auth.module");
const subjects_module_1 = require("./subjects/subjects.module");
const uploads_module_1 = require("./uploads/uploads.module");
const messages_module_1 = require("./messages/messages.module");
const mail_module_1 = require("./mail/mail.module");
const contact_module_1 = require("./contact/contact.module");
const bookings_module_1 = require("./bookings/bookings.module");
const availability_module_1 = require("./availability/availability.module");
const resources_module_1 = require("./resources/resources.module");
const reminders_module_1 = require("./reminders/reminders.module");
const stripe_module_1 = require("./integrations/stripe/stripe.module");
const user_entity_1 = require("./users/entities/user.entity");
const tutor_profile_entity_1 = require("./tutor-profiles/entities/tutor-profile.entity");
const parent_profile_entity_1 = require("./parent-profiles/entities/parent-profile.entity");
const student_profile_entity_1 = require("./student-profiles/entities/student-profile.entity");
const subject_entity_1 = require("./subjects/entities/subject.entity");
const booking_entity_1 = require("./bookings/entities/booking.entity");
const availability_entity_1 = require("./availability/entities/availability.entity");
const resource_entity_1 = require("./resources/entities/resource.entity");
const category_entity_1 = require("./resources/entities/category.entity");
const resource_purchase_entity_1 = require("./resources/entities/resource-purchase.entity");
const resource_review_entity_1 = require("./resources/entities/resource-review.entity");
const message_entity_1 = require("./messages/entities/message.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('POSTGRES_HOST'),
                    port: configService.get('POSTGRES_PORT'),
                    username: configService.get('POSTGRES_USER'),
                    password: configService.get('POSTGRES_PASSWORD'),
                    database: configService.get('POSTGRES_DB'),
                    entities: [
                        user_entity_1.User,
                        tutor_profile_entity_1.TutorProfile,
                        parent_profile_entity_1.ParentProfile,
                        student_profile_entity_1.StudentProfile,
                        subject_entity_1.Subject,
                        booking_entity_1.Booking,
                        availability_entity_1.Availability,
                        resource_entity_1.Resource,
                        category_entity_1.Category,
                        resource_purchase_entity_1.ResourcePurchase,
                        resource_review_entity_1.ResourceReview,
                        message_entity_1.Message,
                    ],
                    synchronize: false,
                    logging: true,
                }),
            }),
            users_module_1.UsersModule,
            tutor_profiles_module_1.TutorProfilesModule,
            parent_profiles_module_1.ParentProfilesModule,
            student_profiles_module_1.StudentProfilesModule,
            auth_module_1.AuthModule,
            subjects_module_1.SubjectsModule,
            uploads_module_1.UploadsModule,
            messages_module_1.MessagesModule,
            mail_module_1.MailModule,
            contact_module_1.ContactModule,
            bookings_module_1.BookingsModule,
            availability_module_1.AvailabilityModule,
            resources_module_1.ResourcesModule,
            reminders_module_1.RemindersModule,
            stripe_module_1.StripeModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map