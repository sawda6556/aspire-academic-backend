import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    
    // As per audit requirements: Ensure only the owner (carakay68@gmail.com) can access admin dashboard
    const adminEmail = 'carakay68@gmail.com';
    
    if (user && user.email === adminEmail) {
      return true;
    }
    
    throw new ForbiddenException('Access denied: Admin only');
  }
}
