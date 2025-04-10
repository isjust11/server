import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { NOTIFICATION_MESSAGES } from '../constants/notification.constants';

@Catch(HttpException)
export class MessageFilter implements ExceptionFilter {
  constructor(private readonly notificationService: NotificationService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // Gửi thông báo lỗi
    this.notificationService.notifySystemError({
      orderId: request.body?.orderId || 'unknown',
      userId: request.user?.id || 'unknown',
      userName: request.user?.name || 'unknown',
      error: exception.message,
      message: NOTIFICATION_MESSAGES.SYSTEM_ERROR,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
} 