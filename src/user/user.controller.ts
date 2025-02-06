import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserService } from './user.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('HR', 'ADMIN') // Only HR and ADMIN can create users
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }
  // Get the logged-in user's profile
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMyProfile(@Request() req) {
    const userId = req.user.id; // Extract user ID from JWT token
    return this.userService.getMyProfile(userId);
  }

  // Update the logged-in user's profile
  @Post('me')
  @HttpCode(HttpStatus.OK) // Use HTTP 200 for updates instead of 201
  @UseGuards(AuthGuard('jwt'))
  async updateMyProfile(
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
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Update another user's profile (HR/Admin only)
  @Post(':id')
  @HttpCode(HttpStatus.OK) // Use HTTP 200 for updates instead of 201
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('HR', 'ADMIN') // Only HR and ADMIN can access this route
  async updateUserProfile(
    @Param('id') userId: string,
    @Body() body: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(userId, body);
  }

  // Create a new user (HR/Admin only)
}