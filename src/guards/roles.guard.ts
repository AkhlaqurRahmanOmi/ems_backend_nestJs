import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RouteRoleService } from '../route-role/route-role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private routeRoleService: RouteRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Extract the route path
    const route = request.route.path;

    // Fetch required roles for the route from the database
    const requiredRoles = await this.routeRoleService.getRouteRoles(route);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required, allow access
    }

    return requiredRoles.includes(user.role.name); // Check if user's role matches any required role
  }
}