import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  status: string; // e.g., "PRESENT", "ABSENT", "LEAVE"

  @IsOptional()
  loginTime?: Date;

  @IsOptional()
  logoutTime?: Date;
}