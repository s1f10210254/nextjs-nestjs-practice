import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { Repository } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { VectorService } from 'src/vector/vector.service';
import { RagService } from 'src/rag/rag.service';
import { mapColorToEmotion } from 'src/common/utils/emotion.util';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly vectorService: VectorService,
    private readonly ragService: RagService,
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
  ): Promise<{ diary: Diary; similarDiaries: Diary[] }> {
    const diary = this.diaryRepository.create({
      ...dto,
      date,
      user: { id: userId },
    });
    const emotion = mapColorToEmotion(dto.color);

    // 1：日記保存
    const savedDiary = await this.diaryRepository.save(diary);

    // 2: VDBに保存
    await this.vectorService.saveToQdrant({
      diaryId: savedDiary.id,
      userId: savedDiary.user.id,
      date: savedDiary.date,
      content: savedDiary.recorded_content,
      tags: savedDiary.tags,
      emotion: emotion,
    });

    // 3:AIアドバイスを生成して保存(+Qdrantにも保存)
    const { advice, similarDiaries } =
      await this.ragService.generateAndStoreAdviceForDiary({
        diaryId: savedDiary.id,
        date: savedDiary.date,
        userId: savedDiary.user.id,
        content: savedDiary.recorded_content,
        emotion: emotion,
        tags: savedDiary.tags,
      });

    //4: AIアドバイスを日記に保存
    savedDiary.ai_advice_content = advice;
    await this.diaryRepository.save(savedDiary);
    return {
      diary: savedDiary,
      similarDiaries,
    };
  }

  //日記を更新するメソッド
  async updateDiaryForUserOnDate(
    userId: number,
    date: string,
    dto: UpdateDiaryDto,
  ): Promise<{ diary: Diary; similarDiaries: Diary[] }> {
    const diary = await this.findDiaryForUserOnDate(userId, date);
    if (!diary) throw new NotFoundException('日記が存在しません');

    const content = dto.recorded_content ?? '';
    const tags = dto.tags ?? [];
    const color = dto.color ?? diary.color;

    // 感情変換
    const emotion = mapColorToEmotion(color);

    //1 内容更新
    await this.diaryRepository.update(diary.id, {
      ...dto,
    });

    //2: ベクトル再生成、Qdrant更新
    await this.vectorService.saveToQdrant({
      diaryId: diary.id,
      userId: diary.user.id,
      date: diary.date,
      content: content,
      tags: dto.tags,
      emotion: emotion,
    });

    //3: AIアドバイスを生成しnestて保存(+Qdrantにも保存)
    const { advice, similarDiaries } =
      await this.ragService.generateAndStoreAdviceForDiary({
        diaryId: diary.id,
        userId: diary.user.id,
        date: diary.date,
        content: content,
        emotion: emotion,
        tags: tags,
      });

    //4: AIアドバイスを日記に保存
    await this.diaryRepository.update(diary.id, {
      ai_advice_content: advice,
    });

    // 更新済みDiaryを再取得して返却
    const updatedDiary = await this.findDiaryById(diary.id);
    return {
      diary: updatedDiary,
      similarDiaries,
    };
  }

  async remove(id: number): Promise<void> {
    await this.diaryRepository.delete(id);
  }
}
