import { ValueObject } from '@shared/domain/value-object.base';
import { InvalidEmailException } from '../exceptions/invalid-email.exception';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  constructor(email: string) {
    super({ value: email });
  }

  protected validate(): void {
    if (!this.isValidEmail(this.props.value)) {
      throw new InvalidEmailException(this.props.value);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get value(): string {
    return this.props.value;
  }

  static create(email: string): Email {
    return new Email(email);
  }
}