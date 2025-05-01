import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDiaryDto {
  @IsInt()
  user_id: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  weather?: string;

  @IsOptional()
  @IsString()
  mood_color?: string;

  @IsNotEmpty()
  @IsString()
  recorded_content: string;

  @IsOptional()
  @IsString()
  ai_advice_content?: string;
}
