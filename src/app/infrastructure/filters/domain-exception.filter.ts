import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '@shared/domain/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.getHttpStatus(exception.code);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      code: exception.code,
      timestamp: new Date().toISOString(),
    });
  }

  private getHttpStatus(code: string): number {
    switch (code) {
      case 'USER_NOT_FOUND':
        return HttpStatus.NOT_FOUND;
      case 'DUPLICATE_EMAIL':
        return HttpStatus.CONFLICT;
      case 'INVALID_EMAIL':
      case 'INVALID_PHONE':
      case 'INVALID_MEMBERSHIP_TYPE':
      case 'USER_VALIDATION_ERROR':
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}