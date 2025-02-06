import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // Record attendance
  async createAttendance(data: CreateAttendanceDto) {
    return this.prisma.attendance.create({
      data: {
        userId: data.userId,
        date: data.date,
        status: data.status,
        loginTime: data.loginTime,
        logoutTime: data.logoutTime,
        isLate: this.isLate(data.loginTime),
        isEarlyLogout: this.isEarlyLogout(data.logoutTime),
      },
    });
  }

  // View attendance for a specific user or all users within a date range
  async getAttendance(userId?: string, startDate?: Date, endDate?: Date) {
    return this.prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { user: true },
    });
  }

  // Fetch attendance for the logged-in user
  async getMyAttendance(userId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  // Update attendance
  async updateAttendance(id: string, data: UpdateAttendanceDto) {
    return this.prisma.attendance.update({
      where: { id },
      data: {
        status: data.status,
        loginTime: data.loginTime,
        logoutTime: data.logoutTime,
        isLate: data.isLate ?? this.isLate(data.loginTime),
        isEarlyLogout: data.isEarlyLogout ?? this.isEarlyLogout(data.logoutTime),
      },
    });
  }

  // Helper method to determine if the user is late
  private isLate(loginTime?: Date): boolean {
    if (!loginTime) return false;
    const standardLoginTime = new Date(loginTime);
    standardLoginTime.setHours(9, 0, 0, 0); // Standard login time: 9:00 AM
    return loginTime > standardLoginTime;
  }

  // Helper method to determine if the user logged out early
  private isEarlyLogout(logoutTime?: Date): boolean {
    if (!logoutTime) return false;
    const standardLogoutTime = new Date(logoutTime);
    standardLogoutTime.setHours(17, 0, 0, 0); // Standard logout time: 5:00 PM
    return logoutTime < standardLogoutTime;
  }
}