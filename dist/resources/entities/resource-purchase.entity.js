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
exports.ResourcePurchase = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const resource_entity_1 = require("./resource.entity");
let ResourcePurchase = class ResourcePurchase {
    id;
    user_id;
    resource_id;
    price_at_purchase;
    stripe_payment_id;
    created_at;
    user;
    resource;
};
exports.ResourcePurchase = ResourcePurchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ResourcePurchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResourcePurchase.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResourcePurchase.prototype, "resource_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ResourcePurchase.prototype, "price_at_purchase", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResourcePurchase.prototype, "stripe_payment_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResourcePurchase.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ResourcePurchase.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => resource_entity_1.Resource),
    (0, typeorm_1.JoinColumn)({ name: 'resource_id' }),
    __metadata("design:type", resource_entity_1.Resource)
], ResourcePurchase.prototype, "resource", void 0);
exports.ResourcePurchase = ResourcePurchase = __decorate([
    (0, typeorm_1.Entity)('resource_purchases')
], ResourcePurchase);
//# sourceMappingURL=resource-purchase.entity.js.map