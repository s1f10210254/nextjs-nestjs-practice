import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/user.entity';
import { VectorService } from 'src/vector/vector.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class QuestionRecommendationService {
  constructor(
    private readonly vectorService: VectorService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async regenerateForUser(userId: number): Promise<number[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    const recentQuestions = await this.questionRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      take: 5,
    });

    if (!recentQuestions.length) return [];

    const combinedText = recentQuestions
      .map((q) => `${q.title}\n${q.content}`)
      .join('\n\n');

    const embedding = await this.vectorService.generateEmbedding(combinedText);

    const results = await this.vectorService.searchQuestionToQdrant(
      embedding,
      [],
      5,
    );

    const ids = results.map((r) => Number(r.id)).filter((id) => !isNaN(id)); // ← ここを追加

    await this.userRepository.update(userId, {
      recommended_question_ids: ids,
    });

    return ids;
  }

  async getRecommendedQuestions(userId: number): Promise<Question[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user?.recommended_question_ids) return [];

    // 安全に数値変換し、不正な値を除去
    const ids: number[] = (user.recommended_question_ids as any[])
      .map((id) => {
        const n = Number(id);
        return isNaN(n) ? null : n;
      })
      .filter((id): id is number => typeof id === 'number');

    if (ids.length === 0) return [];

    console.log('✅ sanitized ids:', ids); // ← これでログを見て確認

    return this.questionRepository.find({
      where: { id: In(ids) },
      order: { created_at: 'DESC' },
    });
  }
}
