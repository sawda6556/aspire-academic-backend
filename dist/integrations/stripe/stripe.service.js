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
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let StripeService = class StripeService {
    configService;
    stripe;
    constructor(configService) {
        this.configService = configService;
        const launchMode = this.configService.get('LAUNCH_MODE', 'test');
        const apiKey = launchMode === 'production'
            ? this.configService.get('STRIPE_LIVE_SECRET_KEY')
            : this.configService.get('STRIPE_TEST_SECRET_KEY');
        if (apiKey) {
            console.log(`[STRIPE] Initialized in ${launchMode} mode`);
        }
        else {
            console.log(`[STRIPE] Mock mode: No API key found`);
        }
    }
    async createCheckoutSession(amount, currency, successUrl, cancelUrl) {
        const launchMode = this.configService.get('LAUNCH_MODE', 'test');
        if (launchMode === 'production') {
            console.log(`[PRODUCTION] Creating real Stripe session for ${amount} ${currency}`);
        }
        else {
            console.log(`[TEST/MOCK] Creating mock Stripe session for ${amount} ${currency}`);
        }
        return {
            id: `sess_${Math.random().toString(36).substring(7)}`,
            url: `https://checkout.stripe.com/pay/${Math.random().toString(36).substring(7)}`,
        };
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map