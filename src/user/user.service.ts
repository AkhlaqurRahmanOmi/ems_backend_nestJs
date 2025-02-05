import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
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
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  // Update another user's profile (HR/Admin only)
  async updateUserProfile(userId: string, data: UpdateUserProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}