import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class DomainExceptionFilter<T> implements ExceptionFilter {
  catch(_exception: T, host: ArgumentsHost) {}
}
