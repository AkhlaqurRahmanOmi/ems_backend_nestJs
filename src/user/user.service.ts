import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Create a new user
  async createUser(data: CreateUserDto) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Fetch the role by name
    const role = await this.prisma.role.findUnique({
      where: { name: data.roleName },
    });

    if (!role) {
      throw new Error(`Role "${data.roleName}" does not exist`);
    }

    // Generate a unique employee ID if the role is "EMPLOYEE"
    let employeeId: string | undefined;
    if (data.roleName === 'EMPLOYEE') {
      employeeId = await this.generateEmployeeId(new Date(data.joinDate));
    }

    // Create the user in the database
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: role.id,
        joinDate: new Date(data.joinDate),
        employeeId, // Assign only if the role is "EMPLOYEE"
      },
    });
  }

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

  // Generate a unique employee ID
  private async generateEmployeeId(joinDate: Date): Promise<string> {
    const formattedDate = this.formatDate(joinDate); // Format as MMDDYY
    const employeeCount = await this.prisma.user.count(); // Count existing employees

    // Increment the count and pad it with leading zeros
    const paddedCount = String(employeeCount + 1).padStart(3, '0');

    return `EMP${formattedDate}${paddedCount}`;
  }

  // Helper method to format the date as MMDDYY
  private formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}${day}${year}`;
  }
}