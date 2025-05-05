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
import { UserPayload } from './interfaces/user-payload.interface';

// JWT認証ガード クッキーからJWTを取得し、検証する
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // リフレクターを使用して、isPublicメタデータを取得
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // isPublicメタデータが見つかった場合、認証をスキップしてtrueを返す
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = request.cookies['access_token'] as string;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException();
    }
    return true;
  }
}
