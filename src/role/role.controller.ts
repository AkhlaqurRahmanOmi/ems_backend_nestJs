import { Controller, Post, Body, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // Create a new role
  @Post()
  createRole(@Body() body: CreateRoleDto) {
    return this.roleService.createRole(body);
  }

  // Assign a role to a user
  @Post('assign')
  assignRole(@Body() body: AssignRoleDto) {
    return this.roleService.assignRole(body);
  }

  // Get all roles
  @Get('all')
  getRoles() {
    return this.roleService.getRoles();
  }
}
