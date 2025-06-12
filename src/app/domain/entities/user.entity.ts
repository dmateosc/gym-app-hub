import { BaseEntity } from '@shared/domain/base.entity';
import { Email } from '../value-objects/email.vo';
import { MembershipType } from '../value-objects/membership-type.vo';
import { Phone } from '../value-objects/phone.vo';
import { UserValidationException } from '../exceptions/user-validation.exception';

export interface UserProps {
  name: string;
  email: Email;
  phone?: Phone;
  membershipType: MembershipType;
  joinDate: Date;
  isActive: boolean;
}

export class User extends BaseEntity {
  private constructor(
    private readonly props: UserProps,
    id?: string,
  ) {
    super(id);
    this.validate();
  }

  static create(props: Omit<UserProps, 'joinDate' | 'isActive'>, id?: string): User {
    return new User(
      {
        ...props,
        joinDate: new Date(),
        isActive: true,
      },
      id,
    );
  }

  static restore(props: UserProps, id: string): User {
    return new User(props, id);
  }

  validate(): void {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new UserValidationException('Name cannot be empty');
    }

    if (this.props.name.length > 100) {
      throw new UserValidationException('Name cannot exceed 100 characters');
    }
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get phone(): Phone | undefined {
    return this.props.phone;
  }

  get membershipType(): MembershipType {
    return this.props.membershipType;
  }

  get joinDate(): Date {
    return this.props.joinDate;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  // Business methods
  updateName(name: string): void {
    this.props.name = name.trim();
    this.validate();
  }

  updatePhone(phone: string): void {
    this.props.phone = Phone.create(phone);
  }

  removePhone(): void {
    this.props.phone = undefined;
  }

  upgradeMembership(membershipType: MembershipType): void {
    this.props.membershipType = membershipType;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  activate(): void {
    this.props.isActive = true;
  }

  canUpgradeToVip(): boolean {
    return this.props.membershipType.isPremium();
  }

  canUpgradeToPremium(): boolean {
    return this.props.membershipType.isBasic();
  }
}