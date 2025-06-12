import { ValueObject } from '@shared/domain/value-object.base';
import { InvalidMembershipTypeException } from '../exceptions/invalid-membership-type.exception';

interface MembershipTypeProps {
  value: string;
}

export class MembershipType extends ValueObject<MembershipTypeProps> {
  private static readonly VALID_TYPES = ['basic', 'premium', 'vip'];

  constructor(type: string) {
    super({ value: type.toLowerCase() });
  }

  protected validate(): void {
    if (!MembershipType.VALID_TYPES.includes(this.props.value)) {
      throw new InvalidMembershipTypeException(this.props.value);
    }
  }

  get value(): string {
    return this.props.value;
  }

  static create(type: string): MembershipType {
    return new MembershipType(type);
  }

  static basic(): MembershipType {
    return new MembershipType('basic');
  }

  static premium(): MembershipType {
    return new MembershipType('premium');
  }

  static vip(): MembershipType {
    return new MembershipType('vip');
  }

  isBasic(): boolean {
    return this.props.value === 'basic';
  }

  isPremium(): boolean {
    return this.props.value === 'premium';
  }

  isVip(): boolean {
    return this.props.value === 'vip';
  }
}