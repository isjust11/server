import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AppService } from '../app.service';
import { TableService } from '../services/table.service';
import { Table } from '../entities/table.entity';
import { PaginationParams } from 'src/dtos/filter.dto';
import { EncryptionInterceptor } from '../interceptors/encryption.interceptor';
import { DecryptId } from '../decorators/decrypt.decorator';

@Controller('table')
@UseInterceptors(EncryptionInterceptor)
export class TableController {
  constructor(
    private readonly appService: AppService,
    private readonly tableService: TableService,
  ) {}

  @Get()
  async getTables(@Param('page') page: number, @Param('size') size: number, @Param('search') search: string){
    const filter: PaginationParams = {
      page: page || 1,
      size: size || 10,
      search: search || ''
    };
    return this.tableService.findAllWithPagination(filter);
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

  @Get(':id')
  findOne(@DecryptId('id') id: number) {
    return this.tableService.findOne(id);
  }
}
