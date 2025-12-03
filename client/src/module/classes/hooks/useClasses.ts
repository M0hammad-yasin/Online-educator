// client/src/module/classes/hooks/useClasses.ts

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { classService } from '../services/class.service';
import {
  CreateClassRequest,
  UpdateClassRequest,
  ClassFilters,
  Class,
} from '../index';

// Query Keys
export const CLASS_QUERY_KEYS = {
  all: ['classes'] as const,
  lists: () => [...CLASS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: ClassFilters) => [...CLASS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...CLASS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CLASS_QUERY_KEYS.details(), id] as const,
  selection: (filters: ClassFilters) => [...CLASS_QUERY_KEYS.all, 'selection', { filters }] as const,
  count: (filters?: ClassFilters) => [...CLASS_QUERY_KEYS.all, 'count', { filters }] as const,
  countByGroup: (filters: ClassFilters) => [...CLASS_QUERY_KEYS.all, 'countByGroup', filters] as const,
  grouped: (filters?: ClassFilters) => [...CLASS_QUERY_KEYS.all, 'grouped', { filters }] as const,
  calendar: (filters?: ClassFilters) => [...CLASS_QUERY_KEYS.all, 'calendar', { filters }] as const,
};

// Fetch Classes
export const useClasses = (filters?: ClassFilters, options?: Partial<UseQueryOptions<any, any, any, any>>) => {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.list(filters),
    queryFn: () => classService.getAllClasses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Fetch Single Class
export const useClass = (id: string) => {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.detail(id),
    queryFn: () => classService.getClassById(id),
    enabled: !!id,
  });
};

// Fetch Classes for Selection
export const useClassesForSelection = (filters: ClassFilters) => {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.selection(filters),
    queryFn: () => classService.getClassesForSelection(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch Classes Count
export const useClassesCount = (filters?: ClassFilters) => {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.count(filters),
    queryFn: () => classService.getClassesCount(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Fetch Classes Count by Group
export const useClassesCountByGroup = (filters: ClassFilters = {}) => {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.countByGroup(filters),
    queryFn: () => classService.getClassesCountByGroup(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch Grouped Classes
export const useGroupedClasses = (filters?: ClassFilters) => {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.grouped(filters),
    queryFn: () => classService.getGroupedClasses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch Calendar Classes
export const useCalendarClasses = (filters?: ClassFilters) => {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.calendar(filters),
    queryFn: () => classService.getCalendarClasses(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create Class Mutation
export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassRequest) => classService.createClass(data),
    onSuccess: () => {
      // Invalidate all class-related queries
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.all });
    },
  });
};

// Update Class Mutation
export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassRequest }) =>
      classService.updateClass(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific class and all lists
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.count() });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.grouped() });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.calendar() });
    },
  });
};

// Delete Class Mutation
export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classService.deleteClass(id),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: CLASS_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.count() });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.grouped() });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.calendar() });
    },
  });
};
export const useClassStats = (filters?: ClassFilters) => {
  return useClasses(
    filters,
    {
      select: (response) => {
        const classes = response?.data ?? [];

        // Single-pass reducer (3–4x faster than multiple .filter calls)
        const stats = classes.reduce(
          (acc: any, c: Class) => {
            acc.total++;
            switch (c.status) {
              case "COMPLETED":
                acc.completed++;
                break;
              case "IN_PROGRESS":
                acc.active++;
                break;
              case "SCHEDULED":
                acc.scheduled++;
                break;
            }

            return acc;
          },
          {
            total: 0,
            completed: 0,
            active: 0,
            scheduled: 0,
          }
        );

        const completionRate =
          stats.total > 0
            ? Number(((stats.completed / stats.total) * 100).toFixed(1))
            : 0;

        return {
          totalClasses: stats.total,
          completedClasses: stats.completed,
          activeClasses: stats.active,
          scheduledClasses: stats.scheduled,
          completionRate,
        };
      },

      // Prevent unnecessary re-renders
      notifyOnChangeProps: ["data", "isLoading"],
    }
  );
};
