import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryType } from '../entities/category-type.entity';

@Injectable()
export class CategoryTypeService {
  constructor(
    @InjectRepository(CategoryType)
    private categoryTypeRepository: Repository<CategoryType>,
  ) {}

  async findAll(): Promise<CategoryType[]> {
    return this.categoryTypeRepository.find();
  }

  async findOne(id: string): Promise<CategoryType | null> {
    return this.categoryTypeRepository.findOneBy({ id });
  }

  async findByCode(code: string): Promise<CategoryType | null> {
    return this.categoryTypeRepository.findOne({ 
      where: { code },
      relations: ['categories'] // Assuming you want to load related categories as well
    });
  }

  async create(categoryType: CategoryType): Promise<CategoryType> {
    return this.categoryTypeRepository.save(categoryType);
  }

  async update(id: string, categoryType: CategoryType): Promise<CategoryType | null> {
    await this.categoryTypeRepository.update(id, categoryType);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.categoryTypeRepository.delete(id);
  }
} 