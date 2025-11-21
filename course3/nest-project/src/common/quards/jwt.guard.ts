import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/src/auth/auth.service';
import { RequestWithUser } from '../middleware/user-context.middleware';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const authHeader = req.headers['authorization'] as string | undefined;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization headers');
    }

    let userId: string;

    try {
      userId = this.authService.verifyToken(authHeader);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = { id: userId, role: 'user' };

    return true;
  }
}
