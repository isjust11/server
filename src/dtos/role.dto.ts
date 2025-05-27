import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsArray()
  @IsOptional()
  permissionIds?: number[];

  @IsArray()
  @IsOptional()
  navigatorIds?: string[];
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  permissionIds?: number[];

  @IsArray()
  @IsOptional()
  navigatorIds?: string[];
} 