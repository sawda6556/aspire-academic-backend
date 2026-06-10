import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as crypto from 'crypto';

// Polyfill for Node.js < 19 where crypto.randomUUID is not global
if (!global.crypto) {
  (global as any).crypto = crypto;
}

async function bootstrap() {
  console.log('Starting application bootstrap...');
  try {
    const app = await NestFactory.create(AppModule);
    console.log('App instance created');
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.enableCors();
    console.log('Middleware configured');

    const port = process.env.PORT;
    if (!port) {
      console.error('CRITICAL: PORT environment variable is not set! Railway requires this to route traffic.');
      // In production, we MUST have the PORT from Railway.
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Missing PORT environment variable in production');
      }
    }
    const finalPort = port ? parseInt(port, 10) : 3000;
    console.log(`Attempting to listen on port: ${finalPort} (from env.PORT: ${port})`);
    console.log(`Environment Variable Keys: ${Object.keys(process.env).join(', ')}`);
    
    await app.listen(finalPort, '0.0.0.0');
    console.log(`Application is successfully running on: http://0.0.0.0:${finalPort}`);
  } catch (error) {
    console.error('Error during application bootstrap:');
    console.error(error);
    process.exit(1);
  }
}
bootstrap();
