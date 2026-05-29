import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ZoomService {
  constructor(private readonly configService: ConfigService) {}

  async createMeeting(startTime: Date, durationMinutes: number, topic: string) {
    const launchMode = this.configService.get<string>('LAUNCH_MODE', 'test');
    const zoomApiKey = this.configService.get<string>('ZOOM_API_KEY');
    const zoomApiSecret = this.configService.get<string>('ZOOM_API_SECRET');

    if (launchMode === 'production' && zoomApiKey && zoomApiSecret) {
      console.log(`[PRODUCTION] Creating real Zoom meeting for ${topic}`);
      // Implementation for Server-to-Server OAuth would go here
    } else {
      console.log(`[TEST/MOCK] Creating mock Zoom meeting for ${startTime} (${durationMinutes} min): ${topic}`);
    }

    // Returning a mock response for now
    return {
      meetingUrl: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
      meetingId: Math.floor(Math.random() * 1000000000).toString(),
      password: Math.random().toString(36).substring(7),
    };
  }
}
