import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FoodItemService } from '../services/food-item.service';
import { CreateFoodItemDto, UpdateFoodItemDto } from '../dtos/food-item.dto';

@Controller('food-items')
export class FoodItemController {
  constructor(private readonly foodItemService: FoodItemService) {}

  @Post()
  create(@Body() createFoodItemDto: CreateFoodItemDto) {
    return this.foodItemService.create(createFoodItemDto);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('statusId') statusId?: string,
    @Query('isAvailable') isAvailable?: boolean,
    @Query('search') search?: string,
  ) {
    return this.foodItemService.findAll({
      categoryId,
      statusId,
      isAvailable,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodItemDto: UpdateFoodItemDto) {
    return this.foodItemService.update(+id, updateFoodItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodItemService.remove(+id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('statusCategoryId') statusCategoryId: string,
  ) {
    return this.foodItemService.updateStatus(+id, statusCategoryId);
  }

  @Patch(':id/availability')
  updateAvailability(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.foodItemService.updateAvailability(+id, isAvailable);
  }

  @Patch(':id/discount')
  updateDiscount(
    @Param('id') id: string,
    @Body() discountData: {
      discountPercent: number;
      discountStartTime: Date;
      discountEndTime: Date;
    },
  ) {
    return this.foodItemService.updateDiscount(+id, discountData);
  }
} 