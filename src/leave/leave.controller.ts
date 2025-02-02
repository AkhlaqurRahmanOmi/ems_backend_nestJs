import { Controller, Post, Body, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeaveService } from './leave.service';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // Ensure this guard is applied
  applyForLeave(@Request() req, @Body() body: ApplyLeaveDto) {
    const userId = req.user.id; // Extract user ID from JWT token
    console.log('User ID:', userId); // Debugging line
    return this.leaveService.applyForLeave(userId, body);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt')) // Ensure this guard is applied
  getMyLeaveRequests(@Request() req) {
    const userId = req.user.id; // Extract user ID from JWT token
    console.log('User ID:', userId); // Debugging line
    return this.leaveService.getLeaveRequests(userId);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt')) // Ensure this guard is applied
  getAllLeaveRequests() {
    return this.leaveService.getAllLeaveRequests();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // Ensure this guard is applied
  updateLeaveStatus(@Param('id') id: string, @Body() body: UpdateLeaveStatusDto) {
    return this.leaveService.updateLeaveStatus({ ...body, leaveId: id });
  }
}