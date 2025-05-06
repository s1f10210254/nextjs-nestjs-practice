import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDiaryDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  weather?: string;

  @IsOptional()
  @IsEnum(['red', 'orange', 'yellow', 'green', 'blue'])
  color?: 'red' | 'orange' | 'yellow' | 'green' | 'blue';

  @IsNotEmpty()
  @IsString()
  recorded_content: string;

  @IsOptional()
  @IsString()
  ai_advice_content?: string;

  @IsOptional()
  @IsString()
  tags?: string;
}
