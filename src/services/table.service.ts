import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Table } from '../entities/table.entity';
import { NotificationsGateway } from '../gateways/notifications.gateway';
import { NotificationData } from '../interfaces/notification.interface';
import { NOTIFICATION_EVENTS, NOTIFICATION_ROOMS, NOTIFICATION_MESSAGES } from '../constants/notification.constants';
import { NotificationStatus, NotificationType, NotificationPriority } from '../enums/notification.enum';
import { PaginatedResponse, PaginationParams } from 'src/dtos/filter.dto';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    private notificationsGateway: NotificationsGateway,
  ) { }

  async findAllWithPagination(params: PaginationParams): Promise<PaginatedResponse<Table>> {
    const { page = 1, size = 10, search = '' } = params;
    const skip = (page - 1) * size;

    const whereConditions = search ? [
      { name: Like(`%${search}%`) },
      { description: Like(`%${search}%`) }
    ] : {};

    const [data, total] = await this.tableRepository.findAndCount({
      where: whereConditions,
      relations: ['tableStatus', 'tableType', 'tableArea'],
      skip,
      take: size,
      order: {
        id: 'DESC'
      }
    });

    return {
      data,
      total,
      page,
      size: size,
      totalPages: Math.ceil(total / size)
    };
  }

  findAll(): Promise<Table[]> {
    return this.tableRepository.find(
      {
        relations: ['tableStatus', 'tableType', 'tableArea'],
        order: {
          id: 'DESC'
        }
      }
    );
  }

  async create(table: Table): Promise<Table> {
    const newTable = await this.tableRepository.save(table);
    const notificationData: NotificationData = {
      event: NOTIFICATION_EVENTS.NEW_ORDER,
      room: NOTIFICATION_ROOMS.MANAGER_ROOM,
      message: NOTIFICATION_MESSAGES.NEW_ORDER,
      timestamp: new Date(),
      orderId: newTable.id.toString(),
      userId: 'system',
      userName: 'System',
      tableStatus:'',
      status: NotificationStatus.PENDING,
      type: NotificationType.ORDER,
      priority: NotificationPriority.MEDIUM,
      additionalData: newTable
    };
    this.notificationsGateway.notifyAll('tableCreated', notificationData);
    return newTable;
  }

  async update(id: number, table: Table): Promise<Table | null> {
    await this.tableRepository.update(id, table);
    const updatedTable = await this.tableRepository.findOne({ where: { id } });
    if (updatedTable) {
      const notificationData: NotificationData = {
        event: NOTIFICATION_EVENTS.NEW_ORDER,
        room: NOTIFICATION_ROOMS.MANAGER_ROOM,
        message: NOTIFICATION_MESSAGES.NEW_ORDER,
        timestamp: new Date(),
        orderId: updatedTable.id.toString(),
        userId: 'system',
        userName: 'System',
        tableStatus:'',
        status: NotificationStatus.PENDING,
        type: NotificationType.ORDER,
        priority: NotificationPriority.MEDIUM,
        additionalData: updatedTable
      };
      this.notificationsGateway.notifyAll('SOCKET_ON', notificationData);
    }
    return updatedTable;
  }

  async updateStatus(id: number, status: string): Promise<Table | null> {
    await this.tableRepository.update(id, { tableStatusId: status });
    const updatedTable = await this.tableRepository.findOne({ where: { id } });
    if (updatedTable) {
      return updatedTable;
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    await this.tableRepository.delete(id);
    const notificationData: NotificationData = {
      event: NOTIFICATION_EVENTS.NEW_ORDER,
      room: NOTIFICATION_ROOMS.MANAGER_ROOM,
      message: NOTIFICATION_MESSAGES.NEW_ORDER,
      timestamp: new Date(),
      orderId: id.toString(),
      userId: 'system',
      userName: 'System',
      tableStatus:'',
      status: NotificationStatus.PENDING,
      type: NotificationType.ORDER,
      priority: NotificationPriority.MEDIUM,
      additionalData: { id }
    };
    this.notificationsGateway.notifyAll('tableDeleted', notificationData);
  }

  findOne(id: number): Promise<Table | null> {
    return this.tableRepository.findOne({
      where: { id },
      relations: ['tableStatus', 'tableType', 'tableArea']
    });
  }
} 