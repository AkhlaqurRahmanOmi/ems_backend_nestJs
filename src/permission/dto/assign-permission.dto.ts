import { IsNotEmpty, IsString } from 'class-validator';

export class AssignPermissionDto {
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @IsNotEmpty()
  @IsString()
  permissionId: string;
}
