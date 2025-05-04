import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // isPublicメタデータが見つかった場合、認証をスキップしてtrueを返す
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    console.log('Request cookies:', request.cookies['jwt']);

    const token = request.cookies['jwt'].access_token;
    console.log('Token:', token);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      console.log('Verifying token...');
      const payload = await this.jwtService.verifyAsync<{
        sub: number;
        nickname: string;
        email: string;
      }>(token as string, {
        secret: jwtConstants.secret,
      });
      console.log('Payload:', payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      console.log('Payload:', payload);
    } catch (error) {
      console.error('Token verification failed:', error); // エラー内容を出力
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
