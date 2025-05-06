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

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

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
    return diary;
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
    return await this.diaryService.saveNewDiaryForUserOnDate(
      user.sub,
      date,
      dto,
    );
  }

  @Put(':date')
  async updateDiary(
    @Param('date') date: string,
    @Body() dto: CreateDiaryDto,
    @CurrentUser() user: JWTPayload,
  ) {
    return this.diaryService.updateDiaryForUserOnDate(user.sub, date, dto);
  }
}
