import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  // Create a new role and assign permissions
  async createRole(data: CreateRoleDto) {
    const { name, description, permissionIds } = data;

    // Create the role
    const role = await this.prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create: permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      },
    });

    return role;
  }

  // Assign a role to a user
  async assignRole(data: AssignRoleDto) {
    const { userId, roleId } = data;

    // Check if the user and role exist
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });

    if (!user || !role) {
      throw new Error('User or role not found');
    }

    // Assign the role to the user
    const userRole = await this.prisma.userRole.create({
      data: {
        user: { connect: { id: userId } },
        role: { connect: { id: roleId } },
      },
    });

    return userRole;
  }

  // Get all roles
  async getRoles() {
    return this.prisma.role.findMany({
      include: { permissions: true },
    });
  }
}