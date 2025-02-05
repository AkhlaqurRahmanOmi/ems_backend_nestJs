import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ReportService } from './report.service';
import { GenerateReportDto } from './dto/report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // Generate a report (JSON response)
  @Post('generate')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('HR', 'ADMIN') // Only HR and ADMIN can generate reports
  async generateReport(@Body() body: GenerateReportDto) {
    return this.reportService.generateReport(body);
  }

  // Export a report to Excel
  @Post('export/excel')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('HR', 'ADMIN') // Only HR and ADMIN can export reports
  async exportToExcel(@Body() body: GenerateReportDto, @Res() res) {
    try {
      const reportData = await this.reportService.generateReport(body);
      const buffer = await this.reportService.exportToExcel(reportData, body.type);

      // Set headers for Excel file download
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${body.type}-report.xlsx`,
      });
      res.end(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Export a report to PDF
  @Post('export/pdf')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('HR', 'ADMIN') // Only HR and ADMIN can export reports
  async exportToPDF(@Body() body: GenerateReportDto, @Res() res) {
    try {
      const reportData = await this.reportService.generateReport(body);
      const buffer = await this.reportService.exportToPDF(reportData, body.type);

      // Set headers for PDF file download
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${body.type}-report.pdf`,
      });
      res.end(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}