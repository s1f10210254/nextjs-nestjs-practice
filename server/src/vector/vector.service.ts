/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { qdrantClient } from './qdrant.client';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class VectorService {
  private ai: GoogleGenAI;
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  // テキストをEmbeddingするメソッド
  async generateEmbedding(text: string): Promise<number[]> {
    console.log('Generating embedding for text:', text);
    console.log(
      'Gemini API Key:',
      this.configService.get<string>('GEMINI_API_KEY'),
    );
    const result = await this.ai.models.embedContent({
      model: 'gemini-embedding-exp-03-07',
      contents: text,
      config: {
        taskType: 'SEMANTIC_SIMILARITY',
      },
    });
    console.log('Gemini embedding response:', result);
    console.log('Embedding response:', result.embeddings);
    if (
      result === undefined ||
      result.embeddings === undefined ||
      result.embeddings[0].values === undefined
    )
      return [];

    //取得したベクトルを数値の配列に変換;
    const vector = result.embeddings[0].values.map((value: any) => {
      if (typeof value === 'number') {
        return value;
      } else if (typeof value === 'string') {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
          return parsedValue;
        } else {
          throw new Error(`Invalid value in vector: ${value}`);
        }
      } else {
        throw new Error(`Invalid value type in vector: ${typeof value}`);
      }
    });

    return vector;
  }

  // Qdrantにコレクションが存在しない場合は作成するメソッド
  async createCollection(collectionName: string) {
    // const collectionName = 'diary_entries';
    const listCollections = await qdrantClient.getCollections();
    if (listCollections.collections.some((c) => c.name === collectionName)) {
      console.log(`❌ コレクション '${collectionName}' は既に存在します`);
      return;
    }

    console.log(`✅ コレクション '${collectionName}' は存在しません`);

    // コレクションを作成
    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: 3072, // 使うEmbeddingに合わせてサイズを設定（例: OpenAIは1536）
        distance: 'Cosine', // 類似度計算方法: Cosine, Euclidean, Dot
      },
    });

    console.log(`✅ コレクション '${collectionName}' を作成しました`);
  }

  // Qdrantに日記を保存するメソッド
  async saveToQdrant(diary: {
    diaryId: number;
    userId: number;
    date: string;
    content: string;
    tags?: string[];
    emotion?: number;
  }) {
    const vector = await this.generateEmbedding(diary.content);

    const collectionName = 'diary_entries';
    //Collectionが存在しない場合は作成;
    await this.createCollection(collectionName);

    await qdrantClient.upsert(collectionName, {
      wait: true,
      points: [
        {
          id: diary.diaryId,
          vector: vector,
          payload: {
            userId: diary.userId,
            date: diary.date,
            content: diary.content,
            tags: diary.tags,
            emotion: diary.emotion,
          },
        },
      ],
    });
  }

  // Qdrantから日記を取得するメソッド
  async searchDiaryToQdrant(params: {
    vector: number[];
    filter: any;
    topK?: number;
  }) {
    return qdrantClient.search('diary_entries', {
      vector: params.vector,
      filter: params.filter,
      limit: params.topK ?? 5,
    });
  }

  // 質問の内容をQdrantに保存するメソッド
  async saveQuestionToQdrant(question: {
    questionId: number;
    userId: number;
    date: string;
    content: string;
    tags?: string[];
  }) {
    const collectionName = 'question_entries';
    const embedding = await this.generateEmbedding(question.content);
    await this.createCollection(collectionName);

    await qdrantClient.upsert(collectionName, {
      wait: true,
      points: [
        {
          id: question.questionId,
          vector: embedding,
          payload: {
            userId: question.userId,
            date: question.date,
            content: question.content,
            tags: question.tags,
          },
        },
      ],
    });
  }

  async searchQuestionToQdrant(vector: number[], tags: string[], topK = 5) {
    return qdrantClient.search('question_entries', {
      vector: vector,
      filter: {
        tags: {
          $in: tags,
        },
      },
      limit: topK,
    });
  }

  // AIからアドバイスを生成するメソッド
  async generateAdviceFromPrompt(prompt: string): Promise<string> {
    const result = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    console.log('Gemini advice response:', result.text);
    if (result === undefined || result.text === undefined) {
      throw new Error('Failed to generate advice');
    }
    return result.text;
  }
}
