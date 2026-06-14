import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const isDegraded = process.env.ALLOW_DEGRADED_MODE !== 'false';
    if (isDegraded) {
      return 'Aspire Academic API (DEGRADED MODE ACTIVE)';
    }
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    let bootstrapLogs = '';
    try {
      if (require('fs').existsSync('/tmp/bootstrap.log')) {
        bootstrapLogs = require('fs').readFileSync('/tmp/bootstrap.log', 'utf8');
      }
    } catch (e) {
      bootstrapLogs = 'Error reading logs: ' + e.message;
    }

    const allowDegraded = process.env.ALLOW_DEGRADED_MODE !== 'false';
    const databaseUrl = process.env.RAILWAY_DATABASE_URL ||
                        process.env.DATABASE_URL || 
                        process.env.POSTGRES_URL || 
                        process.env.DATABASE_PRIVATE_URL ||
                        process.env.POSTGRES_PRIVATE_URL ||
                        process.env.RAILWAY_POSTGRES_URL;

    return { 
      status: allowDegraded && !databaseUrl ? 'DEGRADED' : 'ok', 
      degradedMode: allowDegraded,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      envKeys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASS') && !k.includes('KEY') && !k.includes('TOKEN')),
      hasDbUrl: !!databaseUrl,
      bootstrapLogs
    };
  }
}
