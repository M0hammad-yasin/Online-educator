// client/src/hooks/useGlobalSearch.ts

import { useQuery } from '@tanstack/react-query';
import { useAuthUser } from '../module/authentication/store/authStore';
import { Role } from '../constants/role';
import useRole from './useRole';
import { classService } from '../module/classes';
import { teacherService } from '../module/teacher';
import { studentService } from '../module/student';

export const SEARCH_QUERY_KEYS = {
  all: ['search'] as const,
  global: (query: string) => [...SEARCH_QUERY_KEYS.all, 'global', query] as const,
  teachers: (query: string) => [...SEARCH_QUERY_KEYS.all, 'teachers', query] as const,
  students: (query: string) => [...SEARCH_QUERY_KEYS.all, 'students', query] as const,
  classes: (query: string) => [...SEARCH_QUERY_KEYS.all, 'classes', query] as const,
};

interface UseGlobalSearchProps {
  query: string;
  limit?: number;
  enabled?: boolean;
}

/**
 * Performs a unified global search across teachers, students, and classes.
 * Used internally by the useGlobalSearch React Query hook.
 */
const globalSearch = async ({ query, limit = 5 }: UseGlobalSearchProps) => {
  const search = query.trim();
  if (!search) {
    return { success: true, message: 'Empty search query', data: { teachers: [], students: [], classes: [] } };
  }

  try {
    const [classes, teachers, students] = await Promise.all([
      classService.searchClasses({ search, limit }),
      teacherService.searchTeachers({ search, limit }),
      studentService.searchStudents({ search, limit }),
    ]);

    return {
      success: true,
      message: 'Search results fetched successfully',
      data: {
        classes: classes?.data || [],
        teachers: teachers?.data || [],
        students: students?.data || [],
      },
    };
  } catch (error: any) {
    console.error('[Global Search Error]', error);
    throw new Error(error?.message || 'Failed to fetch search results');
  }
};

/**
 * Unified Global Search Hook
 */
export const useGlobalSearch = ({
  query,
  limit = 5,
  enabled = true,
}: UseGlobalSearchProps) => {
  const currentRole = useRole();
  const trimmedQuery = query.trim();

  // Only search if query is at least 1 character long and user role is known
  const shouldSearch = enabled && trimmedQuery.length >= 1 && !!currentRole;

  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.global(trimmedQuery),
    queryFn: () => globalSearch({ query: trimmedQuery, limit }),
    enabled: shouldSearch,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });
};

/**
 * Individual search hooks (modular, role-aware)
 */

export const useSearchTeachers = ({ query, limit = 10, enabled = true }: UseGlobalSearchProps) => {
  const currentRole = useRole();
  const trimmedQuery = query.trim();
  const canSearch = [Role.ADMIN, Role.MODERATOR].includes(currentRole as any);

  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.teachers(trimmedQuery),
    queryFn: () => teacherService.searchTeachers({ search: trimmedQuery, limit }),
    enabled: enabled && canSearch && trimmedQuery.length >= 2,
    staleTime: 30 * 1000,
  });
};

export const useSearchStudents = ({ query, limit = 10, enabled = true }: UseGlobalSearchProps) => {
  const currentRole = useRole();
  const trimmedQuery = query.trim();
  const canSearch = [Role.ADMIN, Role.MODERATOR, Role.TEACHER].includes(currentRole as any);

  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.students(trimmedQuery),
    queryFn: () => studentService.searchStudents({ search: trimmedQuery, limit }),
    enabled: enabled && canSearch && trimmedQuery.length >= 2,
    staleTime: 30 * 1000,
  });
};

export const useSearchClasses = ({ query, limit = 10, enabled = true }: UseGlobalSearchProps) => {
  const trimmedQuery = query.trim();
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.classes(trimmedQuery),
    queryFn: () => classService.searchClasses({ search: trimmedQuery, limit }),
    enabled: enabled && trimmedQuery.length >= 2,
    staleTime: 30 * 1000,
  });
};
