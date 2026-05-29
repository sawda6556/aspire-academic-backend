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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resource_entity_1 = require("./entities/resource.entity");
const category_entity_1 = require("./entities/category.entity");
const resource_purchase_entity_1 = require("./entities/resource-purchase.entity");
const resource_review_entity_1 = require("./entities/resource-review.entity");
const enums_1 = require("../common/enums");
let ResourcesService = class ResourcesService {
    resourceRepository;
    categoryRepository;
    purchaseRepository;
    reviewRepository;
    dataSource;
    constructor(resourceRepository, categoryRepository, purchaseRepository, reviewRepository, dataSource) {
        this.resourceRepository = resourceRepository;
        this.categoryRepository = categoryRepository;
        this.purchaseRepository = purchaseRepository;
        this.reviewRepository = reviewRepository;
        this.dataSource = dataSource;
    }
    async findAll(filters) {
        const query = this.resourceRepository.createQueryBuilder('resource')
            .leftJoinAndSelect('resource.category', 'category')
            .leftJoinAndSelect('resource.tutor', 'tutor')
            .where('resource.status = :status', { status: enums_1.ResourceStatus.PUBLISHED });
        if (filters.category) {
            query.andWhere('category.slug = :category', { category: filters.category });
        }
        if (filters.search) {
            const sanitizedSearch = filters.search.replace(/[%_]/g, '\\$&');
            query.andWhere('(resource.title ILIKE :search OR resource.description ILIKE :search)', { search: `%${sanitizedSearch}%` });
        }
        const page = filters.page || 1;
        const limit = filters.limit || 12;
        query.skip((page - 1) * limit).take(limit);
        if (filters.sort === 'price_asc') {
            query.orderBy('resource.price', 'ASC');
        }
        else if (filters.sort === 'price_desc') {
            query.orderBy('resource.price', 'DESC');
        }
        else if (filters.sort === 'rating') {
            query.orderBy('resource.average_rating', 'DESC');
        }
        else {
            query.orderBy('resource.created_at', 'DESC');
        }
        const [items, total] = await query.getManyAndCount();
        return { items, total, page, limit };
    }
    async findOne(id) {
        const resource = await this.resourceRepository.findOne({
            where: { id },
            relations: ['category', 'tutor', 'reviews', 'reviews.user'],
        });
        if (!resource) {
            throw new common_1.NotFoundException('Resource not found');
        }
        return resource;
    }
    async create(tutorId, dto) {
        const resource = this.resourceRepository.create({
            tutor_id: tutorId,
            ...dto,
            status: enums_1.ResourceStatus.DRAFT,
        });
        return await this.resourceRepository.save(resource);
    }
    async update(id, tutorId, dto) {
        const resource = await this.findOne(id);
        if (resource.tutor_id !== tutorId) {
            throw new common_1.ForbiddenException('You do not own this resource');
        }
        Object.assign(resource, dto);
        return await this.resourceRepository.save(resource);
    }
    async purchase(userId, resourceId, paymentMethodId) {
        const resource = await this.findOne(resourceId);
        if (resource.status !== enums_1.ResourceStatus.PUBLISHED) {
            throw new common_1.BadRequestException('Resource is not available for purchase');
        }
        const existingPurchase = await this.purchaseRepository.findOne({
            where: { user_id: userId, resource_id: resourceId },
        });
        if (existingPurchase) {
            throw new common_1.BadRequestException('You already own this resource');
        }
        console.log(`Processing payment for resource ${resourceId} by user ${userId} using ${paymentMethodId}`);
        const stripePaymentId = `ch_${Math.random().toString(36).substring(7)}`;
        const purchase = this.purchaseRepository.create({
            user_id: userId,
            resource_id: resourceId,
            price_at_purchase: resource.price,
            stripe_payment_id: stripePaymentId,
        });
        return await this.purchaseRepository.save(purchase);
    }
    async findPurchased(userId) {
        const purchases = await this.purchaseRepository.find({
            where: { user_id: userId },
            relations: ['resource', 'resource.category', 'resource.tutor'],
        });
        return purchases.map(p => {
            const signedUrl = `${p.resource.file_url}?token=mock_signed_token_${Date.now()}`;
            return {
                ...p.resource,
                download_url: signedUrl,
                purchased_at: p.created_at,
            };
        });
    }
    async addReview(userId, resourceId, rating, comment) {
        return await this.dataSource.transaction(async (manager) => {
            const purchase = await manager.findOne(resource_purchase_entity_1.ResourcePurchase, {
                where: { user_id: userId, resource_id: resourceId },
            });
            if (!purchase) {
                throw new common_1.ForbiddenException('You must purchase the resource before reviewing it');
            }
            const review = manager.create(resource_review_entity_1.ResourceReview, {
                user_id: userId,
                resource_id: resourceId,
                rating,
                comment,
            });
            await manager.save(review);
            const reviews = await manager.find(resource_review_entity_1.ResourceReview, { where: { resource_id: resourceId } });
            const reviewCount = reviews.length;
            const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
            await manager.update(resource_entity_1.Resource, resourceId, {
                review_count: reviewCount,
                average_rating: averageRating,
            });
            return review;
        });
    }
    async findTutorResources(tutorId) {
        return await this.resourceRepository.find({
            where: { tutor_id: tutorId },
            relations: ['category'],
        });
    }
    async findAllCategories() {
        return await this.categoryRepository.find({ order: { name: 'ASC' } });
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resource_entity_1.Resource)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(resource_purchase_entity_1.ResourcePurchase)),
    __param(3, (0, typeorm_1.InjectRepository)(resource_review_entity_1.ResourceReview)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map