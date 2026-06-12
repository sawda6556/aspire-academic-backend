console.log('PROBE: Starting process');
console.log('--- GLOBAL BOOTSTRAP START ---');
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as crypto from 'crypto';
import * as fs from 'fs';

// Polyfill for Node.js < 19 where crypto.randomUUID is not global
if (!global.crypto) {
  (global as any).crypto = crypto;
}

const BOOTSTRAP_LOG = '/tmp/bootstrap.log';
function log(message: string) {
  const msg = `[${new Date().toISOString()}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(BOOTSTRAP_LOG, msg);
}

async function bootstrap() {
  log('Starting application bootstrap...');
  
  const allowDegraded = process.env.ALLOW_DEGRADED_MODE === 'true';

  // Masked DB URL Probe
  const dbUrl = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    const masked = dbUrl.replace(/:([^:@/]+)@/, ':****@');
    log(`PROBE: Masked DATABASE_URL detected: ${masked}`);
  } else {
    log('PROBE: No DATABASE_URL or equivalent found in process.env');
  }

  log(`Environment Variable Keys: ${Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASS') && !k.includes('KEY') && !k.includes('TOKEN')).join(', ')}`);
  
  let app;
  try {
    log('Attempting NestFactory.create(AppModule)...');
    app = await NestFactory.create(AppModule);
    log('App instance created successfully');
  } catch (error) {
    log(`CRITICAL: Error during NestFactory.create: ${error.message}`);
    log(`ERROR STACK: ${error.stack}`);
    
    if (allowDegraded) {
      log('DEGRADED MODE: Primary AppModule failed. This should not happen with our fallback logic in AppModule. Investigate synchronous initialization errors.');
    }
    process.exit(1);
  }

  try {
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.enableCors();
    log('Middleware configured');

    const port = process.env.PORT;
    if (!port) {
      log('CRITICAL: PORT environment variable is not set! Railway requires this to route traffic.');
      if (process.env.NODE_ENV === 'production' && !allowDegraded) {
        throw new Error('Missing PORT environment variable in production');
      }
    }
    const finalPort = port ? parseInt(port, 10) : 3000;
    log(`Attempting to listen on port: ${finalPort} (from env.PORT: ${port})`);
    
    await app.listen(finalPort, '0.0.0.0');
    log(`Application is successfully running on: http://0.0.0.0:${finalPort}`);
  } catch (error) {
    log(`Error during application startup: ${error.message}`);
    log(error.stack);
    process.exit(1);
  }
}
bootstrap();
