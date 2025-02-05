import { IsInt, IsNotEmpty } from 'class-validator';

export class AllocateLeavesDto {
  @IsNotEmpty()
  roleId: string;

  @IsInt()
  allocatedLeaves: number;
}