export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipType: 'basic' | 'premium' | 'vip';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gym {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  operatingHours: {
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
    sunday: { open: string; close: string; isClosed: boolean };
  };
  facilities: string[];
  maxCapacity: number;
  isActive: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string[];
  equipment: string[];
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  imageUrl?: string;
  videoUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    restTime?: number;
    notes?: string;
  }[];
  targetAudience: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  isActive: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  certifications: string[];
  experience: number;
  bio?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId: string;
  trainerId?: string;
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  exercises: {
    exerciseId: string;
    completedSets: number;
    completedReps: number;
    weight?: number;
    duration?: number;
    notes?: string;
  }[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Form Types
export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  membershipType: 'basic' | 'premium' | 'vip';
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  isActive?: boolean;
}

export interface CreateGymDto {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  operatingHours: Gym['operatingHours'];
  facilities: string[];
  maxCapacity: number;
}

export interface UpdateGymDto extends Partial<CreateGymDto> {
  isActive?: boolean;
}
