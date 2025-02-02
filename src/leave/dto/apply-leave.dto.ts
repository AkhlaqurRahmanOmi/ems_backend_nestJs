import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class ApplyLeaveDto {
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  reason: string;
}