import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JWTPayload } from 'src/common/interface/JWTPayload.interface';
import { Public } from 'src/auth/decorators/public.decorator';
import { QuestionRecommendationService } from 'src/question-recommendation/question-recommendation.service';

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly recommendationService: QuestionRecommendationService,
  ) {}

  // 質問を新規作成
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createQuestionDto: CreateQuestionDto,
    @CurrentUser() currentUser: JWTPayload,
  ) {
    return this.questionsService.createQuestion(
      createQuestionDto,
      currentUser.sub,
    );
  }

  // おすすめの質問を取得（キャッシュ済みのIDを使用）
  @UseGuards(AuthGuard)
  @Get('recommend')
  async getRecommendedQuestions(@CurrentUser() user: JWTPayload) {
    return this.recommendationService.getRecommendedQuestions(user.sub);
  }

  //おすすめの質問を再生成(embedding-> qdrant検索-> ID保存)
  @UseGuards(AuthGuard)
  @Post('recommend/regenerate')
  async regenerateRecommendations(@CurrentUser() user: JWTPayload) {
    const ids = await this.recommendationService.regenerateForUser(user.sub);
    return { message: 'おすすめ質問を再生成しました', ids };
  }

  // 自分の質問を取得
  @UseGuards(AuthGuard)
  @Get('mine')
  getMyQuestions(@CurrentUser() user: JWTPayload) {
    return this.questionsService.getMyQuestions(user.sub);
  }

  // 質問をIDで取得
  @Public()
  @Get(':id')
  getQuestionById(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('IDが不正です');
    }
    return this.questionsService.getQuestionById(numericId);
  }

  // 質問をフィルタリングして取得
  @Public()
  @Get()
  getFilteredQuestions(
    @Query('tag') tag?: string,
    @Query('status') status?: string,
  ) {
    return this.questionsService.getFilteredQuestions(tag, status);
  }
}
