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
        const databaseUrl = process.env.DATABASE_URL || 
                            process.env.POSTGRES_URL || 
                            process.env.DATABASE_PRIVATE_URL ||
                            process.env.POSTGRES_PRIVATE_URL ||
                            configService.get<string>('DATABASE_URL');
                            
        const launchMode = process.env.LAUNCH_MODE || configService.get<string>('LAUNCH_MODE', 'development');
        const nodeEnv = process.env.NODE_ENV || configService.get<string>('NODE_ENV', 'development');
        
        console.log('--- DATABASE CONNECTION DEBUG ---');
        console.log(`- DATABASE_URL in process.env: ${!!process.env.DATABASE_URL}`);
        console.log(`- POSTGRES_URL in process.env: ${!!process.env.POSTGRES_URL}`);
        console.log(`- DATABASE_PRIVATE_URL in process.env: ${!!process.env.DATABASE_PRIVATE_URL}`);
        console.log(`- DATABASE_URL in configService: ${!!configService.get('DATABASE_URL')}`);
        console.log(`- PGHOST in process.env: ${!!process.env.PGHOST}`);
        console.log(`- Final databaseUrl determined: ${!!databaseUrl}`);
        console.log(`- Mode: ${launchMode}, NodeEnv: ${nodeEnv}`);
        console.log('---------------------------------');
        
        // Remote databases (like Railway managed Postgres) usually require SSL
        const useSsl = !!databaseUrl || launchMode === 'production' || nodeEnv === 'production';
        console.log(`Using SSL: ${useSsl}`);

        return {
          type: 'postgres',
          ...(databaseUrl
            ? { 
                url: databaseUrl, 
                ssl: useSsl ? { rejectUnauthorized: false } : false,
              }
            : {
                host: process.env.PGHOST || process.env.POSTGRES_HOST || configService.get<string>('POSTGRES_HOST') || 'localhost',
                port: parseInt(process.env.PGPORT || process.env.POSTGRES_PORT || configService.get<string>('POSTGRES_PORT') || '5432', 10),
                username: process.env.PGUSER || process.env.POSTGRES_USER || configService.get<string>('POSTGRES_USER') || 'postgres',
                password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || configService.get<string>('POSTGRES_PASSWORD') || 'postgres',
                database: process.env.PGDATABASE || process.env.POSTGRES_DB || configService.get<string>('POSTGRES_DB') || 'postgres',
                ssl: useSsl ? { rejectUnauthorized: false } : false,
              }),
          autoLoadEntities: true,
          synchronize: false, // Use migrations for production
          retryAttempts: 3, // Reduce from default 10 to fail faster if misconfigured
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
