import { Test, TestingModule } from '@nestjs/testing';
import { RouteRoleController } from './route-role.controller';

describe('RouteRoleController', () => {
  let controller: RouteRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteRoleController],
    }).compile();

    controller = module.get<RouteRoleController>(RouteRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
