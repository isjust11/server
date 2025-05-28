import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { NavigatorService } from '../services/navigator.service';
import { Navigator } from '../entities/navigator.entity';
import { AssignRoleDto } from '../dtos/assign-role.dto';
import { EncryptionInterceptor } from 'src/interceptors/encryption.interceptor';
import { PaginationParams } from 'src/dtos/filter.dto';

@Controller('navigator')
@UseInterceptors(EncryptionInterceptor)
@UseInterceptors(EncryptionInterceptor)
export class NavigatorController {
    constructor(private readonly navigatorService: NavigatorService) {}


    @Get()
    async getTables(@Query('page') page: number, @Query('size') size: number, @Query('search') search: string){
      const filter: PaginationParams = {
        page: page || 1,
        size: size || 10,
        search: search || ''
      };
      return this.navigatorService.findAllWithPagination(filter);
    }
    
    @Post()
    create(@Body() createNavigatorDto: Partial<Navigator>) {
        return this.navigatorService.create(createNavigatorDto);
    }

    @Get('all')
    findAll() {
        return this.navigatorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.navigatorService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateNavigatorDto: Partial<Navigator>) {
        return this.navigatorService.update(+id, updateNavigatorDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.navigatorService.remove(+id);
    }

    @Post(':id/roles')
    assignRoles(@Param('id') id: string, @Body() assignRoleDto: AssignRoleDto) {
        return this.navigatorService.assignRoles(+id, assignRoleDto);
    }

    @Delete(':id/roles')
    removeRoles(@Param('id') id: string, @Body() roleIds: number[]) {
        return this.navigatorService.removeRoles(+id, roleIds);
    }

    @Get(':id/roles')
    getNavigatorRoles(@Param('id') id: string) {
        return this.navigatorService.getNavigatorRoles(+id);
    }
}
