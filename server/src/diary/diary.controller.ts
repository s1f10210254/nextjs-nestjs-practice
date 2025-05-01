import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('user/:user_id')
  findAllByUser(@Param('user_id') user_id: number) {
    return this.diaryService.findALLByUser(user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.diaryService.findOne(id);
  }

  @Post()
  create(@Body() CreateDiaryDto: CreateDiaryDto) {
    return this.diaryService.create(CreateDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.diaryService.remove(id);
  }
}
