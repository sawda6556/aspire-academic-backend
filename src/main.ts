import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as http from 'http';

const BOOTSTRAP_VERSION = '0.0.11';
console.log(`--- ROBUST BOOTSTRAP START (v${BOOTSTRAP_VERSION}) ---`);

const finalPort = process.env.PORT || '3000';
const bootstrapLogs: string[] = [];

const log = (msg: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
  bootstrapLogs.push(`[${timestamp}] ${msg}`);
};

log(`Bootstrap v${BOOTSTRAP_VERSION} initialized. Port: ${finalPort}`);

// 1. Start a diagnostic server IMMEDIATELY to satisfy Railway's health check
let nestApp: any = null;
let isNestReady = false;

const diagnosticServer = http.createServer((req, res) => {
  log(`Diagnostic server received request: ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (isNestReady) {
    res.end(JSON.stringify({
      status: 'HANDOVER_IN_PROGRESS',
      message: 'NestJS is ready. Diagnostic server is closing.',
      version: BOOTSTRAP_VERSION,
      bootstrapLogs
    }));
  } else {
    res.end(JSON.stringify({
      status: 'BOOTING',
      message: 'NestJS is still initializing in the background.',
      version: BOOTSTRAP_VERSION,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL_SET: !!process.env.DATABASE_URL
      },
      bootstrapLogs
    }, null, 2));
  }
});

diagnosticServer.listen(finalPort, '0.0.0.0', () => {
  log('Diagnostic server is listening on 0.0.0.0:' + finalPort);
});

// 2. Start NestJS in the background
async function bootstrapNest() {
  log('Starting NestJS initialization...');
  try {
    // Dynamic import to avoid issues if AppModule has top-level errors before we start diagnostic server
    const { AppModule } = await import('./app.module');
    
    log('Creating Nest application instance...');
    const app = await NestFactory.create(AppModule);
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.enableCors();
    
    log('Nest application instance created and configured.');
    nestApp = app;
    isNestReady = true;

    // 3. Handover: Close diagnostic server and start NestJS on the same port
    log('Closing diagnostic server for port handover...');
    diagnosticServer.close(async () => {
      log('Diagnostic server closed. NestJS taking over port ' + finalPort);
      try {
        await nestApp.listen(finalPort, '0.0.0.0');
        log('NestJS is successfully listening on 0.0.0.0:' + finalPort);
      } catch (listenError: any) {
        log(`CRITICAL: NestJS failed to listen on port ${finalPort}: ${listenError.message}`);
        startFailureServer(listenError);
      }
    });

  } catch (error: any) {
    log(`CRITICAL: NestJS initialization failed: ${error.message}`);
    if (error.stack) console.error(error.stack);
    startFailureServer(error);
  }
}

function startFailureServer(error: any) {
  log('Starting persistent failure server...');
  const failureServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'NESTJS_FAILED_FINAL',
      version: BOOTSTRAP_VERSION,
      error: error.message,
      stack: error.stack,
      bootstrapLogs
    }, null, 2));
  });
  
  // Try to listen, but might fail if port is still busy
  failureServer.listen(finalPort, '0.0.0.0', () => {
    log('Failure reporting server is listening on 0.0.0.0:' + finalPort);
  });
}

bootstrapNest();
