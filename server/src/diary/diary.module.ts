import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { VectorModule } from 'src/vector/vector.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary]), VectorModule],
  providers: [DiaryService],
  controllers: [DiaryController],
})
export class DiaryModule {}
