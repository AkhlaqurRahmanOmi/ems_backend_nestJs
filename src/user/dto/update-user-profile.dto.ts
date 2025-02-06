import { IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string; // Optional field for updating the password

  @IsOptional()
  @IsString()
  roleName?: string; // Optional field for updating the role dynamically

  @IsOptional()
  // @ts-ignore
  @IsPhoneNumber(null) // Validate phone number format
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined)) // Convert string to Date object
  joinDate?: Date;

  @IsOptional()
  @IsString()
  department?: string; // Optional field for department information
}