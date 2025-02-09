import { Controller, Post, Body, Delete, Param, Patch, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // Get all permissions
  @Get('getPermissions')
  getPermissions() {
    return this.permissionService.getPermissions();
  }

  // Create a new permission
  @Post()
  createPermission(@Body() body: CreatePermissionDto) {
    return this.permissionService.createPermission(body);
  }

  // Assign a permission to a role
  @Patch('assign-permissions/:roleId')
  async assignPermissions(
    @Param('roleId') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.permissionService.assignPermissionsToRole(roleId, permissionIds);
  }

  // Remove a permission from a role
  @Patch('remove-permissions/:roleId')
  async removePermissions(
    @Param('roleId') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.permissionService.removePermissionsFromRole(roleId, permissionIds);
  }
}

