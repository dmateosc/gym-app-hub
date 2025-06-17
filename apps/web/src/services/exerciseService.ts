import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'sports';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  warnings: string[];
  imageUrl?: string;
  videoUrl?: string;
  estimatedCaloriesPerMinute?: number;
  createdBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExerciseRequest {
  name: string;
  description: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'sports';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips?: string[];
  warnings?: string[];
  imageUrl?: string;
  videoUrl?: string;
  estimatedCaloriesPerMinute?: number;
  createdBy?: string;
}

export const exerciseService = {
  // Get all exercises
  getAll: async (): Promise<Exercise[]> => {
    const response = await api.get('/exercises');
    return response.data;
  },

  // Get exercise by ID
  getById: async (id: string): Promise<Exercise> => {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },

  // Get active exercises
  getActive: async (): Promise<Exercise[]> => {
    const response = await api.get('/exercises/active');
    return response.data;
  },

  // Get bodyweight exercises
  getBodyweight: async (): Promise<Exercise[]> => {
    const response = await api.get('/exercises/bodyweight');
    return response.data;
  },

  // Get exercises by category
  getByCategory: async (category: string): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/category/${category}`);
    return response.data;
  },

  // Get exercises by muscle group
  getByMuscleGroup: async (muscleGroup: string): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/muscle-group/${muscleGroup}`);
    return response.data;
  },

  // Get exercises by difficulty
  getByDifficulty: async (difficulty: string): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/difficulty/${difficulty}`);
    return response.data;
  },

  // Get exercises by equipment
  getByEquipment: async (equipment: string): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/equipment/${equipment}`);
    return response.data;
  },

  // Search exercises by name
  search: async (name: string): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/search?name=${name}`);
    return response.data;
  },

  // Get exercises by creator
  getByCreator: async (creatorId: string): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/creator/${creatorId}`);
    return response.data;
  },

  // Create new exercise
  create: async (exercise: CreateExerciseRequest): Promise<Exercise> => {
    const response = await api.post('/exercises', exercise);
    return response.data;
  },

  // Update exercise
  update: async (id: string, exercise: Partial<CreateExerciseRequest>): Promise<Exercise> => {
    const response = await api.put(`/exercises/${id}`, exercise);
    return response.data;
  },

  // Delete exercise
  delete: async (id: string): Promise<void> => {
    await api.delete(`/exercises/${id}`);
  },
};

export default exerciseService;
