import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const launchMode = this.configService.get<string>('LAUNCH_MODE', 'test');
    const apiKey = launchMode === 'production' 
      ? this.configService.get<string>('STRIPE_LIVE_SECRET_KEY')
      : this.configService.get<string>('STRIPE_TEST_SECRET_KEY');
    
    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2025-01-27.acacia' as any,
      });
      console.log(`[STRIPE] Initialized in ${launchMode} mode`);
    } else {
      console.log(`[STRIPE] Mock mode: No API key found`);
    }
  }

  async createCheckoutSession(
    amount: number, 
    currency: string, 
    successUrl: string, 
    cancelUrl: string,
    priceId?: string
  ) {
    const launchMode = this.configService.get<string>('LAUNCH_MODE', 'test');
    
    if (this.stripe) {
      try {
        console.log(`[STRIPE] Creating real Stripe session. PriceID: ${priceId || 'N/A'}, Amount: ${amount}`);
        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            priceId 
              ? { price: priceId, quantity: 1 }
              : {
                  price_data: {
                    currency: currency.toLowerCase(),
                    product_data: {
                      name: 'Academic Resource',
                    },
                    unit_amount: amount,
                  },
                  quantity: 1,
                },
          ],
          mode: 'payment',
          success_url: successUrl,
          cancel_url: cancelUrl,
        });

        return {
          id: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error('[STRIPE] Error creating session:', error);
        if (launchMode === 'production') throw error;
      }
    }

    console.log(`[TEST/MOCK] Creating mock Stripe session for ${amount} ${currency}`);
    return {
      id: `sess_${Math.random().toString(36).substring(7)}`,
      url: `https://checkout.stripe.com/pay/${Math.random().toString(36).substring(7)}`,
    };
  }
}
