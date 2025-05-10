import { Controller, Param, Post } from '@nestjs/common';
import { RagService } from './rag.service';
import { DiaryService } from 'src/diary/diary.service';

@Controller('rag')
export class RagController {
  constructor(
    private readonly ragService: RagService,
    private readonly diaryService: DiaryService,
  ) {}

  @Post('advice/:diaryId')
  async regenerateAdvice(@Param('diaryId') diaryId: number) {
    const diary = await this.diaryService.findDiaryById(diaryId);

    const emotion = mapColorToEmotion(diary.color);
    const { advice, similarDiaries } =
      await this.ragService.generateAndStoreAdviceForDiary({
        diaryId,
        userId: diary.user.id,
        content: diary.recorded_content,
        tags: diary.tags,
        emotion: emotion,
      });
    return {
      advice,
      diaryId,
      similarDiaries: similarDiaries.map((d) => ({
        id: d.id,
        date: d.date,
        content: d.recorded_content,
        tags: d.tags,
      })),
    };
  }
}

function mapColorToEmotion(color: string): number {
  const map: Record<string, number> = {
    red: 1,
    blue: 2,
    green: 3,
    orange: 4,
    yellow: 5,
  };
  return map[color] ?? 3;
}
