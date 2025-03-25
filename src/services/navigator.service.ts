import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Navigator } from '../entities/navigator.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class NavigatorService {
    constructor(
        @InjectRepository(Navigator)
        private navigatorRepository: Repository<Navigator>,
    ) {}

    async create(createNavigatorDto: Partial<Navigator>): Promise<Navigator> {
        const navigator = this.navigatorRepository.create(createNavigatorDto);
        return await this.navigatorRepository.save(navigator);
    }

    async findAll(): Promise<Navigator[]> {
        return await this.navigatorRepository.find({
            relations: ['children'],
            order: { label: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Navigator> {
        const navigator = await this.navigatorRepository.findOne({
            where: { id },
            relations: ['children', 'parent'],
        });
        
        if (!navigator) {
            throw new NotFoundException(`Navigator with ID ${id} not found`);
        }
        
        return navigator;
    }

    async update(id: number, updateNavigatorDto: Partial<Navigator>): Promise<Navigator> {
        const navigator = await this.findOne(id);
        Object.assign(navigator, updateNavigatorDto);
        return await this.navigatorRepository.save(navigator);
    }

    async remove(id: number): Promise<void> {
        const result = await this.navigatorRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Navigator with ID ${id} not found`);
        }
    }
}