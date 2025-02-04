import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { LeaveStatus } from '../../common/constants/leave-status.enum';

export class UpdateLeaveStatusDto {
  @IsNotEmpty()
  @IsString()
  leaveId: string;

  @IsNotEmpty()
  @IsEnum(LeaveStatus)
  status: LeaveStatus;

  @IsNotEmpty()
  @IsString()
  approvedById: string; // ID of the user approving/rejecting the leave
}
