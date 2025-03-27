import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsArray()
  @IsOptional()
  roleIds?: number[];
} 