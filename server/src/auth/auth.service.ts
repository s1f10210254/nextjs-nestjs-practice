import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { UserPayload } from './interfaces/user-payload.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {
    console.log('AuthService secret:', jwtConstants.secret);
  }

  // ユーザーの認証を行うメソッド
  // emailとpasswordを受け取り、アクセストークンとリフレッシュトークンを返す
  async signIn(
    email: string,
    pass: string,
  ): Promise<{
    access_token: string;
    refreshToken: string;
  }> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, nickname: user.nickname };
    const access_token = await this.jwtService.signAsync(payload);

    // Refresh token
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 更新トークンの有効期限を7日後に設定
    const refreshTokenValue = uuidv4(); // UUIDを使用してリフレッシュトークンを生成

    const refreshTokenEntity =
      await this.refreshTokenRepository.createRefreshToken(
        user,
        refreshTokenExpiresAt,
        refreshTokenValue,
      );

    const refreshToken = refreshTokenEntity.token;

    return { access_token, refreshToken };
  }

  // ユーザーを登録するメソッド
  async register(userData: {
    nickname: string;
    email: string;
    password: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.userService.create({
      ...userData,
      password: hashedPassword,
    });
    return newUser;
  }

  // リフレッシュトークンを使用してアクセストークンを更新するメソッド
  // リフレッシュトークンが有効な場合、新しいアクセストークンを返す
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const refreshTokenEntity =
      await this.refreshTokenRepository.findRefreshToken(refreshToken);

    if (!refreshTokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date(refreshTokenEntity.expiresAt) < new Date()) {
      //リフレッシュトークンが期限切れの場合は無効化する
      await this.refreshTokenRepository.deleteRefreshToken(
        refreshTokenEntity.id,
      );
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userService.findById(refreshTokenEntity.userId);

    if (!user) throw new UnauthorizedException('User not found');

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    const newAccessToken = await this.jwtService.signAsync(payload);
    return newAccessToken;
  }

  // logoutメソッド
  async logout(refreshToken: string): Promise<void> {
    const refreshTokenEntity =
      await this.refreshTokenRepository.findRefreshToken(refreshToken);
    if (refreshTokenEntity) {
      await this.refreshTokenRepository.deleteRefreshToken(
        refreshTokenEntity.id,
      );
    }
  }
}
