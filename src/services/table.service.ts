import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { NotificationsGateway } from '../gateways/notifications.gateway';
import { NotificationData } from '../interfaces/notification.interface';
import { NOTIFICATION_EVENTS, NOTIFICATION_ROOMS, NOTIFICATION_MESSAGES } from '../constants/notification.constants';
import { NotificationStatus, NotificationType, NotificationPriority } from '../enums/notification.enum';

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
    const notificationData: NotificationData = {
      event: NOTIFICATION_EVENTS.NEW_ORDER,
      room: NOTIFICATION_ROOMS.MANAGER_ROOM,
      message: NOTIFICATION_MESSAGES.NEW_ORDER,
      timestamp: new Date(),
      orderId: newTable.id.toString(),
      userId: 'system',
      userName: 'System',
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
        status: NotificationStatus.PENDING,
        type: NotificationType.ORDER,
        priority: NotificationPriority.MEDIUM,
        additionalData: updatedTable
      };
      this.notificationsGateway.notifyAll('tableUpdated', notificationData);
    }
    return updatedTable;
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
      status: NotificationStatus.PENDING,
      type: NotificationType.ORDER,
      priority: NotificationPriority.MEDIUM,
      additionalData: { id }
    };
    this.notificationsGateway.notifyAll('tableDeleted', notificationData);
  }
} 