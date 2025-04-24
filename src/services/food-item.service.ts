import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { FoodItem } from '../entities/food-item.entity';
import { CreateFoodItemDto, UpdateFoodItemDto } from '../dtos/food-item.dto';

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

  findAll(filters?: {
    categoryId?: string;
    statusId?: string;
    isAvailable?: boolean;
    search?: string;
  }): Promise<FoodItem[]> {
    const query = this.foodItemRepository.createQueryBuilder('foodItem')
      .leftJoinAndSelect('foodItem.foodCategory', 'foodCategory')
      .leftJoinAndSelect('foodItem.statusCategory', 'statusCategory')
      .leftJoinAndSelect('foodItem.unitCategory', 'unitCategory');

    if (filters) {
      if (filters.categoryId) {
        query.andWhere('foodItem.foodCategoryId = :categoryId', { categoryId: filters.categoryId });
      }
      if (filters.statusId) {
        query.andWhere('foodItem.statusCategoryId = :statusId', { statusId: filters.statusId });
      }
      if (filters.isAvailable !== undefined) {
        query.andWhere('foodItem.isAvailable = :isAvailable', { isAvailable: filters.isAvailable });
      }
      if (filters.search) {
        query.andWhere('foodItem.name LIKE :search', { search: `%${filters.search}%` });
      }
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<FoodItem> {
    const foodItem = await this.foodItemRepository.findOne({
      where: { id },
      relations: ['foodCategory', 'statusCategory', 'unitCategory'],
    });
    if (!foodItem) {
      throw new Error('Không tìm thấy món ăn');
    }
    return foodItem;
  }

  async update(id: number, updateFoodItemDto: UpdateFoodItemDto): Promise<void> {
    await this.foodItemRepository.update(id, updateFoodItemDto);
  }

  async remove(id: number): Promise<void> {
    await this.foodItemRepository.delete(id);
  }

  async updateStatus(id: number, statusCategoryId: string): Promise<FoodItem> {
    await this.foodItemRepository.update(id, { statusCategoryId });
    return this.findOne(id);
  }

  async updateAvailability(id: number, isAvailable: boolean): Promise<FoodItem> {
    await this.foodItemRepository.update(id, { isAvailable });
    return this.findOne(id);
  }

  async updateDiscount(
    id: number,
    discountData: {
      discountPercent: number;
      discountStartTime: Date;
      discountEndTime: Date;
    },
  ): Promise<FoodItem> {
    await this.foodItemRepository.update(id, discountData);
    return this.findOne(id);
  }
} 