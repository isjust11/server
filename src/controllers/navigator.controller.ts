import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { NavigatorService } from 'src/services/navigator.service';
import { Navigator } from '../entities/navigator.entity';

@Controller('navigator')
export class NavigatorController {
    constructor(private readonly navigatorService: NavigatorService) {}
    @Get()
    async getNavigator() {
        return this.navigatorService.findAll();
    }

    @Post()
    async createNavigator(@Body() navigator: Navigator) {
        return this.navigatorService.create(navigator);
    }

    @Put(':id')
    async updateNavigator(@Param('id') id: number, @Body() navigator: Navigator) {
        return this.navigatorService.update(id, navigator);
    }

    @Delete(':id')
    async deleteNavigator(@Param('id') id: number) {
        return this.navigatorService.delete(id);
    }
}
