import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { FoodItem } from '../entities/food-item.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      tableId: createOrderDto.tableId,
      note: createOrderDto.note,
    });

    const savedOrder = await this.orderRepository.save(order);
    let totalAmount = 0;

    for (const item of createOrderDto.orderItems) {
      const foodItem = await this.foodItemRepository.findOne({
        where: { id: item.foodItemId },
      });

      if (!foodItem) {
        throw new NotFoundException(`Food item with ID ${item.foodItemId} not found`);
      }

      const orderItem = this.orderItemRepository.create({
        order: savedOrder,
        foodItem,
        quantity: item.quantity,
        price: foodItem.price,
        note: item.note,
      });

      await this.orderItemRepository.save(orderItem);
      totalAmount += foodItem.price * item.quantity;
    }

    savedOrder.totalAmount = totalAmount;
    return this.orderRepository.save(savedOrder);
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['orderItems', 'orderItems.foodItem'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.foodItem'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    await this.orderRepository.update(id, updateOrderStatusDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
} 