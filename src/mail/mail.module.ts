import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './mail.service';
import { PaymentReceiptListener } from './payment-receipt.listener';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [MailService, PaymentReceiptListener],
  exports: [MailService],
})
export class MailModule {}
