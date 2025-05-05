import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(
    user: User,
    expiresIn: Date,
    token: string,
  ): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      user,
      userId: user.id,
      expiresAt: expiresIn, // expiresIn の値を expiresAt に代入
      token,
    });
    return await this.refreshTokenRepository.save(refreshToken);
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({ where: { token } });
  }

  async deleteRefreshToken(tokenId: number): Promise<void> {
    await this.refreshTokenRepository.delete(tokenId);
  }

  async deleteUserRefreshTokens(userId: number): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }
}
