import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export interface HttpExceptionResponse {
  success: boolean;
  code: number;
  data: any;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    const errorResponse: HttpExceptionResponse = {
      success: false,
      code: status,
      data: null,
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
