import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RouteRoleService } from './route-role.service';
import { UpdateRouteRolesDto } from './dto/update-route-roles.dto';

@Controller('route-roles')
export class RouteRoleController {
  constructor(private readonly routeRoleService: RouteRoleService) {}

  // Update roles for a route (Admin only)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN') // Only ADMIN can access this route
  updateRouteRoles(@Body() body: UpdateRouteRolesDto) {
    return this.routeRoleService.updateRouteRoles(body);
  }

  // Get roles for a route
  @Get(':route')
  @UseGuards(AuthGuard('jwt'))
  getRouteRoles(@Param('route') route: string) {
    return this.routeRoleService.getRouteRoles(route);
  }
}
