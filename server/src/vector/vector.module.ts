import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';

@Module({})
export class VectorModule {
  private: [VectorService];
  exports: [VectorService];
}
