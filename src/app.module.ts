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
        console.log('[AppModule] useFactory START');
        const launchMode = process.env.LAUNCH_MODE || configService.get<string>('LAUNCH_MODE', 'development');
        const nodeEnv = process.env.NODE_ENV || configService.get<string>('NODE_ENV', 'development');
        const isProduction = launchMode === 'production' || nodeEnv === 'production';
        const allowDegraded = process.env.ALLOW_DEGRADED_MODE === 'true';

        console.log(`[AppModule] allowDegraded=${allowDegraded}, isProduction=${isProduction}`);

        // --- DATABASE CONNECTION DEBUG ---
        const dbUrlKeys = ['DATABASE_URL', 'POSTGRES_URL', 'DATABASE_PRIVATE_URL', 'POSTGRES_PRIVATE_URL', 'RAILWAY_POSTGRES_URL', 'URL'];
        const foundEnvKeys = Object.keys(process.env).filter(k => dbUrlKeys.includes(k) || k.includes('POSTGRES') || k.startsWith('PG'));
        console.log(`[AppModule] Available DB env keys: ${foundEnvKeys.join(', ')}`);

        // Prioritize direct process.env for Railway environment injection stability
        const databaseUrl = process.env.RAILWAY_DATABASE_URL ||
                           process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL || 
                           process.env.DATABASE_PRIVATE_URL ||
                           process.env.POSTGRES_PRIVATE_URL ||
                           process.env.RAILWAY_POSTGRES_URL || 
                           configService.get<string>('DATABASE_URL');

        let useFallback = false;
        let sqliteAvailable = false;
        try {
          require.resolve('sqlite3');
          sqliteAvailable = true;
          console.log('PROBE: [AppModule] sqlite3 driver is available.');
        } catch (e) {
          console.log('PROBE: [AppModule] sqlite3 driver is NOT available.');
        }

        const maskedUrl = databaseUrl ? databaseUrl.replace(/:([^:@]+)@/, ':****@') : 'null';
        console.log('PROBE: DATABASE_URL=' + maskedUrl);

        if (databaseUrl) {
          if (allowDegraded) {
            console.log('PROBE: [AppModule] Testing database connection for Degraded Mode fallback...');
            try {
              console.log('PROBE: [AppModule] Requiring pg...');
              const { Client } = require('pg');
              console.log('PROBE: [AppModule] Creating pg client...');
              const client = new Client({ 
                connectionString: databaseUrl,
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 5000 
              });
              console.log('PROBE: [AppModule] Connecting to pg...');
              await client.connect();
              console.log('PROBE: [AppModule] Closing pg connection...');
              await client.end();
              console.log('PROBE: [AppModule] Database connection successful.');
            } catch (e) {
              console.error(`PROBE: [AppModule] Database connection FAILED: ${e.message}`);
              if (sqliteAvailable) {
                console.log('DEGRADED MODE: Falling back to in-memory sqlite.');
                useFallback = true;
              } else {
                console.error('DEGRADED MODE: Database failed and sqlite3 is NOT available. Cannot fallback.');
              }
            }
          }
        } else {
          console.log('PROBE: [AppModule] No databaseUrl found.');
          if (allowDegraded && sqliteAvailable) {
            console.log('DEGRADED MODE: No DB URL, falling back to sqlite.');
            useFallback = true;
          } else if (isProduction && !allowDegraded) {
            console.error('[Bootstrap] FATAL: No database connection string found in production!');
            throw new Error('FATAL: No database connection string found in production environment variables (DATABASE_URL, POSTGRES_URL, etc.)');
          }
        }
        
        console.log(`Database configuration: mode=${launchMode}, env=${nodeEnv}, hasDatabaseUrl=${!!databaseUrl}, useFallback=${useFallback}`);
        
        if (useFallback) {
          console.log('[AppModule] Returning SQLite config');
          return {
            type: 'sqlite',
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
            logging: true,
          };
        }

        console.log('[AppModule] Returning Postgres config');
        // Remote databases (like Railway managed Postgres) usually require SSL
        const useSsl = !!databaseUrl || isProduction;
        
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
          retryAttempts: allowDegraded ? 1 : 3, 
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
