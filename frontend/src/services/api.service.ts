import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { User, CreateUserRequest, UpdateUserRequest, MembershipType } from '@/types/user.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Users endpoints
  async getUsers(membershipType?: MembershipType): Promise<User[]> {
    const params = membershipType ? { membershipType } : {};
    const response: AxiosResponse<User[]> = await this.api.get('/api/users', { params });
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/api/users/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/api/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/api/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/api/users/${id}`);
  }
}

export const apiService = new ApiService();