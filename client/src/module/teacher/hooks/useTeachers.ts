// src/module/teacher/hooks/useTeachers.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import teacherService from '../services/teacher.service';
import {
  CreateTeacherRequest,
  UpdateTeacherRequest,
  TeacherFilters,
} from '../types/teacher.types';

// Query Keys
export const TEACHER_KEYS = {
  all: ['teachers'] as const,
  lists: () => [...TEACHER_KEYS.all, 'list'] as const,
  list: (filters: TeacherFilters) => [...TEACHER_KEYS.lists(), filters] as const,
  details: () => [...TEACHER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TEACHER_KEYS.details(), id] as const,
  selection: () => [...TEACHER_KEYS.all, 'selection'] as const,
  selectionFiltered: (filters: TeacherFilters) => [...TEACHER_KEYS.selection(), filters] as const,
  withClasses: () => [...TEACHER_KEYS.all, 'withClasses'] as const,
  withClassesFiltered: (filters: TeacherFilters) => [...TEACHER_KEYS.withClasses(), filters] as const,
  count: () => [...TEACHER_KEYS.all, 'count'] as const,
  countFiltered: (filters: TeacherFilters) => [...TEACHER_KEYS.count(), filters] as const,
  grouped: () => [...TEACHER_KEYS.all, 'grouped'] as const,
  groupedFiltered: (filters: TeacherFilters) => [...TEACHER_KEYS.grouped(), filters] as const,
  currentProfile: () => [...TEACHER_KEYS.all, 'currentProfile'] as const,
};

// Query Hooks
export const useTeachers = (filters: TeacherFilters = {}) => {
  return useQuery({
    queryKey: TEACHER_KEYS.list(filters),
    queryFn: () => teacherService.getAllTeachers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: TEACHER_KEYS.detail(id),
    queryFn: () => teacherService.getTeacherById(id),
    enabled: !!id,
  });
};

export const useTeachersForSelection = (filters: TeacherFilters = {}) => {
  return useQuery({
    queryKey: TEACHER_KEYS.selectionFiltered(filters),
    queryFn: () => teacherService.getTeachersForSelection(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes (selection data changes less frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useTeachersWithClasses = (filters: TeacherFilters = {}) => {
  return useQuery({
    queryKey: TEACHER_KEYS.withClassesFiltered(filters),
    queryFn: () => teacherService.getTeachersWithClasses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTeacherCount = (filters: TeacherFilters = {}) => {
  return useQuery({
    queryKey: TEACHER_KEYS.countFiltered(filters),
    queryFn: () => teacherService.getTeacherCount(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (stats change less frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGroupedTeachers = (filters: TeacherFilters = {}) => {
  return useQuery({
    queryKey: TEACHER_KEYS.groupedFiltered(filters),
    queryFn: () => teacherService.getGroupedTeachers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCurrentTeacherProfile = () => {
  return useQuery({
    queryKey: TEACHER_KEYS.currentProfile(),
    queryFn: () => teacherService.getCurrentTeacherProfile(),
    staleTime: 30 * 60 * 1000, // 30 minutes (profile data changes less frequently)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Mutation Hooks
export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherRequest) => teacherService.createTeacher(data),
    onSuccess: () => {
      // Invalidate all teacher-related queries
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherRequest }) => 
      teacherService.updateTeacher(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific teacher query and all lists
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.lists() });
    },
  });
};

export const useUpdateOwnTeacherProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeacherRequest) => teacherService.updateOwnProfile(data),
    onSuccess: () => {
      // Invalidate current profile query
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.currentProfile() });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teacherService.deleteTeacher(id),
    onSuccess: () => {
      // Invalidate all teacher-related queries
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all });
    },
  });
};

// Combined operations hook for convenience
export const useTeacherOperations = () => {
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();
  const updateOwnProfile = useUpdateOwnTeacherProfile();

  return {
    createTeacher,
    updateTeacher,
    deleteTeacher,
    updateOwnProfile,
  };
};