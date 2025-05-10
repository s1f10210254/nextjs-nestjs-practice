import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from 'src/diary/entities/diary.entity';
import { VectorService } from 'src/vector/vector.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class RagService {
  constructor(
    private readonly vectorService: VectorService,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

  // 自分の過去の日記の中から意味が近く感情やタグも近いものを探すメソッド
  // ただし、感情は±1の範囲で、タグは一致するものを探す
  // 返り値は日記の配列(Diary[])

  async findSimilarUserDiaries(input: {
    userId: number;
    content: string;
    date: string;
    tags: string[];
    emotion: number;
  }): Promise<Diary[]> {
    const vector = await this.vectorService.generateEmbedding(input.content);

    const filter = {
      must: [
        { key: 'user_id', match: { value: input.userId } },
        {
          key: 'date',
          range: { lt: input.date },
        },
        // {
        //   key: 'emotion',
        //   range: { gte: input.emotion - 1, lte: input.emotion + 1 },
        // },
      ],
      should: input.tags.map((tag) => ({
        key: 'tags',
        match: { value: tag },
      })),
    };

    const results = await this.vectorService.searchQdrant({
      vector,
      filter,
      topK: 5,
    });
    console.log('Qdrant search results:', results);

    const ids = results.map((result) => result.id);
    // if (ids.length === 0) return [];
    return this.diaryRepository.find({
      where: { id: In(ids) },
    });
  }

  private buildAdvicePrompt(
    currentContent: string,
    similarDiaries: Diary[],
  ): string {
    const context = similarDiaries
      .map(
        (d) => `【日付: ${d.date} | タグ: ${d.tags?.join(', ') || 'なし'}】
  ${d.recorded_content}`,
      )
      .join('\n\n');

    return `
  あなたは共感的なカウンセラーです。
  以下の悩みに対して、優しく丁寧なアドバイスを300文字程度で書いてください。
  言葉選びに気を配り、ネガティブな感情を否定せず、寄り添うようにしてください。
  回答の相手は悩みを書いた本人です。
  
  【現在の悩み】
  ${currentContent}
  
  【参考になりそうな過去の悩み】
  ${context}
  
  この情報をもとに、相手が少しでも前向きな気持ちになれるようなアドバイスを作成してください。
    `.trim();
  }

  async generateAndStoreAdviceForDiary(input: {
    diaryId: number;
    userId: number;
    date: string;
    content: string;
    emotion: number;
    tags: string[];
  }): Promise<{ advice: string; similarDiaries: Diary[] }> {
    //類似日記を検索
    const similarDiaries = await this.findSimilarUserDiaries({
      userId: input.userId,
      date: input.date,
      content: input.content,
      tags: input.tags,
      emotion: input.emotion,
    });

    //プロンプト作成
    const prompt = this.buildAdvicePrompt(input.content, similarDiaries);

    //3 Geminiにプロンプトを投げてアドバイスを取得
    const advice = await this.vectorService.generateAdviceFromPrompt(prompt);
    console.log('Gemini advice:', advice);
    // 4: 日記にアドバイスを保存
    await this.diaryRepository.update(input.diaryId, {
      ai_advice_content: advice,
    });
    return {
      advice,
      similarDiaries,
    };
  }
}
