import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { HttpExceptionFilter } from '@/filters/httpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  if (!fs.existsSync(path.resolve('uploads'))) {
    try {
      fs.mkdirSync(path.resolve('uploads'));
    } catch (err) {
      console.log(err);
    }
  }
  if (!fs.existsSync(path.resolve('avatars'))) {
    try {
      fs.mkdirSync(path.resolve('avatars'));
    } catch (err) {
      console.log(err);
    }
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
