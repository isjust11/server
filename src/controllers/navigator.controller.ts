import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { NavigatorService } from '../services/navigator.service';
import { Navigator } from '../entities/navigator.entity';
import { AssignRoleDto } from '../dtos/assign-role.dto';
import { EncryptionInterceptor } from 'src/interceptors/encryption.interceptor';

@Controller('navigator')
@UseInterceptors(EncryptionInterceptor)
export class NavigatorController {
    constructor(private readonly navigatorService: NavigatorService) {}

    @Post()
    create(@Body() createNavigatorDto: Partial<Navigator>) {
        return this.navigatorService.create(createNavigatorDto);
    }

    @Get()
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
