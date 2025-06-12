export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipType: MembershipType;
  joinDate: string;
  isActive: boolean;
}

export type MembershipType = 'basic' | 'premium' | 'vip';

export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  membershipType?: MembershipType;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  membershipType?: MembershipType;
}

export interface ApiError {
  statusCode: number;
  message: string;
  code: string;
  timestamp: string;
}