import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  // Get all permissions
  async getPermissions() {
    return this.prisma.permission.findMany();
  }

  // Create a new permission
  async createPermission(data: CreatePermissionDto) {
    return this.prisma.permission.create({
      data,
    });
  }

  // Assign a permission to a role
  async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: permissionIds.map((permissionId) => ({ id: permissionId })),
        },
      },
      include: { permissions: true },
    });
  }

  // Remove a permission from a role
  async removePermissionsFromRole(roleId: string, permissionIds: string[]) {
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          disconnect: permissionIds.map((permissionId) => ({ id: permissionId })),
        },
      },
      include: { permissions: true },
    });
  }
}
