import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // Check if data contains a message property
        const message = data?.message || 'Operation completed successfully';

        // If data has a message property, remove it from the data object
        if (data?.message) {
          const { message, ...restData } = data;
          return {
            status: 'success',
            message,
            data: restData,
          };
        }

        return {
          status: 'success',
          message,
          data,
        };
      }),
      catchError((err) => {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors = null;

        if (err instanceof HttpException) {
          statusCode = err.getStatus();
          const response = err.getResponse();
          // Handle both string error messages and object responses
          if (typeof response === 'string') {
            message = response;
          } else if (typeof response === 'object') {
            message = (response as any).message || message;
            errors = (response as any).errors || null;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }

        return throwError(() => ({
          status: 'error',
          statusCode,
          message,
          errors,
          timestamp: new Date().toISOString(),
        }));
      }),
    );
  }
}
