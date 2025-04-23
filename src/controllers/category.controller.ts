import { Controller, Get, Post, Body, Param, Put, Delete, Request } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/category.entity';
import { Request as ExpressRequest } from 'express';

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

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<Category | null> {
    return this.categoryService.findByCode(code);
  }

  @Post()
  async create(@Body() category: Category, @Request() req: ExpressRequest): Promise<Category | null> {
    category.createDate = new Date();
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