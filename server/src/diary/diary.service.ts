import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { Repository } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

  //指定ユーザー＋指定日付の日記を取得するメソッド
  async findDiaryForUserOnDate(
    userId: number,
    date: string,
  ): Promise<Diary | null> {
    return this.diaryRepository.findOne({
      where: { user: { id: userId }, date },
      relations: ['user'],
    });
  }

  //IDで日記を取得するメソッド
  async findDiaryById(diaryId: number): Promise<Diary> {
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
      relations: ['user'],
    });
    if (!diary) throw new NotFoundException('Diary not found');
    return diary;
  }

  //日記を新規作成するメソッド
  async saveNewDiaryForUserOnDate(
    userId: number,
    date: string,
    dto: CreateDiaryDto,
  ): Promise<Diary> {
    const diary = this.diaryRepository.create({
      ...dto,
      date,
      user: { id: userId },
    });

    return this.diaryRepository.save(diary);
  }

  //日記を更新するメソッド
  async updateDiaryForUserOnDate(
    userId: number,
    date: string,
    dto: UpdateDiaryDto,
  ): Promise<Diary> {
    const diary = await this.findDiaryForUserOnDate(userId, date);
    if (!diary) throw new NotFoundException('日記が存在しません');

    await this.diaryRepository.update(diary.id, dto);
    return this.findDiaryById(diary.id);
  }

  async remove(id: number): Promise<void> {
    await this.diaryRepository.delete(id);
  }
}
