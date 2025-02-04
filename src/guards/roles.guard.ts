import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/roles.decorator'; // Import the metadata key

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService, // Inject PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Check method-level metadata
      context.getClass(),  // Check class-level metadata
    ]);

    if (isPublic) {
      return true; // Allow access to public routes
    }

    // Extract the request and user from the context
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required'); // Ensure the user is authenticated
    }

    // Extract the route path
    const route = request.route.path;

    // Fetch required roles for the route from the database
    const routeRole = await this.prisma.routeRole.findUnique({
      where: { route },
      select: { roles: true },
    });

    if (!routeRole || routeRole.roles.length === 0) {
      return true; // No roles required, allow access
    }

    // Fetch the user's role and permissions
    const userRole = await this.prisma.role.findUnique({
      where: { id: user.role.id },
      include: { permissions: true },
    });

    if (!userRole) {
      throw new ForbiddenException('User role not found');
    }

    // Extract the user's permissions
    // @ts-ignore
    const userPermissions = userRole.permissions.map((p) => p.name);

    // Check if the user has any of the required roles or permissions
    const hasPermission = routeRole.roles.some((role) => userPermissions.includes(role));
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true; // User is authorized
  }
}