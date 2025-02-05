import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateReportDto } from './dto/report.dto';
import * as ExcelJS from 'exceljs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  // Generate a report based on the type
  async generateReport(data: GenerateReportDto) {
    const { type, userId, startDate, endDate, month, year } = data;

    switch (type) {
      case 'attendance':
        return this.generateAttendanceReport(userId, startDate, endDate);
      case 'leave':
        return this.generateLeaveReport(userId, startDate, endDate);
      case 'salary':
        if (!month || !year) {
          throw new Error('Month and year are required for salary reports');
        }
        return this.generateSalaryReport(userId, month, year);
      default:
        throw new Error('Invalid report type');
    }
  }

  // Export a report to Excel
  async exportToExcel(data: any[], type: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${type} Report`);

    // Initialize headers with a default value
    let headers: string[] = [];
    if (type === 'attendance') {
      headers = ['User', 'Date', 'Status', 'Login Time', 'Logout Time'];
    } else if (type === 'leave') {
      headers = ['User', 'Type', 'Start Date', 'End Date', 'Reason', 'Status'];
    } else if (type === 'salary') {
      headers = ['User', 'Month', 'Year', 'Amount', 'Deductions', 'Net Salary'];
    }

    worksheet.addRow(headers);

    // Add rows
    data.forEach((record) => {
      const row: (string | Date | number | undefined)[] = [];
      if (type === 'attendance') {
        row.push(
          record.user?.name,
          record.date,
          record.status,
          record.loginTime,
          record.logoutTime
        );
      } else if (type === 'leave') {
        row.push(
          record.user?.name,
          record.type,
          record.startDate,
          record.endDate,
          record.reason,
          record.status
        );
      } else if (type === 'salary') {
        row.push(
          record.user?.name,
          record.month,
          record.year,
          record.amount,
          record.deductions,
          record.netSalary
        );
      }
      worksheet.addRow(row);
    });

    // Export to buffer and cast to Buffer
    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  // Export a report to PDF
  async exportToPDF(data: any[], type: string): Promise<Buffer> {
    // Initialize pdfMake with fonts
    (pdfMake as any).vfs = pdfFonts;

    // Initialize headers with a default value
    let headers: string[] = [];
    if (type === 'attendance') {
      headers = ['User', 'Date', 'Status', 'Login Time', 'Logout Time'];
    } else if (type === 'leave') {
      headers = ['User', 'Type', 'Start Date', 'End Date', 'Reason', 'Status'];
    } else if (type === 'salary') {
      headers = ['User', 'Month', 'Year', 'Amount', 'Deductions', 'Net Salary'];
    }

    // Define document content
    const documentDefinition = {
      content: [
        { text: `${type.toUpperCase()} REPORT`, style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: Array(6).fill('*'), // Adjust based on headers
            body: this.generatePDFBody(data, type),
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10] as [number, number, number, number], // Tuple for margin
        },
      },
    };

    return new Promise((resolve, reject) => {
      (pdfMake as any).createPdf(documentDefinition).getBuffer((buffer: Buffer) => {
        if (buffer) {
          resolve(buffer);
        } else {
          reject(new Error('Failed to generate PDF'));
        }
      });
    });
  }

  // Helper method to generate PDF body
  private generatePDFBody(data: any[], type: string): (string | number | Date)[][] {
    const body: (string | number | Date)[][] = [];

    // Initialize headers with a default value
    let headers: string[] = [];
    if (type === 'attendance') {
      headers = ['User', 'Date', 'Status', 'Login Time', 'Logout Time'];
    } else if (type === 'leave') {
      headers = ['User', 'Type', 'Start Date', 'End Date', 'Reason', 'Status'];
    } else if (type === 'salary') {
      headers = ['User', 'Month', 'Year', 'Amount', 'Deductions', 'Net Salary'];
    }

    body.push(headers);

    // Add rows
    data.forEach((record) => {
      const row: (string | number | Date)[] = [];
      if (type === 'attendance') {
        row.push(
          record.user?.name,
          record.date,
          record.status,
          record.loginTime,
          record.logoutTime
        );
      } else if (type === 'leave') {
        row.push(
          record.user?.name,
          record.type,
          record.startDate,
          record.endDate,
          record.reason,
          record.status
        );
      } else if (type === 'salary') {
        row.push(
          record.user?.name,
          record.month,
          record.year,
          record.amount,
          record.deductions,
          record.netSalary
        );
      }
      body.push(row);
    });

    return body;
  }

  // Attendance Report
  private async generateAttendanceReport(userId?: string, startDate?: Date, endDate?: Date) {
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

  // Leave Report
  private async generateLeaveReport(userId?: string, startDate?: Date, endDate?: Date) {
    return this.prisma.leave.findMany({
      where: {
        userId,
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        },
      },
      include: { user: true },
    });
  }

  // Salary Report
  private async generateSalaryReport(userId?: string, month?: string, year?: number) {
    return this.prisma.salary.findMany({
      where: {
        userId,
        month,
        year,
      },
      include: { user: true },
    });
  }
}