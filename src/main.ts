import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
//config env
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: [process.env.CLIENT_URL || 'http://localhost:3000',],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  // Cấu hình phục vụ file tĩnh
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  console.log('Server configuration completed');
  console.log('JWT Secret:', process.env.JWT_SECRET);
  await app.listen(process.env.PORT ?? 4200);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
