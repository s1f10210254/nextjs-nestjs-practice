import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'chris',
      password: 'guess',
    },
  ];

  // ユーザーを全て取得するメソッド
  findOne(username: string): Promise<User | undefined> {
    return Promise.resolve(
      this.users.find((user) => user.username === username),
    );
  }
}
