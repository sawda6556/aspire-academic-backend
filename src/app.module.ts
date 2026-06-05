import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TutorProfilesModule } from './tutor-profiles/tutor-profiles.module';
import { ParentProfilesModule } from './parent-profiles/parent-profiles.module';
import { StudentProfilesModule } from './student-profiles/student-profiles.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';
import { UploadsModule } from './uploads/uploads.module';
import { MessagesModule } from './messages/messages.module';
import { MailModule } from './mail/mail.module';
import { ContactModule } from './contact/contact.module';
import { BookingsModule } from './bookings/bookings.module';
import { AvailabilityModule } from './availability/availability.module';
import { ResourcesModule } from './resources/resources.module';
import { RemindersModule } from './reminders/reminders.module';
import { StripeModule } from './integrations/stripe/stripe.module';
import { User } from './users/entities/user.entity';
import { TutorProfile } from './tutor-profiles/entities/tutor-profile.entity';
import { ParentProfile } from './parent-profiles/entities/parent-profile.entity';
import { StudentProfile } from './student-profiles/entities/student-profile.entity';
import { Subject } from './subjects/entities/subject.entity';
import { Booking } from './bookings/entities/booking.entity';
import { Availability } from './availability/entities/availability.entity';
import { Resource } from './resources/entities/resource.entity';
import { Category } from './resources/entities/category.entity';
import { ResourcePurchase } from './resources/entities/resource-purchase.entity';
import { ResourceReview } from './resources/entities/resource-review.entity';
import { Message } from './messages/entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [
          User,
          TutorProfile,
          ParentProfile,
          StudentProfile,
          Subject,
          Booking,
          Availability,
          Resource,
          Category,
          ResourcePurchase,
          ResourceReview,
          Message,
        ],
        synchronize: false, // Use migrations for production
        logging: true,
      }),
    }),
    UsersModule,
    TutorProfilesModule,
    ParentProfilesModule,
    StudentProfilesModule,
    AuthModule,
    SubjectsModule,
    UploadsModule,
    MessagesModule,
    MailModule,
    ContactModule,
    BookingsModule,
    AvailabilityModule,
    ResourcesModule,
    RemindersModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
