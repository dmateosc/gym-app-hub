import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CreateGymRequest, gymService } from '../services/gymService';

// Query keys
export const gymKeys = {
  all: ['gyms'] as const,
  lists: () => [...gymKeys.all, 'list'] as const,
  list: (filters: string) => [...gymKeys.lists(), { filters }] as const,
  details: () => [...gymKeys.all, 'detail'] as const,
  detail: (id: string) => [...gymKeys.details(), id] as const,
  active: () => [...gymKeys.all, 'active'] as const,
  byCity: (city: string) => [...gymKeys.all, 'city', city] as const,
};

// Get all gyms
export const useGyms = () => {
  return useQuery({
    queryKey: gymKeys.lists(),
    queryFn: gymService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get gym by ID
export const useGym = (id: string) => {
  return useQuery({
    queryKey: gymKeys.detail(id),
    queryFn: () => gymService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get active gyms
export const useActiveGyms = () => {
  return useQuery({
    queryKey: gymKeys.active(),
    queryFn: gymService.getActive,
    staleTime: 5 * 60 * 1000,
  });
};

// Get gyms by city
export const useGymsByCity = (city: string) => {
  return useQuery({
    queryKey: gymKeys.byCity(city),
    queryFn: () => gymService.getByCity(city),
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
  });
};

// Create gym mutation
export const useCreateGym = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gym: CreateGymRequest) => gymService.create(gym),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymKeys.all });
      toast.success('Gym created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to create gym');
    },
  });
};

// Update gym mutation
export const useUpdateGym = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, gym }: { id: string; gym: Partial<CreateGymRequest> }) =>
      gymService.update(id, gym),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: gymKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: gymKeys.lists() });
      toast.success('Gym updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update gym');
    },
  });
};

// Delete gym mutation
export const useDeleteGym = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gymService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymKeys.all });
      toast.success('Gym deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to delete gym');
    },
  });
};

// Check gym capacity
export const useGymCapacityCheck = (id: string, currentUsers: number) => {
  return useQuery({
    queryKey: ['gym-capacity', id, currentUsers],
    queryFn: () => gymService.checkCapacity(id, currentUsers),
    enabled: !!id && currentUsers >= 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Check gym operating hours
export const useGymOperatingHours = (id: string, day: string, time: string) => {
  return useQuery({
    queryKey: ['gym-operating-hours', id, day, time],
    queryFn: () => gymService.checkOperatingHours(id, day, time),
    enabled: !!id && !!day && !!time,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
