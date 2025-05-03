import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ユーザー名とパスワードを使って認証するメソッド
  // ここでは簡単な例として、ユーザー名とパスワードが一致するかどうかを確認しています
  // 実際のアプリケーションでは、ハッシュ化されたパスワードを使用し、セキュリティを強化する必要があります
  // 例えば、bcryptを使用してパスワードをハッシュ化し、データベースに保存することが一般的です

  // JWTトークンを生成するメソッド
  // JWTトークンは、ユーザーの認証情報を安全に保存するために使用されます
  // JWTトークンは、ユーザーがログインした後に生成され、クライアントに返されます
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    // JWTトークンのペイロードを定義します
    // ペイロードには、ユーザーのIDやユーザー名などの情報を含めることができます
    // ここでは、ユーザーのIDとユーザー名をペイロードに含めています
    // JWTトークンは、ユーザーの認証情報を安全に保存するために使用されます
    // JWTトークンは、ユーザーがログインした後に生成され、クライアントに返されます
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
