import { PartialType } from '@nestjs/mapped-types';
import { CreateDiaryDto } from './create-diary.dto';
import { TAG_OPTIONS } from '../entities/diary.entity';

export class UpdateDiaryDto extends PartialType(CreateDiaryDto) {
  tags: (typeof TAG_OPTIONS)[number][] = [];
}
