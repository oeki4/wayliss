import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCodes } from '@/shared/const/errorCodes';

export interface HttpExceptionResponse {
  success: boolean;
  code: number;
  data: any;
  message?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse: HttpExceptionResponse = {
      success: false,
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      data: null,
    };

    if (exception instanceof HttpException) {
      errorResponse.code = exception.getStatus();
      errorResponse.message = exception.message;
    }

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
