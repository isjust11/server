import { IsString, IsOptional, IsArray } from 'class-validator';

export class RoleDto {
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
  features?: string[];
}
