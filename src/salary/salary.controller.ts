import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { SalaryService } from './salary.service';
import { AllocateLeavesDto } from './dto/allocate-leaves.dto';
import { CalculateSalaryDto } from './dto/calculate-salary.dto';

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  // Allocate leaves for a role (HR only)
  @Post('allocate-leaves')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('HR') // Only HR can allocate leaves
  async allocateLeaves(@Body() body: AllocateLeavesDto) {
    return this.salaryService.allocateLeaves(body.roleId, body.allocatedLeaves);
  }

  // Calculate salary for a user
  @Post('calculate')
  @UseGuards(AuthGuard('jwt'))
  async calculateSalary(@Body() body: CalculateSalaryDto) {
    return this.salaryService.calculateSalary(body.userId, body.month, body.year);
  }
}