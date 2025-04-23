import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['type']
    });
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ 
      where: { id },
      relations: ['type']
    });
  }

  async findByCode(code: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ 
      where: { code },
      relations: ['type']
    }) || null;
  }

  async create(category: Partial<Category>): Promise<Category | null> {
    const newCategory = this.categoryRepository.create(category);
    return this.categoryRepository.save(newCategory);
  }

  async update(id: string, category: Partial<Category>): Promise<Category | null> {
    await this.categoryRepository.update(id, category);
    return this.categoryRepository.findOne({ 
      where: { id },
      relations: ['type']
    });
  }

  async remove(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
} 