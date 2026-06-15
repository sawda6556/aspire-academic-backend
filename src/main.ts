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
      const fs = require('fs');
      fs.appendFileSync(BOOTSTRAP_LOG, formattedMsg + '\n');
    } catch (e) {}
  };

  log('Detecting environment...');
  log(`NODE_ENV: ${process.env.NODE_ENV}`);
  log(`PORT: ${process.env.PORT}`);

  const finalPort = process.env.PORT || '3000';
  log(`Final Port: ${finalPort}`);

  const startFallback = (errorMsg: string, stack?: string) => {
    log('Starting fallback debug server...');
    try {
      const http = require('http');
      const server = http.createServer((req: any, res: any) => {
        if (req.url === '/health' || req.url === '/') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'CRASHED_BUT_ALIVE',
            version: '0.0.7-fallback',
            timestamp: new Date().toISOString(),
            port: finalPort,
            error: errorMsg,
            stack,
            envKeys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASS') && !k.includes('KEY') && !k.includes('TOKEN')),
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
    } catch (e) {
      console.error('FAILED to start fallback server:', e);
    }
  };

  try {
    log('Step 1: Importing @nestjs/core...');
    const { NestFactory } = await import('@nestjs/core');
    
    log('Step 2: Importing AppModule...');
    const { AppModule } = await import('./app.module');
    
    log('Step 3: Creating Nest application...');
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

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

bootstrap().catch(err => {
  console.error('CRITICAL: bootstrap() promise rejected:', err);
});
