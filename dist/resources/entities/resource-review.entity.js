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
exports.ResourceReview = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const resource_entity_1 = require("./resource.entity");
let ResourceReview = class ResourceReview {
    id;
    resource_id;
    user_id;
    rating;
    comment;
    created_at;
    resource;
    user;
};
exports.ResourceReview = ResourceReview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ResourceReview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResourceReview.prototype, "resource_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResourceReview.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ResourceReview.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ResourceReview.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResourceReview.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resource_entity_1.Resource, (resource) => resource.reviews),
    (0, typeorm_1.JoinColumn)({ name: 'resource_id' }),
    __metadata("design:type", resource_entity_1.Resource)
], ResourceReview.prototype, "resource", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ResourceReview.prototype, "user", void 0);
exports.ResourceReview = ResourceReview = __decorate([
    (0, typeorm_1.Entity)('resource_reviews')
], ResourceReview);
//# sourceMappingURL=resource-review.entity.js.map