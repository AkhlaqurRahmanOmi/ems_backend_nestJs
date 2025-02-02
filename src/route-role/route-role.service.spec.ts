import { Test, TestingModule } from '@nestjs/testing';
import { RouteRoleService } from './route-role.service';

describe('RouteRoleService', () => {
  let service: RouteRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteRoleService],
    }).compile();

    service = module.get<RouteRoleService>(RouteRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
