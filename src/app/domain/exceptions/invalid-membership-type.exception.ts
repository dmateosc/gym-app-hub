import { DomainException } from '@shared/domain/domain.exception';

export class InvalidMembershipTypeException extends DomainException {
  constructor(type: string) {
    super(`Invalid membership type: ${type}. Valid types are: basic, premium, vip`, 'INVALID_MEMBERSHIP_TYPE');
  }
}