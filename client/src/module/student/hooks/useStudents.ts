// src/module/student/hooks/useStudents.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../services/student.service';
import {
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentFilters,
} from '../types/student.types';

// Query Keys
export const STUDENT_KEYS = {
  all: ['students'] as const,
  lists: () => [...STUDENT_KEYS.all, 'list'] as const,
  list: (filters: StudentFilters) => [...STUDENT_KEYS.lists(), filters] as const,
  details: () => [...STUDENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...STUDENT_KEYS.details(), id] as const,
  selection: () => [...STUDENT_KEYS.all, 'selection'] as const,
  selectionFiltered: (filters: StudentFilters) => [...STUDENT_KEYS.selection(), filters] as const,
  withClasses: () => [...STUDENT_KEYS.all, 'withClasses'] as const,
  withClassesFiltered: (filters: StudentFilters) => [...STUDENT_KEYS.withClasses(), filters] as const,
  count: () => [...STUDENT_KEYS.all, 'count'] as const,
  countFiltered: (filters: StudentFilters) => [...STUDENT_KEYS.count(), filters] as const,
  grouped: () => [...STUDENT_KEYS.all, 'grouped'] as const,
  groupedFiltered: (filters: StudentFilters) => [...STUDENT_KEYS.grouped(), filters] as const,
  currentProfile: () => [...STUDENT_KEYS.all, 'currentProfile'] as const,
};

// Query Hooks
export const useStudents = (filters: StudentFilters = {}) => {
  return useQuery({
    queryKey: STUDENT_KEYS.list(filters),
    queryFn: () => studentService.getAllStudents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: STUDENT_KEYS.detail(id),
    queryFn: () => studentService.getStudentById(id),
    enabled: !!id,
  });
};

export const useStudentsForSelection = (filters: StudentFilters = {},enable=true) => {
  return useQuery({
    queryKey: STUDENT_KEYS.selectionFiltered(filters),
    queryFn: () => studentService.getStudentsForSelection(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes (selection data changes less frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled:enable,
  });
};

export const useStudentsWithClasses = (filters: StudentFilters = {}) => {
  return useQuery({
    queryKey: STUDENT_KEYS.withClassesFiltered(filters),
    queryFn: () => studentService.getStudentsWithClasses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useStudentCount = (filters: StudentFilters = {}) => {
  return useQuery({
    queryKey: STUDENT_KEYS.countFiltered(filters),
    queryFn: () => studentService.getStudentCount(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (stats change less frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGroupedStudents = (filters: StudentFilters = {}) => {
  return useQuery({
    queryKey: STUDENT_KEYS.groupedFiltered(filters),
    queryFn: () => studentService.getGroupedStudents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCurrentStudentProfile = () => {
  return useQuery({
    queryKey: STUDENT_KEYS.currentProfile(),
    queryFn: () => studentService.getCurrentStudentProfile(),
    staleTime: 30 * 60 * 1000, // 30 minutes (profile data changes less frequently)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Mutation Hooks
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentRequest) => studentService.createStudent(data),
    onSuccess: () => {
      // Invalidate all student-related queries
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) => 
      studentService.updateStudent(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific student and list queries
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.withClasses() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.selection() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.count() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.grouped() });
    },
  });
};

export const useUpdateOwnProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudentRequest) => studentService.updateOwnProfile(data),
    onSuccess: () => {
      // Invalidate current profile and related queries
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.currentProfile() });
      // Also invalidate auth state if needed
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentService.deleteStudent(id),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: STUDENT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.withClasses() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.selection() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.count() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.grouped() });
    },
  });
};

// Utility hook for common student operations
export const useStudentOperations = () => {
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const updateOwnProfile = useUpdateOwnProfile();
  const deleteStudent = useDeleteStudent();

  return {
    createStudent,
    updateStudent,
    updateOwnProfile,
    deleteStudent,
    isLoading: createStudent.isPending || updateStudent.isPending || 
               updateOwnProfile.isPending || deleteStudent.isPending,
  };
};