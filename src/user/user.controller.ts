import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserService } from './user.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get the logged-in user's profile
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMyProfile(@Request() req) {
    const userId = req.user.id; // Extract user ID from JWT token
    return this.userService.getMyProfile(userId);
  }

  // Update the logged-in user's profile
  @Post('me')
  @UseGuards(AuthGuard('jwt'))
  updateMyProfile(
    @Request() req,
    @Body() body: UpdateUserProfileDto,
  ) {
    const userId = req.user.id; // Extract user ID from JWT token
    return this.userService.updateMyProfile(userId, body);
  }

  // Get all users (HR/Admin only)
  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('HR', 'ADMIN') // Only HR and ADMIN can access this route
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Update another user's profile (HR/Admin only)
  @Post(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('HR', 'ADMIN') // Only HR and ADMIN can access this route
  updateUserProfile(
    @Param('id') userId: string,
    @Body() body: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(userId, body);
  }
}