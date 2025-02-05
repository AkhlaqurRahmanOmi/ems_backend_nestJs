import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateReportDto {
  @IsNotEmpty()
  @IsString()
  type: 'attendance' | 'leave' | 'salary'; // Type of report

  @IsOptional()
  userId?: string; // Optional: Filter by user ID

  @IsNotEmpty()
  startDate: Date; // Start of the date range

  @IsNotEmpty()
  endDate: Date; // End of the date range

  @IsOptional()
  month?: string; // Required for salary reports

  @IsOptional()
  year?: number; // Required for salary reports
}