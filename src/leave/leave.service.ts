import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  // Apply for leave
  async applyForLeave(userId: string, data: ApplyLeaveDto) {
    const leave = await this.prisma.leave.create({
      data: {
        userId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
      },
    });
    return leave;
  }

  // Get leave requests for a user
  async getLeaveRequests(userId: string) {
    return this.prisma.leave.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get all leave requests (for HR/Managers)
  async getAllLeaveRequests() {
    return this.prisma.leave.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Approve or reject a leave request
  async updateLeaveStatus(data: UpdateLeaveStatusDto) {
    const leave = await this.prisma.leave.update({
      where: { id: data.leaveId },
      data: {
        status: data.status,
        approvedBy: data.approvedById,
      },
    });
    return leave;
  }
}
