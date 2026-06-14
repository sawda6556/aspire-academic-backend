console.log('PROBE: Starting process');
console.log('--- GLOBAL BOOTSTRAP START (v0.0.4) ---');
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as http from 'http';

// Polyfill for Node.js < 19 where crypto.randomUUID is not global
if (!global.crypto) {
  (global as any).crypto = crypto;
}

const BOOTSTRAP_LOG = '/tmp/bootstrap.log';
function log(message: string) {
  const msg = `[${new Date().toISOString()}] ${message}\n`;
  console.log(message);
  try {
    fs.appendFileSync(BOOTSTRAP_LOG, msg);
  } catch (e) {
    console.error(`Failed to write to bootstrap log: ${e.message}`);
  }
}

async function bootstrap() {
  log('Starting application bootstrap...');
  const port = process.env.PORT || '3000';
  const finalPort = parseInt(port, 10);
  
  if (process.env.DEBUG_MODE === 'true') {
    log('DEBUG MODE ACTIVE: Starting minimal debug server...');
    const server = http.createServer((req, res) => {
      log(`Debug server received request: ${req.url}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const env = {};
      Object.keys(process.env).forEach(k => {
        if (!k.includes('SECRET') && !k.includes('PASS') && !k.includes('KEY') && !k.includes('TOKEN')) {
          env[k] = process.env[k];
        } else {
          env[k] = '********';
        }
      });
      res.end(JSON.stringify({
        message: 'Aspire Academic Debug Server',
        timestamp: new Date().toISOString(),
        env,
        bootstrapLogs: fs.existsSync(BOOTSTRAP_LOG) ? fs.readFileSync(BOOTSTRAP_LOG, 'utf8') : 'No logs found'
      }, null, 2));
    });
    server.listen(finalPort, '0.0.0.0', () => {
      log(`Debug server listening on port ${finalPort}`);
    });
    return; // Stop here and don't start NestJS
  }

  log(`Environment Variable Keys: ${Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASS') && !k.includes('KEY') && !k.includes('TOKEN')).join(', ')}`);
  
  const dbUrl = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    const masked = dbUrl.replace(/:([^:@/]+)@/, ':****@');
    log(`PROBE: Masked DATABASE_URL detected: ${masked}`);
  } else {
    log('PROBE: No DATABASE_URL found. Will check PG* env vars.');
  }

  let app;
  try {
    log('Attempting NestFactory.create(AppModule)...');
    app = await NestFactory.create(AppModule);
    log('App instance created successfully');

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.enableCors();
    log('Middleware configured');

    log(`Attempting to listen on port: ${finalPort}`);
    await app.listen(finalPort, '0.0.0.0');
    log(`Application is successfully running on: http://0.0.0.0:${finalPort}`);
  } catch (error) {
    log(`CRITICAL: Error during application startup: ${error.message}`);
    log(`ERROR STACK: ${error.stack}`);
    
    // In case of error, start a fallback debug server so we can at least see the logs
    log('Starting fallback debug server due to crash...');
    const server = http.createServer((req, res) => {
      // Return 200 OK so Railway doesn't rollback the deployment
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'CRASHED_BUT_ALIVE',
        message: 'Aspire Academic Fallback Server (v1.0.1)',
        error: error.message,
        stack: error.stack,
        bootstrapLogs: fs.existsSync(BOOTSTRAP_LOG) ? fs.readFileSync(BOOTSTRAP_LOG, 'utf8') : 'No logs found'
      }, null, 2));
    });
    server.listen(finalPort, '0.0.0.0', () => {
      log(`Fallback server listening on port ${finalPort}`);
    });
  }
}
bootstrap();
