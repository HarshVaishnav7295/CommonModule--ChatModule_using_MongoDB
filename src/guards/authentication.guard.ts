import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from 'src/constants/jwt.constant';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    } else {
      const token = authHeader.split(' ')[1];
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
        const user = await this.userService.CheckUser({
          id: payload.id,
          email: payload.email
        });
        if (user) {
          request['user'] = payload.id;
          return true;
        } else {
          throw new UnauthorizedException('Invalid Access Token');
        }
      } catch (error: any) {
        console.log('error', error);
        throw new UnauthorizedException(error);
      }
    }
  }
}
