import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  answer_content: string;

  @IsNumber()
  questionId: number;

  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean;
}
