import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //クライアントからのリクエストを受け取るエンドポイントを定義する
  //ユーザーが認証された場合は、JWTトークンを返す
  //理想的にはDTOクラスを使用して、リクエストボディのバリデーションを行う
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() data: { username: string; password: string }) {
    return this.authService.signIn(data.username, data.password);
  }
}
