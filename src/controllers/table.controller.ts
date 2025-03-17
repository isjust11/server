import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AppService } from '../app.service';
import { TableService } from '../services/table.service';
import { Table } from '../entities/table.entity';

@Controller('table')
export class TableController {
  constructor(
    private readonly appService: AppService,
    private readonly tableService: TableService,
  ) {}

  @Get()
  async getTables(): Promise<Table[]> {
    return this.tableService.findAll();
  }

  @Post()
  async createTable(@Body() table: Table): Promise<Table> {
    return this.tableService.create(table);
  }

  @Put(':id')
  async updateTable(@Param('id') id: number, @Body() table: Table): Promise<Table | null> {
    return this.tableService.update(id, table);
  }

  @Delete(':id')
  async deleteTable(@Param('id') id: number): Promise<void> {
    return this.tableService.remove(id);
  }
}
