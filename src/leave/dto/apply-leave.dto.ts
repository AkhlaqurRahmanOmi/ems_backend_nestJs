import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum LeaveType {
  CASUAL = 'CASUAL',
  SICK = 'SICK',
  EARNED = 'EARNED',
}

export class ApplyLeaveDto {
  @IsNotEmpty()
  @IsEnum(LeaveType)
  type: LeaveType;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  reason: string;
}