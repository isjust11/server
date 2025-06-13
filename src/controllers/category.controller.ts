import { Controller, Get, Post, Body, Param, Put, Delete, Request } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category | null> {
    return this.categoryService.findOne(id);
  }

  @Post()
  async create(@Body() category: Category, @Request() req): Promise<Category | null> {
    category.createdAt = new Date();
    category.createBy = req?.user?.id; // Assuming req.user.id contains the ID of the user creating the category
    return this.categoryService.create(category);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() category: Category): Promise<Category | null> {
    return this.categoryService.update(id, category);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
} 