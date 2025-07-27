import { Test, TestingModule } from '@nestjs/testing';
import { GroupBuysController } from './group-buys.controller';

describe('GroupBuysController', () => {
  let controller: GroupBuysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupBuysController],
    }).compile();

    controller = module.get<GroupBuysController>(GroupBuysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
