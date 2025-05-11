import { Test, TestingModule } from '@nestjs/testing';
import { QuestionRecommendationService } from './question-recommendation.service';

describe('QuestionRecommendationService', () => {
  let service: QuestionRecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionRecommendationService],
    }).compile();

    service = module.get<QuestionRecommendationService>(QuestionRecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
