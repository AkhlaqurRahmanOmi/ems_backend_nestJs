import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Record attendance
  @Post()
  @UseGuards(AuthGuard)
  createAttendance(@Body() body: CreateAttendanceDto) {
    return this.attendanceService.createAttendance(body);
  }

  // View attendance for a specific user or all users within a date range
  @Get()
  @UseGuards(AuthGuard)
  getAttendance(
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getAttendance(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  // Fetch attendance for the logged-in user
  @Get('my')
  @UseGuards(AuthGuard)
  getMyAttendance(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.id; // Extract user ID from JWT token
    return this.attendanceService.getMyAttendance(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  // Update attendance
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('HR', 'ADMIN') // Only HR and ADMIN can update attendance
  updateAttendance(@Param('id') id: string, @Body() body: UpdateAttendanceDto) {
    return this.attendanceService.updateAttendance(id, body);
  }
}