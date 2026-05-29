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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const user_entity_1 = require("../users/entities/user.entity");
const tutor_profile_entity_1 = require("../tutor-profiles/entities/tutor-profile.entity");
const parent_profile_entity_1 = require("../parent-profiles/entities/parent-profile.entity");
const student_profile_entity_1 = require("../student-profiles/entities/student-profile.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const availability_entity_1 = require("../availability/entities/availability.entity");
const resource_entity_1 = require("../resources/entities/resource.entity");
const category_entity_1 = require("../resources/entities/category.entity");
const resource_purchase_entity_1 = require("../resources/entities/resource-purchase.entity");
const resource_review_entity_1 = require("../resources/entities/resource-review.entity");
dotenv.config();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
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
    ],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map