import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // クライアントから送信されたユーザー名とパスワードをAuthServiceに渡してJWTを生成
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body(new ValidationPipe())
    signInDto: LoginDto,
  ) {
    return this.authService.signIn(signInDto.email, signInDto.password);
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

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
