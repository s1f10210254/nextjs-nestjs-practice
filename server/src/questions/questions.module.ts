import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { User } from 'src/users/user.entity';
import { QuestionRecommendationService } from 'src/question-recommendation/question-recommendation.service';
import { VectorService } from 'src/vector/vector.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User])],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionRecommendationService, VectorService],
})
export class QuestionsModule {}
