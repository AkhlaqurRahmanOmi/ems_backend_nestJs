import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional()
  status?: string; // e.g., "PRESENT", "ABSENT", "LEAVE"

  @IsOptional()
  loginTime?: Date;

  @IsOptional()
  logoutTime?: Date;

  @IsOptional()
  isLate?: boolean;

  @IsOptional()
  isEarlyLogout?: boolean;
}