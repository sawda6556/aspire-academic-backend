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
    return { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}
