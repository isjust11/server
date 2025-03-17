import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsNumber()
  foodItemId: number;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateOrderDto {
  @IsNumber()
  tableId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'])
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
} 