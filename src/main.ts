console.log('--- DIAGNOSTIC BOOTSTRAP START (v0.0.10) ---');

const finalPort = process.env.PORT || '3000';
const http = require('http');

const bootstrapLogs: string[] = [];
const log = (msg: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
  bootstrapLogs.push(`[${timestamp}] ${msg}`);
};

log(`Diagnostic mode. Listening on ${finalPort} for 10 seconds before starting NestJS.`);

const server = http.createServer((req: any, res: any) => {
  log(`Request received: ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    status: 'DIAGNOSTIC_ALIVE', 
    version: '0.0.10',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL_SET: !!process.env.DATABASE_URL
    },
    bootstrapLogs
  }, null, 2));
});

server.listen(finalPort, '0.0.0.0', () => {
  log('Diagnostic server is UP.');
});

async function runNest() {
  log('Starting NestJS bootstrap sequence...');
  try {
    const { NestFactory } = await import('@nestjs/core');
    const { AppModule } = await import('./app.module');
    
    log('Creating Nest application with 30s timeout...');
    const appPromise = NestFactory.create(AppModule);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('NestJS Create Timeout (30s)')), 30000)
    );

    const app: any = await Promise.race([appPromise, timeoutPromise]);
    app.enableCors();
    log('Attempting app.listen...');
    await app.listen(finalPort, '0.0.0.0');
    log('NestJS is UP and RUNNING.');
  } catch (err: any) {
    log(`NestJS Bootstrap FAILED or TIMED OUT: ${err.message}`);
    if (err.stack) console.error(err.stack);
    
    // Start a persistent failure server
    const failureServer = http.createServer((req: any, res: any) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'NESTJS_FAILED_FINAL', 
        error: err.message, 
        stack: err.stack,
        bootstrapLogs 
      }, null, 2));
    });
    failureServer.listen(finalPort, '0.0.0.0', () => {
      log('Failure reporting server is UP.');
    });
  }
}

setTimeout(() => {
  log('Closing diagnostic server to free port for NestJS...');
  server.close(() => {
    log('Port freed. Launching NestJS...');
    runNest();
  });
}, 10000);
