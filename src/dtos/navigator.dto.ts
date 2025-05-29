import { IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Optional } from '@nestjs/common';
import { IconType } from 'src/enums/icon-type.enum';

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

  @IsEnum(IconType)
  @Optional()
  iconType: IconType;

  @Optional()
  @IsNumber()
  iconSize: number;
}