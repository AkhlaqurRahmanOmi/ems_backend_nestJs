import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Request
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard'; // Import your custom AuthGuard
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { LeaveService } from './leave.service';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  // Apply for leave
  @Post()
  @UseGuards(AuthGuard) // Use your custom AuthGuard
  applyForLeave(@Request() req, @Body() body: ApplyLeaveDto) {
    const userId = req.user.id; // Extract user ID from JWT token
    return this.leaveService.applyForLeave(userId, body);
  }

  // Approve or reject leave (HR/Admin only)
  @Post(':id/status')
  @UseGuards(AuthGuard, RolesGuard) // Use both AuthGuard and RolesGuard
  @Roles('HR', 'ADMIN') // Only HR and ADMIN can approve/reject leave
  updateLeaveStatus(
    @Param('id') leaveId: string,
    @Body() body: UpdateLeaveStatusDto,
  ) {
    return this.leaveService.updateLeaveStatus(leaveId, body);
  }

  // Get leave history for the logged-in user
  @Get('history')
  @UseGuards(AuthGuard) // Use your custom AuthGuard
  getLeaveHistory(@Request() req) {
    const userId = req.user.id; // Extract user ID from JWT token
    return this.leaveService.getLeaveHistory(userId);
  }
}