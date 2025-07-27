import { Test, TestingModule } from '@nestjs/testing';
import { GroupBuysService } from './group-buys.service';

describe('GroupBuysService', () => {
  let service: GroupBuysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupBuysService],
    }).compile();

    service = module.get<GroupBuysService>(GroupBuysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
