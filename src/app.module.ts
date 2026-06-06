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
import { ZoomModule } from './integrations/zoom/zoom.module';
import { AdminAnalyticsModule } from './admin-analytics/admin-analytics.module';

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
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          ...(databaseUrl
            ? { url: databaseUrl, ssl: { rejectUnauthorized: false } }
            : {
                host: configService.get<string>('POSTGRES_HOST'),
                port: configService.get<number>('POSTGRES_PORT'),
                username: configService.get<string>('POSTGRES_USER'),
                password: configService.get<string>('POSTGRES_PASSWORD'),
                database: configService.get<string>('POSTGRES_DB'),
              }),
          autoLoadEntities: true,
          synchronize: false, // Use migrations for production
          logging: true,
        };
      },
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
    ZoomModule,
    AdminAnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
