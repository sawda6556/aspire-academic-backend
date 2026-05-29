import { ConfigService } from '@nestjs/config';
export declare class StripeService {
    private readonly configService;
    private stripe;
    constructor(configService: ConfigService);
    createCheckoutSession(amount: number, currency: string, successUrl: string, cancelUrl: string): Promise<{
        id: string;
        url: string;
    }>;
}
