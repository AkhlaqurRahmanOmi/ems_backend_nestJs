import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Get the logged-in user's profile
  async getMyProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        address: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // Get all users (HR/Admin only)
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        address: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // Update the logged-in user's profile
  async updateMyProfile(userId: string, data: UpdateUserProfileDto) {
    const updateData = await this.prepareUpdateData(data);
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  // Update another user's profile (HR/Admin only)
  async updateUserProfile(userId: string, data: UpdateUserProfileDto) {
    const updateData = await this.prepareUpdateData(data);
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  // Helper method to prepare update data
  private async prepareUpdateData(data: UpdateUserProfileDto) {
    const updateData: any = {};

    // Map DTO fields to database fields
    const fieldMapping = {
      name: 'name',
      email: 'email',
      phoneNumber: 'phoneNumber',
      address: 'address',
      joinDate: 'joinDate',
      department: 'department',
    };

    // Dynamically populate updateData based on provided fields
    for (const [dtoField, dbField] of Object.entries(fieldMapping)) {
      if (data[dtoField]) {
        updateData[dbField] =
          dtoField === 'joinDate' ? new Date(data[dtoField]) : data[dtoField];
      }
    }

    // Handle password hashing
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // Validate and update the role dynamically
    if (data.roleName) {
      const role = await this.prisma.role.findUnique({
        where: { name: data.roleName },
      });

      if (!role) {
        throw new Error(`Role "${data.roleName}" does not exist`);
      }

      updateData.roleId = role.id; // Assign the role ID
    }

    return updateData;
  }
}