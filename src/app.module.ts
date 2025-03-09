import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { Table } from './entities/table.entity';
import { TableService } from './services/table.service';
import { NavigatorController } from './controllers/navigator.controller';
import { Navigator } from './entities/navigator.entity';
import { NavigatorService } from './services/navigator.service';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Hg!@1997',
      database: 'easy_order',
      entities: [Table, Navigator],
      synchronize: true,
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([Table, Navigator]),
  ],
  controllers: [AppController, NavigatorController],
  providers: [AppService, TableService, NavigatorService],
})
export class AppModule {}
