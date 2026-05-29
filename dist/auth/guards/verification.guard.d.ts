import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class VerificationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
