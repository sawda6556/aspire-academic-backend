import { Controller, Post, Body, Headers, Req, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Stripe from 'stripe';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    const apiKey = this.configService.get<string>('LAUNCH_MODE') === 'production'
      ? this.configService.get<string>('STRIPE_LIVE_SECRET_KEY')
      : this.configService.get<string>('STRIPE_TEST_SECRET_KEY');

    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2025-01-27.acacia' as any,
      });
    }
  }

  @Post()
  async handleWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    if (webhookSecret && signature && this.stripe) {
      try {
        event = this.stripe.webhooks.constructEvent(
          payload,
          signature,
          webhookSecret,
        );
      } catch (err) {
        throw new BadRequestException(`Webhook Error: ${err.message}`);
      }
    } else {
      // If no secret, fall back to unverified payload (only for development/testing)
      event = payload;
    }

    const data = event.data.object as any;

    switch (event.type) {
      case 'checkout.session.completed':
      case 'payment_intent.succeeded':
        this.eventEmitter.emit('payment.success', {
          userId: data.metadata?.userId || data.client_reference_id,
          orderId: data.id,
          amount: data.amount_total / 100 || data.amount / 100,
          currency: data.currency,
          items: ['Stripe Purchase'],
          date: new Date(),
        });
        break;

      case 'payment_intent.payment_failed':
        this.eventEmitter.emit('payment.failed', {
          userId: data.metadata?.userId || data.client_reference_id,
          orderId: data.id,
          amount: data.amount / 100,
          currency: data.currency,
          error: data.last_payment_error?.message,
        });
        break;

      case 'charge.refunded':
        this.eventEmitter.emit('payment.refunded', {
          userId: data.metadata?.userId,
          orderId: data.payment_intent,
          amount: data.amount_refunded / 100,
          currency: data.currency,
          reason: data.refunds?.data[0]?.reason,
        });
        break;

      case 'charge.dispute.created':
        this.eventEmitter.emit('payment.disputed', {
          userId: data.metadata?.userId,
          orderId: data.payment_intent,
          amount: data.amount / 100,
          currency: data.currency,
          disputeId: data.id,
          reason: data.reason,
        });
        break;
    }

    return { received: true };
  }
}
