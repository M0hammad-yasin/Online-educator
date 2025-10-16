// src/module/teacher/hooks/useTeacherStatistics.ts

import { useQuery } from '@tanstack/react-query';
import { teacherStatisticsService,TeacherFilters } from '../';

// Query Keys
export const TEACHER_STATS_KEYS = {
  all: ['teacherStats'] as const,
  classCount: (filters: TeacherFilters) => [...TEACHER_STATS_KEYS.all, 'classCount', filters] as const,
  classDayCount: (filters: { date?: string }) => [...TEACHER_STATS_KEYS.all, 'classDayCount', filters] as const,
  summary: (filters: TeacherFilters) => [...TEACHER_STATS_KEYS.all, 'summary', filters] as const,
};

// Get teachers with class count
export const useTeachersWithClassCount = (filters: TeacherFilters = {}) => {
  return useQuery({
    queryKey: TEACHER_STATS_KEYS.classCount(filters),
    queryFn: () => teacherStatisticsService.getTeachersWithClassCount(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get teacher class count for a specific day
export const useTeacherClassCountForDay = (date?: string) => {
  return useQuery({
    queryKey: TEACHER_STATS_KEYS.classDayCount({ date }),
    queryFn: () => teacherStatisticsService.getTeacherClassCountForDay(date),
    enabled: !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get teacher summary statistics
export const useTeacherSummary = (filters: TeacherFilters = {}) => {
  return useQuery({
    queryKey: TEACHER_STATS_KEYS.summary(filters),
    queryFn: () => teacherStatisticsService.getTeacherSummary(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
