import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query, Put } from '@nestjs/common';
import { NavigatorService } from '../services/navigator.service';
import { Navigator } from '../entities/navigator.entity';
import { AssignRoleDto } from '../dtos/assign-role.dto';
import { EncryptionInterceptor } from 'src/interceptors/encryption.interceptor';
import { PaginationParams } from 'src/dtos/filter.dto';
import { NavigatorDto } from 'src/dtos/navigator.dto';
import { Base64EncryptionUtil } from 'src/utils/base64Encryption.util';

@Controller('navigator')
@UseInterceptors(EncryptionInterceptor)
export class NavigatorController {
    constructor(private readonly navigatorService: NavigatorService) {}


    @Get()
    async getNavigator(@Query('page') page: number, @Query('size') size: number, @Query('search') search: string){
      const filter: PaginationParams = {
        page: page || 1,
        size: size || 10,
        search: search || ''
      };
      return this.navigatorService.findAllWithPagination(filter);
    }
    
    @Post()
    create(@Body() createNavigatorDto: NavigatorDto) {
        return this.navigatorService.create(createNavigatorDto);
    }

    @Get('all')
    findAll() {
        return this.navigatorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.navigatorService.findOne(this.decode(id));
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateNavigatorDto: NavigatorDto) {
        return this.navigatorService.update(this.decode(id), updateNavigatorDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.navigatorService.remove(this.decode(id));
    }

    @Post(':id/roles')
    assignRoles(@Param('id') id: string, @Body() assignRoleDto: AssignRoleDto) {
        return this.navigatorService.assignRoles(this.decode(id), assignRoleDto);
    }

    @Delete(':id/roles')
    removeRoles(@Param('id') id: string, @Body() roleIds: number[]) {
        return this.navigatorService.removeRoles(this.decode(id), roleIds);
    }

    @Get(':id/roles')
    getNavigatorRoles(@Param('id') id: string) {
        return this.navigatorService.getNavigatorRoles(this.decode(id));
    }

    private decode(id:string){
        const idDecode = Base64EncryptionUtil.decrypt(id);
        return parseInt(idDecode);
      }
}
