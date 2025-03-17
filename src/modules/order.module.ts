import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { FoodItem } from '../entities/food-item.entity';
import { OrderService } from '../services/order.service';
import { OrderController } from '../controllers/order.controller';
import { FoodItemModule } from './food-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, FoodItem]),
    FoodItemModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {} 