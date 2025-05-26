import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Role } from '../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/role.dto';
import { Navigator } from '../entities/navigator.entity';
import { AssignNavigatorDto } from '../dtos/assign-navigator.dto';
import { EncryptionInterceptor } from 'src/interceptors/encryption.interceptor';

@Controller('roles')
@UseGuards(JwtAuthGuard)
@UseInterceptors(EncryptionInterceptor)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Role | null> {
    return this.roleService.findById(parseInt(id));
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(parseInt(id), updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(parseInt(id));
  }

  @Get(':id/navigators')
  async getNavigatorsByRole(@Param('id') id: string): Promise<Navigator[]> {
    return this.roleService.getNavigatorsByRole(parseInt(id));
  }

  @Post(':id/navigators')
  async assignNavigators(
    @Param('id') id: string,
    @Body() assignNavigatorDto: AssignNavigatorDto,
  ): Promise<Role> {
    return this.roleService.assignNavigators(parseInt(id), assignNavigatorDto);
  }
} 