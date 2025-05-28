import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Role } from '../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/role.dto';
import { Navigator } from '../entities/navigator.entity';
import { AssignNavigatorDto } from '../dtos/assign-navigator.dto';
import { EncryptionInterceptor } from 'src/interceptors/encryption.interceptor';
import { Base64EncryptionUtil } from 'src/utils/base64Encryption.util';

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
    return this.roleService.findById(this.decode(id));
  }

  
  @Get('/find/:code')
  async findByCode(@Param('code') code: string): Promise<Role | null> {
    return this.roleService.findByCode(code);
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
    return this.roleService.update(this.decode(id), updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(this.decode(id));
  }

  @Get(':id/navigators')
  async getNavigatorsByRole(@Param('id') id: string): Promise<Navigator[]> {
    return this.roleService.getNavigatorsByRole(this.decode(id));
  }

  @Post(':id/navigators')
  async assignNavigators(
    @Param('id') id: string,
    @Body() assignNavigatorDto: AssignNavigatorDto,
  ): Promise<Role> {
    return this.roleService.assignNavigators(this.decode(id), assignNavigatorDto);
  }

  private decode(id:string){
    const idDecode = Base64EncryptionUtil.decrypt(id);
    return parseInt(idDecode);
  }
} 