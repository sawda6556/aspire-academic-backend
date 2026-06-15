console.log('--- GLOBAL BOOTSTRAP START (v0.0.8) ---');

const bootstrapLogs: string[] = [];
const log = (msg: string) => {
  const timestamp = new Date().toISOString();
  const formattedMsg = `[${timestamp}] ${msg}`;
  console.log(formattedMsg);
  bootstrapLogs.push(formattedMsg);
};

const finalPort = process.env.PORT || '3000';

const startFallback = (errorMsg: string, stack?: string) => {
  log('Emergency fallback check...');
  // Check if anything is already listening on the port
  // We'll just try to start and catch EADDRINUSE
  log('Starting fallback debug server...');
  try {
    const http = require('http');
    const server = http.createServer((req: any, res: any) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'CRASHED_BUT_ALIVE',
        version: '0.0.8-fallback',
        timestamp: new Date().toISOString(),
        port: finalPort,
        error: errorMsg,
        stack,
        envKeys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASS') && !k.includes('KEY') && !k.includes('TOKEN')),
        bootstrapLogs
      }, null, 2));
    });
    server.on('error', (e: any) => {
      log(`Fallback server error: ${e.message}`);
    });
    server.listen(finalPort, '0.0.0.0', () => {
      log(`Fallback server listening on port ${finalPort}`);
    });
  } catch (e: any) {
    console.error('FAILED to start fallback server:', e.message);
  }
};

let nestStarted = false;
const watchdog = setTimeout(() => {
  if (!nestStarted) {
    log('WATCHDOG: NestJS bootstrap is taking too long (>25s). Starting fallback.');
    startFallback('Watchdog Timeout', 'Hanging during initial imports or bootstrap process');
  }
}, 25000);

async function bootstrap() {
  log('BOOTSTRAP: Initializing...');
  try {
    log('Step 1: Importing @nestjs/core...');
    const { NestFactory } = await import('@nestjs/core');
    
    log('Step 2: Importing AppModule...');
    const { AppModule } = await import('./app.module');
    
    log('Step 3: Creating Nest application...');
    const appPromise = NestFactory.create(AppModule);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('NestJS Bootstrap Internal Timeout (40s)')), 40000)
    );

    const app: any = await Promise.race([appPromise, timeoutPromise]);
    log('Step 4: Nest application created successfully');
    
    nestStarted = true;
    clearTimeout(watchdog);

    app.enableCors();
    log('Step 5: CORS enabled');

    log(`Step 6: Attempting to listen on port: ${finalPort}`);
    await app.listen(finalPort, '0.0.0.0');
    log(`Step 7: Application is successfully running on: http://0.0.0.0:${finalPort}`);

  } catch (error: any) {
    log(`FATAL BOOTSTRAP ERROR: ${error.message}`);
    nestStarted = true;
    clearTimeout(watchdog);
    startFallback(error.message, error.stack);
  }
}

process.on('unhandledRejection', (reason: any, promise) => {
  log(`Unhandled Rejection: ${reason?.message || reason}`);
});
process.on('uncaughtException', (err) => {
  log(`Uncaught Exception: ${err.message}`);
  if (!nestStarted) startFallback(err.message, err.stack);
});

bootstrap().catch(err => {
  log(`CRITICAL: bootstrap() promise rejected: ${err.message}`);
  startFallback(err.message, err.stack);
});
