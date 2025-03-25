import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class PermissionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof ForbiddenException) {
          return throwError(() => ({
            statusCode: 403,
            message: 'Bạn không có quyền truy cập chức năng này',
            error: 'Forbidden',
          }));
        }
        return throwError(() => error);
      }),
    );
  }
} 