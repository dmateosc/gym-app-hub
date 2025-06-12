import { ValueObject } from '@shared/domain/value-object.base';
import { InvalidPhoneException } from '../exceptions/invalid-phone.exception';

interface PhoneProps {
  value: string;
}

export class Phone extends ValueObject<PhoneProps> {
  constructor(phone: string) {
    super({ value: phone });
  }

  protected validate(): void {
    if (!this.isValidPhone(this.props.value)) {
      throw new InvalidPhoneException(this.props.value);
    }
  }

  private isValidPhone(phone: string): boolean {
    // Validación básica de teléfono (números, espacios, guiones, paréntesis)
    const phoneRegex = /^[\d\s\-\(\)\+]{7,15}$/;
    return phoneRegex.test(phone);
  }

  get value(): string {
    return this.props.value;
  }

  static create(phone: string): Phone {
    return new Phone(phone);
  }
}