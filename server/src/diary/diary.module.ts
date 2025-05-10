import { forwardRef, Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VectorModule } from 'src/vector/vector.module';
import { RagModule } from 'src/rag/rag.module';
import { Diary } from './entities/diary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
    VectorModule,
    forwardRef(() => RagModule),
  ],
  providers: [DiaryService],
  controllers: [DiaryController],
  exports: [DiaryService],
})
export class DiaryModule {}
