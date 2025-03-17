import { IsString, IsNumber, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreateFoodItemDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdateFoodItemDto extends CreateFoodItemDto {} 