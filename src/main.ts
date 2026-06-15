import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as http from 'http';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3000;

  console.log(`[BOOTSTRAP] Starting Aspire Academic Backend (Production Mode)`);
  console.log(`[BOOTSTRAP] Port: ${port}`);
  console.log(`[BOOTSTRAP] NODE_ENV: ${process.env.NODE_ENV}`);

  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule);

    // Security & Middleware
    app.enableCors();

    // Start listening
    await app.listen(port, '0.0.0.0');
    
    const url = await app.getUrl();
    logger.log(`Application is successfully running on: ${url}`);
    
  } catch (error: any) {
    console.error(`[FATAL] NestJS Bootstrap Failed: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }

    // Start a fallback server to report the error via the health endpoint
    // This keeps the container 'alive' in Railway's eyes so we can see logs
    const fallbackServer = http.createServer((req, res) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'CRASHED_ON_BOOTSTRAP',
        message: error.message,
        stack: error.stack,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT,
          DATABASE_URL_SET: !!process.env.DATABASE_URL
        }
      }, null, 2));
    });

    fallbackServer.listen(port, '0.0.0.0', () => {
      console.log(`[FALLBACK] Error reporting server active on port ${port}`);
    });
  }
}

// Global Exception Handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection] at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception] thrown:', error);
});

bootstrap();
