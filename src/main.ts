console.log('--- GLOBAL BOOTSTRAP START (v0.0.6) ---');

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
      const fs = require('fs');
      fs.appendFileSync(BOOTSTRAP_LOG, formattedMsg + '\n');
    } catch (e) {}
  };

  log('Detecting port...');
  const finalPort = process.env.PORT || '3000';
  log(`Port detected: ${finalPort}`);

  const startFallback = (errorMsg: string, stack?: string) => {
    log('Starting fallback debug server...');
    const http = require('http');
    const server = http.createServer((req: any, res: any) => {
      if (req.url === '/health' || req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'CRASHED_BUT_ALIVE',
          version: '0.0.6-fallback',
          timestamp: new Date().toISOString(),
          port: finalPort,
          error: errorMsg,
          stack,
          env: {
             NODE_ENV: process.env.NODE_ENV,
             PORT: process.env.PORT,
             RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT
          },
          bootstrapLogs
        }, null, 2));
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    server.listen(finalPort, '0.0.0.0', () => {
      log(`Fallback server listening on port ${finalPort}`);
    });
  };

  try {
    log('Step 1: Importing @nestjs/core...');
    const { NestFactory } = await import('@nestjs/core');
    log('Step 2: Importing AppModule...');
    // Using require for app.module to avoid TS issues with nodenext extensions in sandbox build
    const { AppModule } = require('./app.module');
    
    log('Step 3: Creating Nest application...');
    
    // 45 second timeout for NestFactory.create
    const appPromise = NestFactory.create(AppModule);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('NestJS Bootstrap Timeout (45s)')), 45000)
    );

    const app: any = await Promise.race([appPromise, timeoutPromise]);
    log('Step 4: Nest application created successfully');

    app.enableCors();
    log('Step 5: CORS enabled');

    log(`Step 6: Attempting to listen on port: ${finalPort}`);
    await app.listen(finalPort, '0.0.0.0');
    log(`Step 7: Application is successfully running on: http://0.0.0.0:${finalPort}`);

  } catch (error: any) {
    log(`FATAL BOOTSTRAP ERROR: ${error.message}`);
    if (error.stack) log(error.stack);
    startFallback(error.message, error.stack);
  }
}

bootstrap().catch(err => {
  console.error('CRITICAL: bootstrap() promise rejected:', err);
});
