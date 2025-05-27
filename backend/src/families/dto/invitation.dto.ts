import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { FamilyRole } from '../../common/enums';

export class CreateInvitationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(FamilyRole)
  @IsOptional()
  role?: FamilyRole;
}

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
