import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // クライアントから送信されたユーザー名とパスワードをAuthServiceに渡しaccess_tokenを生成
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body(new ValidationPipe())
    signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refreshToken } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict', // CSRF対策
      path: '/', // クッキーのパス
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict', // CSRF対策
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7日間有効
    });

    return { message: 'Login successful' };
  }

  // ユーザーを登録するメソッド
  @Public()
  @Post('register')
  async register(
    @Body(new ValidationPipe())
    registerDto: RegisterDto,
  ): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const newAccessToken =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict', // CSRF対策
      path: '/', // クッキーのパス
    });

    return { message: 'Access token refreshed successfully' };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'] as string;

    if (refreshToken) await this.authService.logout(refreshToken);

    //Client側のクッキーを削除
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });
    return { message: 'Logout successful' };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    if (!req['user'] || typeof req['user'] !== 'object') {
      throw new UnauthorizedException('Invalid user data');
    }
    return req['user'] as User;
  }
}
