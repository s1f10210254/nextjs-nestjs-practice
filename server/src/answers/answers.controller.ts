import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JWTPayload } from 'src/common/interface/JWTPayload.interface';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  // 質問に対する回答を新規作成
  @UseGuards(AuthGuard)
  @Post()
  createAnswer(@Body() dto: CreateAnswerDto, @CurrentUser() user: JWTPayload) {
    return this.answersService.createAnswer(dto, user.sub);
  }

  // 質問IDで回答を取得
  @Public()
  @Get()
  getAnswersByQuestionId(@Query('questionId') questionId: string) {
    return this.answersService.getAnswersByQuestionId(+questionId);
  }
}
