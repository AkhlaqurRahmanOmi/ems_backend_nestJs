import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class UpdateRouteRolesDto {
  @IsNotEmpty()
  @IsString()
  route: string;

  @IsArray()
  @IsString({ each: true })
  roles: string[];
}