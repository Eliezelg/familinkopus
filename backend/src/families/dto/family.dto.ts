import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, IsNotEmpty } from 'class-validator';
import { Language } from '../../common/enums';

export class CreateFamilyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @IsInt()
  @IsOptional()
  gazetteDay?: number;

  @IsInt()
  @IsOptional()
  maxPhotosPerGazette?: number;

  @IsBoolean()
  @IsOptional()
  autoGenerateGazette?: boolean;
}

export class UpdateFamilyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverPhoto?: string;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @IsInt()
  @IsOptional()
  gazetteDay?: number;

  @IsInt()
  @IsOptional()
  maxPhotosPerGazette?: number;

  @IsBoolean()
  @IsOptional()
  autoGenerateGazette?: boolean;
}
