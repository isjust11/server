import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './controllers/app.controller';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Hg!@1997',
      database: 'easy_order',
      entities: [Table, Navigator, User],
      synchronize: true,
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([Table, Navigator]),
    AuthModule,
  ],
  controllers: [AppController, NavigatorController],
  providers: [
    AppService, 
    TableService, 
    NavigatorService, 
    NotificationsGateway,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
