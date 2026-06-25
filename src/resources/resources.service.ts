import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { Category } from './entities/category.entity';
import { ResourcePurchase } from './entities/resource-purchase.entity';
import { ResourceReview } from './entities/resource-review.entity';
import { ResourceStatus } from '../common/enums';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { StripeService } from '../integrations/stripe/stripe.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ResourcePurchase)
    private readonly purchaseRepository: Repository<ResourcePurchase>,
    @InjectRepository(ResourceReview)
    private readonly reviewRepository: Repository<ResourceReview>,
    private readonly stripeService: StripeService,
    private readonly dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(filters: any) {
    const query = this.resourceRepository.createQueryBuilder('resource')
      .leftJoinAndSelect('resource.category', 'category')
      .leftJoinAndSelect('resource.tutor', 'tutor')
      .where('resource.status = :status', { status: ResourceStatus.PUBLISHED });

    if (filters.category) {
      query.andWhere('category.slug = :category', { category: filters.category });
    }

    if (filters.grade) {
      query.andWhere('resource.grade_level = :grade', { grade: filters.grade });
    }

    if (filters.subject) {
      query.andWhere("resource.subjects @> :subject", { subject: JSON.stringify([filters.subject]) });
    }

    if (filters.min_price) {
      query.andWhere('resource.price >= :min_price', { min_price: filters.min_price });
    }

    if (filters.max_price) {
      query.andWhere('resource.price <= :max_price', { max_price: filters.max_price });
    }

    if (filters.search) {
      // Sanitize search input to escape % and _
      const sanitizedSearch = filters.search.replace(/[%_]/g, '\\$&');
      query.andWhere('(resource.title ILIKE :search OR resource.description ILIKE :search)', { search: `%${sanitizedSearch}%` });
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    query.skip((page - 1) * limit).take(limit);

    // Sorting
    if (filters.sort === 'price_asc') {
      query.orderBy('resource.price', 'ASC');
    } else if (filters.sort === 'price_desc') {
      query.orderBy('resource.price', 'DESC');
    } else if (filters.sort === 'rating') {
      query.orderBy('resource.average_rating', 'DESC');
    } else {
      query.orderBy('resource.created_at', 'DESC');
    }

    const [items, total] = await query.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const resource = await this.resourceRepository.findOne({
      where: { id },
      relations: ['category', 'tutor', 'reviews', 'reviews.user'],
    });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    return resource;
  }

  async create(tutorId: string, dto: CreateResourceDto) {
    const resource = this.resourceRepository.create({
      tutor_id: tutorId,
      ...dto,
      status: ResourceStatus.DRAFT,
    });
    return await this.resourceRepository.save(resource);
  }

  async update(id: string, tutorId: string, dto: UpdateResourceDto) {
    const resource = await this.findOne(id);
    if (resource.tutor_id !== tutorId) {
      throw new ForbiddenException('You do not own this resource');
    }
    Object.assign(resource, dto);
    return await this.resourceRepository.save(resource);
  }

  async purchase(userId: string, resourceId: string, paymentMethodId: string) {
    const resource = await this.findOne(resourceId);
    if (resource.status !== ResourceStatus.PUBLISHED) {
      throw new BadRequestException('Resource is not available for purchase');
    }

    const existingPurchase = await this.purchaseRepository.findOne({
      where: { user_id: userId, resource_id: resourceId },
    });
    if (existingPurchase) {
      throw new BadRequestException('You already own this resource');
    }

    const price = Number(resource.price);
    const platformFee = price * 0.15;
    const tutorRevenue = price - platformFee;

    // Real or Mock Stripe Session (StripeService handles LAUNCH_MODE)
    const session = await this.stripeService.createCheckoutSession(
      price,
      'usd',
      `${process.env.FRONTEND_URL}/store/success?id=${resourceId}`,
      `${process.env.FRONTEND_URL}/store/${resourceId}`,
    );

    const purchase = this.purchaseRepository.create({
      user_id: userId,
      resource_id: resourceId,
      price_at_purchase: price,
      platform_fee: platformFee,
      tutor_revenue: tutorRevenue,
      stripe_payment_id: session.id,
    });

    await this.purchaseRepository.save(purchase);
    
    // Emit payment.success event for automated receipt
    // In a real production environment with webhooks, this would be moved to the webhook handler.
    this.eventEmitter.emit('payment.success', {
      userId: userId,
      orderId: purchase.id,
      amount: price,
      currency: 'usd',
      items: [resource.title],
      date: new Date(),
    });
    
    return {
      purchase,
      checkoutUrl: session.url,
    };
  }

  async findPurchased(userId: string) {
    const purchases = await this.purchaseRepository.find({
      where: { user_id: userId },
      relations: ['resource', 'resource.category', 'resource.tutor'],
    });
    
    return purchases.map(p => {
      // In a real production app, we would generate a temporary signed URL here.
      // For this implementation, we ensure the path is consistent.
      const downloadUrl = p.resource.file_url; 
      
      return {
        ...p.resource,
        download_url: downloadUrl,
        purchased_at: p.created_at,
        price_at_purchase: p.price_at_purchase,
      };
    });
  }

  async addReview(userId: string, resourceId: string, rating: number, comment: string) {
    return await this.dataSource.transaction(async (manager) => {
      const purchase = await manager.findOne(ResourcePurchase, {
        where: { user_id: userId, resource_id: resourceId },
      });
      
      if (!purchase) {
        throw new ForbiddenException('You must purchase the resource before reviewing it');
      }
  
      const review = manager.create(ResourceReview, {
        user_id: userId,
        resource_id: resourceId,
        rating,
        comment,
      });
  
      await manager.save(review);
  
      // Atomic update of denormalized rating on resource
      const reviews = await manager.find(ResourceReview, { where: { resource_id: resourceId } });
      const reviewCount = reviews.length;
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
  
      await manager.update(Resource, resourceId, {
        review_count: reviewCount,
        average_rating: averageRating,
      });
  
      return review;
    });
  }
  
  async findTutorResources(tutorId: string) {
    return await this.resourceRepository.find({
      where: { tutor_id: tutorId },
      relations: ['category'],
    });
  }
  
  async findAllCategories() {
    return await this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  // Admin methods
  async findPendingResources() {
    return await this.resourceRepository.find({
      where: { status: ResourceStatus.DRAFT }, // Or add a PENDING status if preferred
      relations: ['category', 'tutor'],
      order: { created_at: 'ASC' }
    });
  }

  async updateStatus(id: string, status: ResourceStatus) {
    const resource = await this.findOne(id);
    resource.status = status;
    return await this.resourceRepository.save(resource);
  }
}
