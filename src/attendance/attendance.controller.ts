import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
import { UserPayload } from '../auth/types/user-payload.type';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Mark attendance for the logged-in user
  @Post('login')
  @UseGuards(AuthGuard('jwt'))
  async markAttendance(@Request() req: Request & { user: UserPayload }, @Body('status') status: string) {
    const userId = req.user.sub; // Extract user ID from JWT token
    return this.attendanceService.markAttendance(userId, status);
  }

  // Log out the user
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req: Request & { user: UserPayload }) {
    const userId = req.user.sub; // Extract user ID from JWT token
    return this.attendanceService.logout(userId);
  }

  // Get attendance history for the logged-in user
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMyAttendance(@Request() req: Request & { user: UserPayload }) {
    const userId = req.user.sub; // Extract user ID from JWT token
    return this.attendanceService.getMyAttendance(userId);
  }
}