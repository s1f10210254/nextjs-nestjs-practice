import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// export type User = {
//   userId: number;
//   username: string;
//   password: string;
// };

@Injectable()
export class UsersService {
  // private readonly users: User[] = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //   },
  //   {
  //     userId: 2,
  //     username: 'chris',
  //     password: 'guess',
  //   },
  // ];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ユーザーを全て取得するメソッド
  // findOne(username: string): Promise<User | undefined> {
  //   return Promise.resolve(
  //     this.users.find((user) => user.username === username),
  //   );
  // }

  // ニックネームでユーザーを取得するメソッド
  async findOne(nickname: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { nickname },
    });
  }

  // Idでユーザーを取得するメソッド
  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  // emailでユーザーを取得するメソッド
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  // ユーザーを作成するメソッド
  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return await this.usersRepository.save(newUser);
  }
}
