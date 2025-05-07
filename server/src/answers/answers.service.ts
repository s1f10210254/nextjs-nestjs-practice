import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  // 質問に対する回答を新規作成
  async createAnswer(dto: CreateAnswerDto, userId: number): Promise<Answer> {
    console.log('userId', userId);
    const question = await this.questionRepository.findOneBy({
      id: dto.questionId,
    });
    console.log('question', question);
    if (!question) throw new Error('Question not found');

    const answer = this.answerRepository.create({
      content: dto.content,
      user: { id: userId } as User,
      question,
      is_anonymous: dto.is_anonymous ?? false,
    });
    console.log('answer', answer);

    return await this.answerRepository.save(answer);
  }

  // 質問IDで回答を取得
  async getAnswersByQuestionId(questionId: number): Promise<Answer[]> {
    return await this.answerRepository.find({
      where: { question: { id: questionId } },
      order: { created_at: 'ASC' },
      relations: ['user'],
    });
  }
}
