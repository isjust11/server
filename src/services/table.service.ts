import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { NotificationsGateway } from '../gateways/notifications.gateway';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  findAll(): Promise<Table[]> {
    return this.tableRepository.find();
  }

  async create(table: Table): Promise<Table> {
    const newTable = await this.tableRepository.save(table);
    this.notificationsGateway.notifyAll('tableCreated', newTable);
    return newTable;
  }

  async update(id: number, table: Table): Promise<Table | null> {
    await this.tableRepository.update(id, table);
    const updatedTable = await this.tableRepository.findOne({ where: { id } });
    if (updatedTable) {
      this.notificationsGateway.notifyAll('tableUpdated', updatedTable);
    }
    return updatedTable;
  }

  async remove(id: number): Promise<void> {
    await this.tableRepository.delete(id);
    this.notificationsGateway.notifyAll('tableDeleted', { id });
  }
} 