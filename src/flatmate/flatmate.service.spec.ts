import { Test, TestingModule } from '@nestjs/testing';
import { FlatmateService } from './flatmate.service';

describe('FlatmateService', () => {
  let service: FlatmateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlatmateService],
    }).compile();

    service = module.get<FlatmateService>(FlatmateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
