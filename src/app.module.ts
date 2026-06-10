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
                            configService.get<string>('DATABASE_URL');
                            
        const launchMode = process.env.LAUNCH_MODE || configService.get<string>('LAUNCH_MODE', 'development');
        const nodeEnv = process.env.NODE_ENV || configService.get<string>('NODE_ENV', 'development');
        
        console.log('--- DATABASE CONNECTION DEBUG ---');
        console.log(`- DATABASE_URL in process.env: ${!!process.env.DATABASE_URL}`);
        console.log(`- DATABASE_URL in configService: ${!!configService.get('DATABASE_URL')}`);
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
                host: configService.get<string>('POSTGRES_HOST'),
                port: configService.get<number>('POSTGRES_PORT', 5432),
                username: configService.get<string>('POSTGRES_USER'),
                password: configService.get<string>('POSTGRES_PASSWORD'),
                database: configService.get<string>('POSTGRES_DB'),
                ssl: useSsl ? { rejectUnauthorized: false } : false,
              }),
          autoLoadEntities: true,
          synchronize: false, // Use migrations for production
          logging: configService.get<string>('TYPEORM_LOGGING') === 'true',
          extra: {
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
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
