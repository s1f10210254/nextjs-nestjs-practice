import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8) // パスワードの最小文字数を8に設定
  password: string;
}
