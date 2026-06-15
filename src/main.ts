import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as http from 'http';

console.log('--- GLOBAL BOOTSTRAP START (v0.0.8-PROBE-FIRST) ---');

async function bootstrap() {
  const BOOTSTRAP_LOG = '/tmp/bootstrap.log';
  const bootstrapLogs: string[] = [];
  
  const log = (msg: string) => {
    const timestamp = new Date().toISOString();
    const formattedMsg = \`[\${timestamp}] \${msg}\`;
    console.log(formattedMsg);
    bootstrapLogs.push(formattedMsg);
    try {
      fs.appendFileSync(BOOTSTRAP_LOG, formattedMsg + '\n');
    } catch (e) {}
  };

  log('Detecting port...');
  const finalPort = process.env.PORT || '3000';
  const portNumber = parseInt(finalPort as string, 10);
  log(\`Port detected: \${finalPort}\`);

  let nestAppReady = false;
  let nestAppError: any = null;

  // 1. Start a temporary probe server to capture logs while NestJS is starting
  const probeServer = http.createServer((req, res) => {
    log(\`Probe server received request: \${req.url}\`);
    if (req.url === '/logs') {
       res.writeHead(200, { 'Content-Type': 'text/plain' });
       res.end(bootstrapLogs.join('\n'));
       return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: nestAppReady ? 'NESTJS_READY_WAITING_FOR_HANDOVER' : (nestAppError ? 'NESTJS_FAILED' : 'NESTJS_STARTING'),
      version: '0.0.8-probe',
      timestamp: new Date().toISOString(),
      port: finalPort,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
        HAS_DATABASE_URL: !!(process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL),
        LAUNCH_MODE: process.env.LAUNCH_MODE
      },
      nestAppError: nestAppError ? { message: nestAppError.message, stack: nestAppError.stack } : null,
      bootstrapLogs
    }, null, 2));
  });

  log('Starting probe server...');
  await new Promise<void>((resolve) => {
    probeServer.listen(portNumber, '0.0.0.0', () => {
      log(\`Probe server listening on port \${portNumber}\`);
      resolve();
    });
  });

  // 2. Start NestJS bootstrap in the background
  const startNest = async () => {
    try {
      log('Background: Step 1 - Creating Nest application...');
      
      const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug', 'verbose'] });
      
      log('Background: Step 2 - Nest application created successfully');
      
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));
      app.enableCors();
      log('Background: Step 3 - Middleware and CORS configured');
      
      nestAppReady = true;
      log('Background: NestJS is ready for handover');
      
      // 3. Handover: Close probe server and start NestJS on the same port
      log('Handover: Closing probe server...');
      probeServer.close(async () => {
        log('Handover: Probe server closed. Starting NestJS listen...');
        try {
          await app.listen(portNumber, '0.0.0.0');
          log(\`Handover: NestJS is successfully running on: http://0.0.0.0:\${portNumber}\`);
        } catch (listenError: any) {
          log(\`Handover FATAL: Failed to listen: \${listenError.message}\`);
        }
      });

    } catch (error: any) {
      log(\`Background FATAL ERROR: \${error.message}\`);
      if (error.stack) log(error.stack);
      nestAppError = error;
    }
  };

  // Run NestJS bootstrap
  startNest();
}

bootstrap().catch(err => {
  console.error('CRITICAL: bootstrap() promise rejected:', err);
});
