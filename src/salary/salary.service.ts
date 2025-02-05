import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaveStatus } from '../common/constants/leave-status.enum';

@Injectable()
export class SalaryService {
  constructor(private prisma: PrismaService) {}

  // Allocate leaves for a role
  async allocateLeaves(roleId: string, allocatedLeaves: number) {
    return this.prisma.role.update({
      where: { id: roleId },
      data: { allocatedLeaves },
    });
  }

  // Calculate salary for a user
  async calculateSalary(userId: string, month: string, year: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        Leave: {
          where: {
            status: LeaveStatus.APPROVED,
            startDate: {
              gte: new Date(`${year}-${this.getMonthNumber(month)}-01`),
              lt: new Date(
                `${year}-${this.getMonthNumber(month) + 1}-01`,
              ),
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const baseSalary = 30000; // Example base salary (can be fetched dynamically)
    const perDayDeduction = baseSalary / 30; // Assuming 30 days in a month

    const allocatedLeaves = user.role.allocatedLeaves || 0;
    const approvedLeaves = user.Leave.length;

    const excessLeaves = Math.max(0, approvedLeaves - allocatedLeaves);
    const deductions = excessLeaves * perDayDeduction;
    const netSalary = baseSalary - deductions;

    // Save the calculated salary
    return this.prisma.salary.create({
      data: {
        userId,
        amount: baseSalary,
        deductions,
        netSalary,
        month,
        year,
      },
    });
  }

  // Helper function to convert month name to number
  private getMonthNumber(month: string): number {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months.indexOf(month);
  }
}