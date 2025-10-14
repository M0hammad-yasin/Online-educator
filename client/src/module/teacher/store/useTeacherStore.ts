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

export const useTeacherSelection = () => { 
  const selectedTeacherId = useTeacherStore((state) => state.selectedTeacherId);
  const selectedTeachers = useTeacherStore((state) => state.selectedTeachers);
  const setSelectedTeacherId = useTeacherStore((state) => state.setSelectedTeacherId);
  const setSelectedTeachers = useTeacherStore((state) => state.setSelectedTeachers);
  const addSelectedTeacher = useTeacherStore((state) => state.addSelectedTeacher);
  const removeSelectedTeacher = useTeacherStore((state) => state.removeSelectedTeacher);
  const clearSelectedTeachers = useTeacherStore((state) => state.clearSelectedTeachers);

  return { 
    selectedTeacherId, 
    selectedTeachers, 
    setSelectedTeacherId, 
    setSelectedTeachers, 
    addSelectedTeacher, 
    removeSelectedTeacher, 
    clearSelectedTeachers 
  };
};

export const useTeacherModals = () => { 
  const isCreateModalOpen = useTeacherStore((state) => state.isCreateModalOpen);
  const isEditModalOpen = useTeacherStore((state) => state.isEditModalOpen);
  const isDeleteModalOpen = useTeacherStore((state) => state.isDeleteModalOpen);
  const isViewModalOpen = useTeacherStore((state) => state.isViewModalOpen);
  const setCreateModalOpen = useTeacherStore((state) => state.setCreateModalOpen);
  const setEditModalOpen = useTeacherStore((state) => state.setEditModalOpen);
  const setDeleteModalOpen = useTeacherStore((state) => state.setDeleteModalOpen);
  const setViewModalOpen = useTeacherStore((state) => state.setViewModalOpen);
  const closeAllModals = useTeacherStore((state) => state.closeAllModals);

  return {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isViewModalOpen,
    setCreateModalOpen,
    setEditModalOpen,
    setDeleteModalOpen,
    setViewModalOpen,
    closeAllModals,
  };
};

export const useTeacherFilters = () => {
    const filters = useTeacherStore((state) => state.filters);
    const setFilters = useTeacherStore((state) => state.setFilters);
    const resetFilters = useTeacherStore((state) => state.resetFilters);
    const updateFilter = useTeacherStore((state) => state.updateFilter);
    return { filters, setFilters, resetFilters, updateFilter };
};