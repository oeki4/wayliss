import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { HttpExceptionFilter } from '@/filters/httpExceptionFilter';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { ErrorCodes } from '@/shared/const/errorCodes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        if (!(errors[0].constraints === undefined)) {
          return new HttpException(
            Object.values(errors[0].constraints)?.[0],
            ErrorCodes.DATA_VALIDATION_ERROR,
          );
        } else {
          return new HttpException(
            'Internal Server Error',
            ErrorCodes.INTERNAL_SERVER_ERROR,
          );
        }
      },
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: '*',
    credentials: true,
  });

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
