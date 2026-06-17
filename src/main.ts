import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as http from 'http';

const BOOTSTRAP_VERSION = '0.0.13-PROBE';
console.log(`--- ROBUST BOOTSTRAP START (v${BOOTSTRAP_VERSION}) ---`);

const port = process.env.PORT || '3000';
const finalPort = parseInt(port as string, 10);
const bootstrapLogs: string[] = [];

const log = (msg: string) => {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] ${msg}`;
  process.stdout.write(formatted + '\n');
  bootstrapLogs.push(formatted);
};

if (isNaN(finalPort)) {
  log(`CRITICAL: Invalid PORT detected: "${process.env.PORT}". Defaulting to 3000.`);
}

log(`Bootstrap v${BOOTSTRAP_VERSION} initialized. Port: ${finalPort}`);

// 1. Start a diagnostic server IMMEDIATELY
let isNestReady = false;
let nestError: any = null;

const diagnosticServer = http.createServer((req, res) => {
  log(`Diagnostic server received request: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'application/json', 'Connection': 'close' });
  
  const response = {
    status: isNestReady ? 'HANDOVER_IN_PROGRESS' : (nestError ? 'NESTJS_FAILED' : 'BOOTING'),
    version: BOOTSTRAP_VERSION,
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT
    },
    error: nestError ? { message: nestError.message, stack: nestError.stack } : null,
    bootstrapLogs: bootstrapLogs.slice(-50)
  };
  
  res.end(JSON.stringify(response, null, 2));
});

diagnosticServer.on('error', (err) => {
  console.error('Diagnostic Server Error:', err);
});

diagnosticServer.listen(finalPort, '0.0.0.0', () => {
  log(`Diagnostic server is listening on 0.0.0.0:${finalPort}`);
});

// 2. Start NestJS in the background with a slight delay
async function bootstrapNest() {
  log('Delaying NestJS initialization by 2s...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  log('Starting NestJS initialization...');
  try {
    const { AppModule } = await import('./app.module');
    
    log('Creating Nest application instance...');
    const app = await NestFactory.create(AppModule, { 
      logger: ['error', 'warn', 'log'] 
    });
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.enableCors();
    
    log('Nest application instance created.');
    isNestReady = true;

    log('Closing diagnostic server for port handover...');
    diagnosticServer.close(async () => {
      log(`Diagnostic server closed. NestJS taking over port ${finalPort}`);
      try {
        await app.listen(finalPort, '0.0.0.0');
        log(`NestJS is successfully listening on 0.0.0.0:${finalPort}`);
      } catch (listenError: any) {
        log(`CRITICAL: NestJS failed to listen: ${listenError.message}`);
        process.exit(1);
      }
    });

  } catch (error: any) {
    log(`CRITICAL: NestJS initialization failed: ${error.message}`);
    nestError = error;
  }
}

// Global error handlers
process.on('uncaughtException', (err) => {
  log(`UNCAUGHT EXCEPTION: ${err.message}`);
  console.error(err);
});

process.on('unhandledRejection', (reason: any) => {
  log(`UNHANDLED REJECTION: ${reason?.message || reason}`);
  console.error(reason);
});

bootstrapNest();
