import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  // Create a new permission
  async createPermission(data: CreatePermissionDto) {
    return this.prisma.permission.create({
      data,
    });
  }

  // Assign a permission to a role
  async assignPermission(data: AssignPermissionDto) {
    const { roleId, permissionId } = data;

    return this.prisma.rolePermission.create({
      data: {
        role: { connect: { id: roleId } },
        permission: { connect: { id: permissionId } },
      },
    });
  }

  // Remove a permission from a role
  async removePermission(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.delete({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
  }
}
