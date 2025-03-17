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
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Hg!@1997',
      database: 'easy_order',
      entities: [Table, Navigator, User, FoodItem, Order, OrderItem, Guest],
      synchronize: true,
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([Table, Navigator, FoodItem, Order, OrderItem, User, Guest]),
    AuthModule,
  ],
  controllers: [
    TableController,
    NavigatorController,
    FoodItemController,
    OrderController,
    AuthController
  ],
  providers: [
    AppService, 
    TableService, 
    NavigatorService, 
    NotificationsGateway,
    FoodItemService,
    OrderService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
