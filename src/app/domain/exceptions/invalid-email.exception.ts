import { DomainException } from '@shared/domain/domain.exception';

export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`Invalid email format: ${email}`, 'INVALID_EMAIL');
  }
}