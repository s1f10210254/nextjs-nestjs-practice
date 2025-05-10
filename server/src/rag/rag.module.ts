import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from 'src/diary/entities/diary.entity';
import { VectorModule } from 'src/vector/vector.module';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { DiaryModule } from 'src/diary/diary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
    VectorModule,
    forwardRef(() => DiaryModule),
  ],
  providers: [RagService],
  exports: [RagService],
  controllers: [RagController],
})
export class RagModule {}
