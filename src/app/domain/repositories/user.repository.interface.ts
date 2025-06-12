import { User } from '../entities/user.entity';

export interface UserRepositoryInterface {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
  findByMembershipType(membershipType: string): Promise<User[]>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}