import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Repository } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
  ) {}

  findALLByUser(user_id: number) {
    return this.diaryRepository.find({
      where: { user_id: user_id },
      order: { date: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.diaryRepository.findOne({
      where: { diary_id: id },
    });
  }

  create(createDiaryDto: CreateDiaryDto) {
    const diary = this.diaryRepository.create(createDiaryDto);
    return this.diaryRepository.save(diary);
  }

  //   update(id: number, updateDiaryDto: UpdateDiaryDto) {
  //     return this.diaryRepository.update(id, updateDiaryDto);
  //   }

  remove(id: number) {
    return this.diaryRepository.delete(id);
  }
}
