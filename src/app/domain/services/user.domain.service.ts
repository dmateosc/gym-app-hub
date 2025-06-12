import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { DuplicateEmailException } from '../exceptions/duplicate-email.exception';

@Injectable()
export class UserDomainService {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async validateUniqueEmail(email: Email, excludeUserId?: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email.value);
    
    if (existingUser && existingUser.id !== excludeUserId) {
      throw new DuplicateEmailException(email.value);
    }
  }

  calculateMembershipDiscount(user: User): number {
    if (user.membershipType.isVip()) return 0.2;
    if (user.membershipType.isPremium()) return 0.1;
    return 0;
  }

  isLongTimeMemeber(user: User): boolean {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return user.joinDate < oneYearAgo;
  }
}