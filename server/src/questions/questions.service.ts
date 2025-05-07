import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  //質問を新規作成
  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    userId: number,
  ): Promise<Question> {
    const question = this.questionRepository.create({
      ...createQuestionDto,
      user: { id: userId } as User,
    });
    return await this.questionRepository.save(question);
  }

  //質問を全て取得
  async getAllQuestions(): Promise<Question[]> {
    return await this.questionRepository.find({
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
  }

  //自分の質問を取得
  async getMyQuestions(userId: number): Promise<Question[]> {
    return await this.questionRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  //質問をIDで取得
  async getQuestionById(questionId: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['user'],
    });
    if (!question) {
      throw new Error('Question not found');
    }
    return question;
  }

  async getFilteredQuestions(
    tag?: string,
    status?: string,
  ): Promise<Question[]> {
    const query = this.questionRepository.createQueryBuilder('question');
    if (tag) {
      query.andWhere(':tag = ANY(question.tags)', { tag });
    }
    if (status) {
      query.andWhere('question.status = :status', { status });
    }
    query.orderBy('question.created_at', 'DESC');
    return await query.getMany();
  }
}
