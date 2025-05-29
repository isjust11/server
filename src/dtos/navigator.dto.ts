import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsEnum, isBoolean, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class NavigatorDto {
  @IsString()
  id: string;

  @IsString()
  icon: string;

  @IsString()
  label: string;

  @IsString()
  link: string;

  @IsString()
  parentId?: string;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  @Optional()
  order?:number;
}