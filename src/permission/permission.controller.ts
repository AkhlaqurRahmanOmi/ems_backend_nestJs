import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // Create a new permission
  @Post()
  createPermission(@Body() body: CreatePermissionDto) {
    return this.permissionService.createPermission(body);
  }

  // Assign a permission to a role
  @Post('assign')
  assignPermission(@Body() body: AssignPermissionDto) {
    return this.permissionService.assignPermission(body);
  }

  // Remove a permission from a role
  @Delete('remove/:roleId/:permissionId')
  removePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.permissionService.removePermission(roleId, permissionId);
  }
}