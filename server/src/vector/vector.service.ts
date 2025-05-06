import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { qdrantClient } from './qdrant.client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VectorService {
  private openai: OpenAI;
  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  }

  async saveEmbedding(diary: {
    diaryId: number;
    userId: number;
    date: string;
    content: string;
  }) {
    const vector = await this.generateEmbedding(diary.content);
    await qdrantClient.upsert('diary_entries', {
      wait: true,
      points: [
        {
          id: diary.diaryId.toString(),
          vector,
          payload: {
            user_id: diary.userId,
            date: diary.date,
            content: diary.content,
          },
        },
      ],
    });
  }
}
