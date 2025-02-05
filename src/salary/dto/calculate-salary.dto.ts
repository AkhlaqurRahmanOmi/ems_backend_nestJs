import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CalculateSalaryDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  month: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}