import { User } from '../../domain/entities/user.entity';

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract findActiveUsers(): Promise<User[]>;
  abstract findByMembershipType(membershipType: string): Promise<User[]>;
  abstract update(id: string, user: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract exists(id: string): Promise<boolean>;
}