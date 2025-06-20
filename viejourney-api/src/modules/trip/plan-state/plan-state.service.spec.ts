import { Test, TestingModule } from '@nestjs/testing';
import { PlanStateService } from './plan-state.service';

describe('PlanStateService', () => {
  let service: PlanStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanStateService],
    }).compile();

    service = module.get<PlanStateService>(PlanStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
