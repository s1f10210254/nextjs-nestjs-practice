import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export const TAG_OPTIONS = ['仕事', '勉強', '将来', '恋愛', '友人', '家族'];

@Entity('diarys')
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.diarys)
  user: User;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  weather: string;

  @Column({
    type: 'enum',
    enum: ['red', 'orange', 'yellow', 'green', 'blue'],
    default: 'yellow',
  })
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue';

  @Column({ type: 'text' })
  recorded_content: string;

  @Column({ type: 'text', nullable: true })
  ai_advice_content: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
