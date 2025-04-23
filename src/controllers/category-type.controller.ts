import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CategoryTypeService } from '../services/category-type.service';
import { CategoryType } from '../entities/category-type.entity';

@Controller('category-types')
export class CategoryTypeController {
  constructor(private readonly categoryTypeService: CategoryTypeService) {}

  @Get()
  async findAll(): Promise<CategoryType[]> {
    return this.categoryTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryType | null> {
    return this.categoryTypeService.findOne(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<CategoryType | null> {
    return this.categoryTypeService.findByCode(code);
  }

  @Post()
  async create(@Body() categoryType: CategoryType): Promise<CategoryType> {
    return this.categoryTypeService.create(categoryType);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() categoryType: CategoryType,
  ): Promise<CategoryType | null> {
    return this.categoryTypeService.update(id, categoryType);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoryTypeService.remove(id);
  }
} 