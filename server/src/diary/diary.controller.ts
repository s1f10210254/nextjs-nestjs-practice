import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DiaryService } from './diary.service';

import { CreateDiaryDto } from './dto/create-diary.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JWTPayload } from 'src/common/interface/JWTPayload.interface';
import { RagService } from 'src/rag/rag.service';
import { mapColorToEmotion } from 'src/common/utils/emotion.util';

@Controller('diary')
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly ragService: RagService,
  ) {}

  @Get(':date')
  async getDiaryByDate(
    @Param('date') date: string,
    @CurrentUser() user: JWTPayload,
  ) {
    const diary = await this.diaryService.findDiaryForUserOnDate(
      user.sub,
      date,
    );
    if (!diary) throw new NotFoundException('指定された日の日記は存在しません');

    const emotion = mapColorToEmotion(diary.color);
    const similarDiaries = await this.ragService.findSimilarUserDiaries({
      userId: user.sub,
      date: diary.date,
      content: diary.recorded_content,
      tags: diary.tags ?? [],
      emotion,
    });

    return {
      diary,
      similarDiaries: similarDiaries.map((d) => ({
        id: d.id,
        date: d.date,
        content: d.recorded_content,
        tags: d.tags,
      })),
    };
  }

  // 新規作成
  @Post(':date')
  async createDiary(
    @Param('date') date: string,
    @Body() dto: CreateDiaryDto,
    @CurrentUser() user: JWTPayload,
  ) {
    const existing = await this.diaryService.findDiaryForUserOnDate(
      user.sub,
      date,
    );
    if (existing) throw new ConflictException('この日の日記はすでに存在します');

    const { diary, similarDiaries } =
      await this.diaryService.saveNewDiaryForUserOnDate(user.sub, date, dto);

    return {
      diary,
      similarDiaries: similarDiaries.map((d) => ({
        id: d.id,
        date: d.date,
        content: d.recorded_content,
        tags: d.tags,
      })),
    };
  }

  @Put(':date')
  async updateDiary(
    @Param('date') date: string,
    @Body() dto: CreateDiaryDto,
    @CurrentUser() user: JWTPayload,
  ) {
    const { diary, similarDiaries } =
      await this.diaryService.updateDiaryForUserOnDate(user.sub, date, dto);

    return {
      diary,
      similarDiaries: similarDiaries.map((d) => ({
        id: d.id,
        date: d.date,
        content: d.recorded_content,
        tags: d.tags,
      })),
    };
  }
}
