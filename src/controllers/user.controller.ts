import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dtos/auth.dto';
import { UpdateUserDto } from '../dtos/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(parseInt(id));
  }

  @Post()
  async create(@Body() createUserDto: RegisterDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(parseInt(id), updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(parseInt(id));
  }

  @Put(':id/block')
  async blockUser(@Param('id') id: string): Promise<User> {
    return this.userService.blockUser(parseInt(id));
  }

  @Put(':id/unblock')
  async unblockUser(@Param('id') id: string): Promise<User> {
    return this.userService.unblockUser(parseInt(id));
  }
} 