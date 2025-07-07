import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, classService, User, Class, CreateData, UpdateData } from './index';

// User hooks
export const useUsers = (params?: any) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
};

export const useUserByEmail = (email: string) => {
  return useQuery({
    queryKey: ['users', 'email', email],
    queryFn: () => userService.getByEmail(email),
    enabled: !!email,
  });
};

export const useUsersByRole = (role: User['role'], params?: any) => {
  return useQuery({
    queryKey: ['users', 'role', role, params],
    queryFn: () => userService.getByRole(role, params),
    enabled: !!role,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateData<User>) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateData<User> }) =>
      userService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, profileData }: { userId: string; profileData: Partial<User> }) =>
      userService.updateProfile(userId, profileData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ userId, currentPassword, newPassword }: {
      userId: string;
      currentPassword: string;
      newPassword: string;
    }) => userService.changePassword(userId, currentPassword, newPassword),
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, imageFile }: { userId: string; imageFile: File }) =>
      userService.uploadProfileImage(userId, imageFile),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
    },
  });
};

// Class hooks
export const useClasses = (params?: any) => {
  return useQuery({
    queryKey: ['classes', params],
    queryFn: () => classService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClass = (id: string) => {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: () => classService.getById(id),
    enabled: !!id,
  });
};

export const useClassesByTeacher = (teacherId: string, params?: any) => {
  return useQuery({
    queryKey: ['classes', 'teacher', teacherId, params],
    queryFn: () => classService.getByTeacher(teacherId, params),
    enabled: !!teacherId,
  });
};

export const useClassesBySubject = (subject: string, params?: any) => {
  return useQuery({
    queryKey: ['classes', 'subject', subject, params],
    queryFn: () => classService.getBySubject(subject, params),
    enabled: !!subject,
  });
};

export const useActiveClasses = (params?: any) => {
  return useQuery({
    queryKey: ['classes', 'active', params],
    queryFn: () => classService.getActiveClasses(params),
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateData<Class>) => classService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateData<Class> }) =>
      classService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes', id] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => classService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useEnrollStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      classService.enrollStudent(classId, studentId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['classes', classId] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useUnenrollStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      classService.unenrollStudent(classId, studentId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['classes', classId] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useEnrolledStudents = (classId: string) => {
  return useQuery({
    queryKey: ['classes', classId, 'students'],
    queryFn: () => classService.getEnrolledStudents(classId),
    enabled: !!classId,
  });
};

export const useUpdateClassSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, schedule }: { classId: string; schedule: any[] }) =>
      classService.updateSchedule(classId, schedule),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['classes', classId] });
    },
  });
};

export const useActivateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (classId: string) => classService.activateClass(classId),
    onSuccess: (_, classId) => {
      queryClient.invalidateQueries({ queryKey: ['classes', classId] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useDeactivateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (classId: string) => classService.deactivateClass(classId),
    onSuccess: (_, classId) => {
      queryClient.invalidateQueries({ queryKey: ['classes', classId] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useCompleteClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (classId: string) => classService.completeClass(classId),
    onSuccess: (_, classId) => {
      queryClient.invalidateQueries({ queryKey: ['classes', classId] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useCancelClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, reason }: { classId: string; reason?: string }) =>
      classService.cancelClass(classId, reason),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['classes', classId] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useSearchClasses = (searchTerm: string, params?: any) => {
  return useQuery({
    queryKey: ['classes', 'search', searchTerm, params],
    queryFn: () => classService.searchClasses(searchTerm, params),
    enabled: !!searchTerm,
  });
};

export const usePopularClasses = (limit: number = 10) => {
  return useQuery({
    queryKey: ['classes', 'popular', limit],
    queryFn: () => classService.getPopularClasses(limit),
  });
};

export const useUpcomingClasses = (days: number = 30, params?: any) => {
  return useQuery({
    queryKey: ['classes', 'upcoming', days, params],
    queryFn: () => classService.getUpcomingClasses(days, params),
  });
};

export const useUploadClassMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, file, description }: {
      classId: string;
      file: File;
      description?: string;
    }) => classService.uploadClassMaterial(classId, file, description),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['classes', classId] });
    },
  });
};

// Utility hooks
export const useApiError = (error: any) => {
  if (!error) return null;
  
  // Handle different error types
  if (error.status === 401) {
    return { type: 'unauthorized', message: 'Please log in again' };
  }
  
  if (error.status === 403) {
    return { type: 'forbidden', message: 'You do not have permission to perform this action' };
  }
  
  if (error.status === 404) {
    return { type: 'not-found', message: 'The requested resource was not found' };
  }
  
  if (error.status === 422) {
    return { type: 'validation', message: 'Please check your input and try again' };
  }
  
  if (error.isNetworkError) {
    return { type: 'network', message: 'Network error. Please check your connection' };
  }
  
  return { type: 'unknown', message: error.message || 'An unexpected error occurred' };
}; 