import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { TableController } from './controllers/table.controller';
import { AppService } from './app.service';
import { Table } from './entities/table.entity';
import { TableService } from './services/table.service';
import { NavigatorController } from './controllers/navigator.controller';
import { Navigator } from './entities/navigator.entity';
import { NavigatorService } from './services/navigator.service';
import { join } from 'path';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { User } from './entities/user.entity';
import { FoodItemController } from './controllers/food-item.controller';
import { OrderController } from './controllers/order.controller';
import { FoodItemService } from './services/food-item.service';
import { OrderService } from './services/order.service';
import { FoodItem } from './entities/food-item.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { AuthController } from './controllers/auth.controller';
import { Guest } from './entities/guest.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';
import { Media } from './entities/media.entity';
import { ConfigModule } from '@nestjs/config';
import { PermissionController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { ExampleController } from './controllers/example.controller';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';
import { GoogleStrategy } from './guards/strategies/google.strategy';
import { FacebookStrategy } from './guards/strategies/facebook.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      envFilePath: '.env', // Đường dẫn đến tệp .env
      isGlobal: true, // Biến môi trường sẽ khả dụng toàn cục
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'AyTUug0rjLJrLF5FJOdyaVdNkaZgugvp',
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Hg!@1997',
      database: 'easy_order',
      entities: [Table, Navigator, User, FoodItem, Order, OrderItem, Guest, Media, Permission, Role, RefreshToken ],
      synchronize: true,
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([Table,
      Navigator,
      FoodItem,
      Order,
      OrderItem,
      User, 
      Guest, 
      Media, 
      Permission, 
      Role,
      RefreshToken
    ]),
    // AuthModule,
  ],
  controllers: [
    TableController,
    NavigatorController,
    FoodItemController,
    OrderController,
    AuthController,
    UserController,
    MediaController,
    PermissionController,
    RoleController,
    ExampleController,

  ],
  providers: [
    AppService,
    TableService,
    NavigatorService,
    NotificationsGateway,
    FoodItemService,
    OrderService,
    UserService,
    MediaService,
    PermissionService,
    RoleService,
    AuthService,
    EmailService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
