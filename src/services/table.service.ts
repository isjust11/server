import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
  ) {}

  findAll(): Promise<Table[]> {
    return this.tableRepository.find();
  }

  create(table: Table): Promise<Table> {
    return this.tableRepository.save(table);
  }

  async update(id: number, table: Table): Promise<Table | null> {
    await this.tableRepository.update(id, table);
    return this.tableRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.tableRepository.delete(id);
  }
} 