import { DomainException } from '@shared/domain/domain.exception';

export class InvalidPhoneException extends DomainException {
  constructor(phone: string) {
    super(`Invalid phone format: ${phone}`, 'INVALID_PHONE');
  }
}