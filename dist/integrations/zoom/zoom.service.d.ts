import { ConfigService } from '@nestjs/config';
export declare class ZoomService {
    private readonly configService;
    constructor(configService: ConfigService);
    createMeeting(startTime: Date, durationMinutes: number, topic: string): Promise<{
        meetingUrl: string;
        meetingId: string;
        password: string;
    }>;
}
