import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodItem } from '../entities/food-item.entity';
import { FoodItemService } from '../services/food-item.service';
import { FoodItemController } from '../controllers/food-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FoodItem])],
  controllers: [FoodItemController],
  providers: [FoodItemService],
  exports: [FoodItemService],
})
export class FoodItemModule {} 