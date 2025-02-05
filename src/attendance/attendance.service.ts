import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // Helper function to parse time strings (e.g., "09:00")
  private parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set time to the specified hour and minute
    return date;
  }

  // Mark attendance for the logged-in user
  async markAttendance(userId: string, status: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of the day

    // Validate the status against the AttendanceStatus enum
    if (!Object.values(AttendanceStatus).includes(status as AttendanceStatus)) {
      throw new Error('Invalid attendance status');
    }

    // Expected login time (e.g., 9:00 AM)
    const EXPECTED_LOGIN_TIME = this.parseTime(process.env.EXPECTED_LOGIN_TIME || '09:00');

    // Check if attendance already exists for today
    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // End of the day
        },
      },
    });

    if (existingAttendance) {
      throw new Error('Attendance already marked for today');
    }

    // Check if the user is late
    const currentTime = new Date();
    const isLate = currentTime > EXPECTED_LOGIN_TIME;

    // Create a new attendance record
    return this.prisma.attendance.create({
      data: {
        userId,
        date: new Date(),
        status: status as AttendanceStatus, // Cast to AttendanceStatus
        loginTime: currentTime,
        isLate,
      },
    });
  }

  // Log out the user and update logout time
  async logout(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of the day

    // Expected logout time (e.g., 5:00 PM)
    const EXPECTED_LOGOUT_TIME = this.parseTime(process.env.EXPECTED_LOGOUT_TIME || '17:00');

    // Find today's attendance record
    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // End of the day
        },
      },
    });

    if (!attendance) {
      throw new Error('No attendance record found for today');
    }

    if (attendance.logoutTime) {
      throw new Error('You have already logged out today');
    }

    // Check if the user is logging out early
    const currentTime = new Date();
    const isEarlyLogout = currentTime < EXPECTED_LOGOUT_TIME;

    // Update the logout time
    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        logoutTime: currentTime,
        isEarlyLogout,
      },
    });
  }

  // Get attendance history for the logged-in user
  async getMyAttendance(userId: string) {
    return this.prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' }, // Order by date in descending order
    });
  }
}