import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // リフレッシュトークンとのリレーション
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  // Diaryとのリレーション
  @OneToMany(() => Diary, (diary) => diary.user)
  diarys: Diary[];

  // Questionとのリレーション
  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  // Answerとのリレーション
  @OneToMany(() => Question, (answer) => answer.user)
  answers: Question[];

  // 興味の内容
  @Column({ type: 'json', nullable: true })
  recommended_question_ids: number[];
}
