import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Table } from './entities/table.entity';
import { TableService } from './table.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Hg!@1997',
      database: 'easy_order',
      entities: [Table],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Table]),
  ],
  controllers: [AppController],
  providers: [AppService, TableService],
})
export class AppModule {}
