import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserType, VerificationStatus } from '../../common/enums';

@Injectable()
export class VerificationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Parents don't need verification to access platform features (as per current requirements)
    if (user.user_type === UserType.PARENT) {
      return true;
    }

    let status: VerificationStatus = VerificationStatus.PENDING;

    if (user.user_type === UserType.TUTOR) {
      status = user.tutor_profile?.verification_status;
    } else if (user.user_type === UserType.STUDENT) {
      // For students, we check if they are independent (no parent)
      if (!user.student_profile?.parent_id) {
        status = user.student_profile?.verification_status;
      } else {
        // Students managed by parents are considered verified by their parent's status
        return true;
      }
    }

    if (status !== VerificationStatus.APPROVED) {
      throw new ForbiddenException(
        'Your account is not yet approved. Please complete your profile and wait for admin verification.',
      );
    }

    return true;
  }
}
