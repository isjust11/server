import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Navigator } from '../entities/navigator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NavigatorService {
    constructor(
        @InjectRepository(Navigator)
        private navigatorRepository: Repository<Navigator>,
    ) {}

    async findAll(): Promise<Navigator[]> {
        return this.navigatorRepository.find();
    }

    async create(navigator: Navigator): Promise<Navigator> {
        return this.navigatorRepository.save(navigator);
    }

    async update(id: number, navigator: Navigator): Promise<Navigator | null> {
        await this.navigatorRepository.update(id, navigator);
        return this.navigatorRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.navigatorRepository.delete(id);
    }
}