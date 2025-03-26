import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NavigatorService } from '../services/navigator.service';
import { Navigator } from '../entities/navigator.entity';

@Controller('navigator')
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
}
