import { Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';
import { PermissionInterceptor } from '../interceptors/permission.interceptor';
import { RequirePermissions } from '../decorators/require-permissions.decorator';

@Controller('example')
@UseGuards(PermissionGuard)
@UseInterceptors(PermissionInterceptor)
export class ExampleController {
  @Get('public')
  publicEndpoint() {
    return 'Đây là endpoint công khai';
  }

  @Get('admin')
  @RequirePermissions('ADMIN_VIEW')
  adminEndpoint() {
    return 'Đây là endpoint chỉ dành cho admin';
  }

  @Post('create')
  @RequirePermissions('USER_CREATE')
  createUser() {
    return 'Tạo người dùng mới';
  }

  @Get('manager')
  @RequirePermissions('MANAGER_VIEW', 'MANAGER_EDIT')
  managerEndpoint() {
    return 'Đây là endpoint dành cho manager';
  }
} 