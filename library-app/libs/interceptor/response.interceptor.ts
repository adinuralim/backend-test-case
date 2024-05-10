import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    let status = 0;
    const errors = [];
    const message = exception.message;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse()['message'];
      if (Array.isArray(responseMessage)) {
        errors.push(...responseMessage);
      } else {
        errors.push(responseMessage);
      }
    } else {
      errors.push(message);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      code: status,
      data: null,
      errors: errors,
      message: message,
      success: false,
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return {
      code: response.statusCode,
      data: res,
      errors: [],
      message: '',
      success: true,
    };
  }
}
