import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TAG_OPTIONS } from '../entities/diary.entity';

export class CreateDiaryDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  weather?: string;

  @IsEnum(['red', 'orange', 'yellow', 'green', 'blue'])
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue';

  @IsNotEmpty()
  @IsString()
  recorded_content: string;

  @IsOptional()
  @IsString()
  ai_advice_content: string = '';

  @IsOptional()
  @IsArray()
  @IsEnum(TAG_OPTIONS, { each: true })
  tags: (typeof TAG_OPTIONS)[number][] = [];
}
