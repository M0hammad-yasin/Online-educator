// src/module/teacher/store/useTeacherStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TeacherFilters } from '../types/teacher.types';

interface TeacherStoreState {
  // Selection state
  selectedTeacherId: string | null;
  selectedTeachers: string[];

  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isViewModalOpen: boolean;

  // Filter and view states
  filters: TeacherFilters;
  currentView: 'list' | 'grid' | 'table';
  searchQuery: string;

  // UI states
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedTeacherId: (id: string | null) => void;
  setSelectedTeachers: (ids: string[]) => void;
  addSelectedTeacher: (id: string) => void;
  removeSelectedTeacher: (id: string) => void;
  clearSelectedTeachers: () => void;

  // Modal actions
  setCreateModalOpen: (open: boolean) => void;
  setEditModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
  setViewModalOpen: (open: boolean) => void;
  closeAllModals: () => void;

  // Filter actions
  setFilters: (filters: Partial<TeacherFilters>) => void;
  resetFilters: () => void;
  updateFilter: <K extends keyof TeacherFilters>(key: K, value: TeacherFilters[K]) => void;

  // View actions
  setCurrentView: (view: 'list' | 'grid' | 'table') => void;
  setSearchQuery: (query: string) => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Utility actions
  reset: () => void;
}

const initialFilters: TeacherFilters = {
  page: 1,
  limit: 10,
  sortBy: 'name',
  order: 'asc',
};

const initialState = {
  selectedTeacherId: null,
  selectedTeachers: [],
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isViewModalOpen: false,
  filters: initialFilters,
  currentView: 'table' as const,
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const useTeacherStore = create<TeacherStoreState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Selection actions
      setSelectedTeacherId: (id) => set({ selectedTeacherId: id }),
      
      setSelectedTeachers: (ids) => set({ selectedTeachers: ids }),
      
      addSelectedTeacher: (id) => {
        const { selectedTeachers } = get();
        if (!selectedTeachers.includes(id)) {
          set({ selectedTeachers: [...selectedTeachers, id] });
        }
      },
      
      removeSelectedTeacher: (id) => {
        const { selectedTeachers } = get();
        set({ selectedTeachers: selectedTeachers.filter(teacherId => teacherId !== id) });
      },
      
      clearSelectedTeachers: () => set({ selectedTeachers: [] }),

      // Modal actions
      setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
      
      setEditModalOpen: (open) => set({ isEditModalOpen: open }),
      
      setDeleteModalOpen: (open) => set({ isDeleteModalOpen: open }),
      
      setViewModalOpen: (open) => set({ isViewModalOpen: open }),
      
      closeAllModals: () => set({
        isCreateModalOpen: false,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
        isViewModalOpen: false,
      }),

      // Filter actions
      setFilters: (filters) => set({
        filters: { ...get().filters, ...filters },
      }),
      
      resetFilters: () => set({ filters: initialFilters }),
      
      updateFilter: (key, value) => set({
        filters: { ...get().filters, [key]: value },
      }),

      // View actions
      setCurrentView: (view) => set({ currentView: view }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),

      // UI actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Utility actions
      reset: () => set(initialState),
    }),
    { name: 'teacher-store' }
  )
);

// Selector hooks for convenience
export const useTeacherSelection = () => {
  return useTeacherStore(state => ({
    selectedTeacherId: state.selectedTeacherId,
    selectedTeachers: state.selectedTeachers,
    setSelectedTeacherId: state.setSelectedTeacherId,
    setSelectedTeachers: state.setSelectedTeachers,
    addSelectedTeacher: state.addSelectedTeacher,
    removeSelectedTeacher: state.removeSelectedTeacher,
    clearSelectedTeachers: state.clearSelectedTeachers,
  }));
};

export const useTeacherModals = () => {
  return useTeacherStore(state => ({
    isCreateModalOpen: state.isCreateModalOpen,
    isEditModalOpen: state.isEditModalOpen,
    isDeleteModalOpen: state.isDeleteModalOpen,
    isViewModalOpen: state.isViewModalOpen,
    setCreateModalOpen: state.setCreateModalOpen,
    setEditModalOpen: state.setEditModalOpen,
    setDeleteModalOpen: state.setDeleteModalOpen,
    setViewModalOpen: state.setViewModalOpen,
    closeAllModals: state.closeAllModals,
  }));
};

export const useTeacherFilters = () => {
  return useTeacherStore(state => ({
    filters: state.filters,
    setFilters: state.setFilters,
    resetFilters: state.resetFilters,
    updateFilter: state.updateFilter,
  }));
};

export const useTeacherView = () => {
  return useTeacherStore(state => ({
    currentView: state.currentView,
    searchQuery: state.searchQuery,
    setCurrentView: state.setCurrentView,
    setSearchQuery: state.setSearchQuery,
  }));
};

export const useTeacherUI = () => {
  return useTeacherStore(state => ({
    isLoading: state.isLoading,
    error: state.error,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
  }));
};