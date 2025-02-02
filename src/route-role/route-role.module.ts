import { Module } from '@nestjs/common';
import { RouteRoleController } from './route-role.controller';
import { RouteRoleService } from './route-role.service';

@Module({
  controllers: [RouteRoleController],
  providers: [RouteRoleService]
})
export class RouteRoleModule {}
