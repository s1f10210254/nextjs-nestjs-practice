import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('diary')
export class Diary {
  @PrimaryGeneratedColumn()
  diary_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  weather: string;

  @Column({ nullable: true })
  mood_color: string;

  @Column()
  recorded_content: string;

  @Column({ nullable: true, type: 'text' })
  ai_advice_content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
