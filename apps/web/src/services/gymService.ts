import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

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
  createdAt: string;
  updatedAt: string;
}

export interface CreateGymRequest {
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
}

export const gymService = {
  // Get all gyms
  getAll: async (): Promise<Gym[]> => {
    const response = await api.get('/gyms');
    return response.data;
  },

  // Get gym by ID
  getById: async (id: string): Promise<Gym> => {
    const response = await api.get(`/gyms/${id}`);
    return response.data;
  },

  // Get active gyms
  getActive: async (): Promise<Gym[]> => {
    const response = await api.get('/gyms/active');
    return response.data;
  },

  // Get gyms by city
  getByCity: async (city: string): Promise<Gym[]> => {
    const response = await api.get(`/gyms/city/${city}`);
    return response.data;
  },

  // Create new gym
  create: async (gym: CreateGymRequest): Promise<Gym> => {
    const response = await api.post('/gyms', gym);
    return response.data;
  },

  // Update gym
  update: async (id: string, gym: Partial<CreateGymRequest>): Promise<Gym> => {
    const response = await api.put(`/gyms/${id}`, gym);
    return response.data;
  },

  // Delete gym
  delete: async (id: string): Promise<void> => {
    await api.delete(`/gyms/${id}`);
  },

  // Check gym capacity
  checkCapacity: async (id: string, currentUsers: number): Promise<{ withinCapacity: boolean }> => {
    const response = await api.get(`/gyms/${id}/capacity-check?currentUsers=${currentUsers}`);
    return response.data;
  },

  // Check if gym is open
  checkOperatingHours: async (id: string, day: string, time: string): Promise<{ isOpen: boolean }> => {
    const response = await api.get(`/gyms/${id}/operating-hours?day=${day}&time=${time}`);
    return response.data;
  },
};

export default gymService;
