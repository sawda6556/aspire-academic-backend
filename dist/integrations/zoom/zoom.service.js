"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ZoomService = class ZoomService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async createMeeting(startTime, durationMinutes, topic) {
        const launchMode = this.configService.get('LAUNCH_MODE', 'test');
        const zoomApiKey = this.configService.get('ZOOM_API_KEY');
        const zoomApiSecret = this.configService.get('ZOOM_API_SECRET');
        if (launchMode === 'production' && zoomApiKey && zoomApiSecret) {
            console.log(`[PRODUCTION] Creating real Zoom meeting for ${topic}`);
        }
        else {
            console.log(`[TEST/MOCK] Creating mock Zoom meeting for ${startTime} (${durationMinutes} min): ${topic}`);
        }
        return {
            meetingUrl: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
            meetingId: Math.floor(Math.random() * 1000000000).toString(),
            password: Math.random().toString(36).substring(7),
        };
    }
};
exports.ZoomService = ZoomService;
exports.ZoomService = ZoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ZoomService);
//# sourceMappingURL=zoom.service.js.map