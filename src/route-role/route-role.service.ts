import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateRouteRolesDto } from './dto/update-route-roles.dto';

@Injectable()
export class RouteRoleService {
  constructor(private prisma: PrismaService) {}

  // Update roles for a route
  async updateRouteRoles(data: UpdateRouteRolesDto) {
    const { route, roles } = data;

    const routeRole = await this.prisma.routeRole.upsert({
      where: { route },
      update: { roles },
      create: { route, roles },
    });

    return routeRole;
  }

  // Get roles for a route
  async getRouteRoles(route: string) {
    const routeRole = await this.prisma.routeRole.findUnique({
      where: { route },
    });

    return routeRole?.roles || [];
  }
}