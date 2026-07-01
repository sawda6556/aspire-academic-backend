import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentReceiptListener {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @OnEvent('payment.success')
  async handlePaymentSuccess(payload: {
    userId: string;
    orderId: string;
    amount: number;
    currency: string;
    items: string[];
    date: Date;
  }) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: payload.userId } });
      if (!user) {
        console.error(`User ${payload.userId} not found for receipt`);
        return;
      }
      await this.mailService.sendPaymentReceipt(user.email, {
        orderId: payload.orderId,
        amount: payload.amount,
        currency: payload.currency,
        items: payload.items,
        date: payload.date,
      });

      await this.mailService.notifyAdminOnPayment(user, {
        orderId: payload.orderId,
        amount: payload.amount,
        currency: payload.currency,
        items: payload.items,
        date: payload.date,
      });
    } catch (error) {
      console.error('Error handling payment.success event:', error);
    }
  }

  @OnEvent('payment.failed')
  async handlePaymentFailed(payload: {
    userId: string;
    orderId: string;
    amount: number;
    currency: string;
    error?: string;
  }) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: payload.userId } });
      if (!user) return;
      await this.mailService.notifyAdminOnPaymentFailure(user, payload);
    } catch (error) {
      console.error('Error handling payment.failed event:', error);
    }
  }

  @OnEvent('payment.refunded')
  async handlePaymentRefunded(payload: {
    userId: string;
    orderId: string;
    amount: number;
    currency: string;
    reason?: string;
  }) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: payload.userId } });
      if (!user) return;
      await this.mailService.notifyAdminOnRefund(user, payload);
    } catch (error) {
      console.error('Error handling payment.refunded event:', error);
    }
  }

  @OnEvent('payment.disputed')
  async handlePaymentDisputed(payload: {
    userId: string;
    orderId: string;
    amount: number;
    currency: string;
    disputeId: string;
    reason?: string;
  }) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: payload.userId } });
      if (!user) return;
      await this.mailService.notifyAdminOnDispute(user, payload);
    } catch (error) {
      console.error('Error handling payment.disputed event:', error);
    }
  }
}
