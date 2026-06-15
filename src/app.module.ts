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
      useFactory: async (configService: ConfigService) => {
        const nodeEnv = process.env.NODE_ENV || configService.get<string>('NODE_ENV', 'development');
        const databaseUrl = process.env.RAILWAY_DATABASE_URL ||
                           process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL || 
                           configService.get<string>('DATABASE_URL');

        // Remote databases (like Railway managed Postgres) usually require SSL
        const useSsl = !!databaseUrl || nodeEnv === 'production';
        
        return {
          type: 'postgres',
          ...(databaseUrl
            ? { 
                url: databaseUrl, 
                ssl: useSsl ? { rejectUnauthorized: false } : false,
              }
            : {
                host: process.env.PGHOST || process.env.POSTGRES_HOST || configService.get<string>('POSTGRES_HOST'),
                port: parseInt(process.env.PGPORT || process.env.POSTGRES_PORT || configService.get<string>('POSTGRES_PORT') || '5432', 10),
                username: process.env.PGUSER || process.env.POSTGRES_USER || configService.get<string>('POSTGRES_USER'),
                password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || configService.get<string>('POSTGRES_PASSWORD'),
                database: process.env.PGDATABASE || process.env.POSTGRES_DB || configService.get<string>('POSTGRES_DB'),
                ssl: useSsl ? { rejectUnauthorized: false } : false,
              }),
          autoLoadEntities: true,
          synchronize: false, // Use migrations for production
          retryAttempts: 10, 
          retryDelay: 3000,
          logging: configService.get<string>('TYPEORM_LOGGING') === 'true',
          extra: {
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
          }
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
