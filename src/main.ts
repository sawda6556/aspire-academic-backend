import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as http from 'http';

console.log('--- GLOBAL BOOTSTRAP START (v0.0.7) ---');

async function bootstrap() {
  console.log('BOOTSTRAP: Initializing...');
  const BOOTSTRAP_LOG = '/tmp/bootstrap.log';
  const bootstrapLogs: string[] = [];

  const log = (msg: string) => {
    const timestamp = new Date().toISOString();
    const formattedMsg = `[${timestamp}] ${msg}`;
    console.log(formattedMsg);
    bootstrapLogs.push(formattedMsg);
    try {
      fs.appendFileSync(BOOTSTRAP_LOG, formattedMsg + '\n');
    } catch (e) {}
  };

  log('Detecting port...');
  const finalPort = process.env.PORT || '3000';
  const portNumber = parseInt(finalPort as string, 10);
  log(`Port detected: ${finalPort}`);

  const startFallback = (errorMsg: string, stack?: string) => {
    log('Starting fallback debug server...');
    const server = http.createServer((req, res) => {
      if (req.url === '/health' || req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'CRASHED_BUT_ALIVE',
          version: '0.0.7-fallback',
          timestamp: new Date().toISOString(),
          port: finalPort,
          error: errorMsg,
          stack,
          env: {
             NODE_ENV: process.env.NODE_ENV,
             PORT: process.env.PORT,
             RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
             HAS_DATABASE_URL: !!(process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL)
          },
          bootstrapLogs
        }, null, 2));
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    server.listen(portNumber, '0.0.0.0', () => {
      log(`Fallback server listening on port ${portNumber}`);
    });
  };

  try {
    log('Step 1: Creating Nest application...');
    
    // 45 second timeout for NestFactory.create
    // This handles cases where the DB connection hangs
    const appPromise = NestFactory.create(AppModule);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('NestJS Bootstrap Timeout (45s)')), 45000)
    );

    const app = await Promise.race([appPromise, timeoutPromise]) as any;
    log('Step 2: Nest application created successfully');

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    app.enableCors();
    log('Step 3: Middleware and CORS configured');

    log(`Step 4: Attempting to listen on port: ${portNumber}`);
    await app.listen(portNumber, '0.0.0.0');
    log(`Step 5: Application is successfully running on: http://0.0.0.0:${portNumber}`);

  } catch (error: any) {
    log(`FATAL BOOTSTRAP ERROR: ${error.message}`);
    if (error.stack) log(error.stack);
    startFallback(error.message, error.stack);
  }
}

bootstrap().catch(err => {
  console.error('CRITICAL: bootstrap() promise rejected:', err);
});
