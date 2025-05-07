import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum QuestionStatus {
  OPEN = 'open',
  SOLVED = 'solved',
  CLOSED = 'closed',
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.questions)
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ default: true })
  is_anonymous: boolean;

  @Column({
    type: 'enum',
    enum: QuestionStatus,
    default: QuestionStatus.OPEN,
  })
  status: QuestionStatus;

  @Column({ default: 0 })
  views_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Answerとのリレーション
  @ManyToOne(() => Question, (answer) => answer.user)
  answers: Question[];
}
