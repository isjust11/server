import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodItem } from '../entities/food-item.entity';
import { CreateFoodItemDto, UpdateFoodItemDto } from '../dto/food-item.dto';

@Injectable()
export class FoodItemService {
  constructor(
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
  ) {}

  create(createFoodItemDto: CreateFoodItemDto): Promise<FoodItem> {
    const foodItem = this.foodItemRepository.create(createFoodItemDto);
    return this.foodItemRepository.save(foodItem);
  }

  findAll(): Promise<FoodItem[]> {
    return this.foodItemRepository.find();
  }
  async findOne(id: number): Promise<FoodItem> {
    const foodItem = await this.foodItemRepository.findOne({ where: { id } });
    if (!foodItem) {
      throw new Error('Không tìm thấy món ăn');
    }
    return foodItem;
  }

  async update(id: number, updateFoodItemDto: UpdateFoodItemDto): Promise<FoodItem> {
    await this.foodItemRepository.update(id, updateFoodItemDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.foodItemRepository.delete(id);
  }
} 