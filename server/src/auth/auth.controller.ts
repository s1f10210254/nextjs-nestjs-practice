import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserPayload } from './interfaces/user-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // クライアントから送信されたユーザー名とパスワードをAuthServiceに渡してJWTを生成
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body(new ValidationPipe())
    signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    res.cookie('jwt', access_token, {
      httpOnly: true,
      sameSite: 'strict', // CSRF対策
      path: '/', // クッキーのパス
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

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: UserPayload) {
    console.log('User:', user);
    return user;
  }
}
