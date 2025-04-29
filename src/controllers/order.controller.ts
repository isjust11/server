import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dtos/order.dto';
import { EncryptionUtil } from 'src/utils/encryption.util';
import { Base64EncryptionUtil } from 'src/utils/base64Encryption.util';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':id')
  create(@Param('id') id: string, @Body() createOrderDto: CreateOrderDto) {
    // Decrypt the tableId before using it
    const decryptedTableId = Base64EncryptionUtil.decrypt(id);
    return this.orderService.create(Number(decryptedTableId),createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const decryptedTableId = Base64EncryptionUtil.decrypt(id);
    return this.orderService.findOne(+decryptedTableId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: string) {
    return this.orderService.updateStatus(+id, updateOrderStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
} 