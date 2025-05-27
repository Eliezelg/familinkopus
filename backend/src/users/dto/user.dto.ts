import { IsEmail, IsString, IsOptional, IsEnum, IsISO8601 } from 'class-validator';
import { Language } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsISO8601()
  dateOfBirth?: string;
}

export class UpdateProfilePictureDto {
  @IsString()
  profilePicture: string;
}
