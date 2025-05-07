import {
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

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

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
    return this.questionsService.getQuestionById(+id);
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
