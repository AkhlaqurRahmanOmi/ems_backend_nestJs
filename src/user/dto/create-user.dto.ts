import { IsString, IsNotEmpty, IsEmail, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  roleName: string; // Name of the role (e.g., "EMPLOYEE", "HR", "MANAGER")

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value)) // Convert string to Date object
  @IsDate()
  joinDate: Date;
}