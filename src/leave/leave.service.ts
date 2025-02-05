import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { LeaveStatus } from '../common/constants/leave-status.enum';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  // Apply for leave
  async applyForLeave(userId: string, data: ApplyLeaveDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const allocatedLeaves = user.role.allocatedLeaves || 0;
    const usedLeaves = await this.prisma.leave.count({
      where: {
        userId,
        status: LeaveStatus.APPROVED,
        startDate: { gte: new Date(new Date().getFullYear(), 0, 1) }, // From January 1st of the current year
      },
    });

    const requestedDays = this.calculateLeaveDays(data.startDate, data.endDate);
    if (usedLeaves + requestedDays > allocatedLeaves) {
      throw new Error('You have exceeded your allocated leave balance');
    }


    return this.prisma.leave.create({
      data: {
        userId,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      },
    });
  }

  // Approve or reject leave
  async updateLeaveStatus(leaveId: string, data: UpdateLeaveStatusDto) {
    return this.prisma.leave.update({
      where: { id: leaveId },
      data: {
        status: data.status,
        approvedBy: data.status === LeaveStatus.APPROVED ? 'admin-id' : null, // Replace 'admin-id' with actual admin ID
      },
    });
  }

  // Get leave history for the logged-in user
  async getLeaveHistory(userId: string) {
    return this.prisma.leave.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  // Helper function to calculate leave days
  private calculateLeaveDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
  }
}