// src/module/student/store/useStudentStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// no shallow equality to match store typing
import { StudentFilters } from '../types/student.types';

interface StudentStoreState {
  // Selection state
  selectedStudentId: string | null;
  selectedStudents: string[];

  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isViewModalOpen: boolean;

  // Filter and view states
  filters: StudentFilters;
  currentView: 'list' | 'grid' | 'table';
  searchQuery: string;

  // UI states
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedStudentId: (id: string | null) => void;
  setSelectedStudents: (ids: string[]) => void;
  addSelectedStudent: (id: string) => void;
  removeSelectedStudent: (id: string) => void;
  clearSelectedStudents: () => void;

  // Modal actions
  setCreateModalOpen: (open: boolean) => void;
  setEditModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
  setViewModalOpen: (open: boolean) => void;
  closeAllModals: () => void;

  // Filter actions
  setFilters: (filters: Partial<StudentFilters>) => void;
  resetFilters: () => void;
  updateFilter: <K extends keyof StudentFilters>(key: K, value: StudentFilters[K]) => void;

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

const initialFilters: StudentFilters = {
  page: 1,
  limit: 10,
  sortBy: 'name',
  order: 'asc',
};

const initialState = {
  selectedStudentId: null,
  selectedStudents: [],
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

export const useStudentStore = create<StudentStoreState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Selection actions
      setSelectedStudentId: (id) => set({ selectedStudentId: id }),
      
      setSelectedStudents: (ids) => set({ selectedStudents: ids }),
      
      addSelectedStudent: (id) => {
        const { selectedStudents } = get();
        if (!selectedStudents.includes(id)) {
          set({ selectedStudents: [...selectedStudents, id] });
        }
      },
      
      removeSelectedStudent: (id) => {
        const { selectedStudents } = get();
        set({ selectedStudents: selectedStudents.filter(studentId => studentId !== id) });
      },
      
      clearSelectedStudents: () => set({ selectedStudents: [] }),

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
      setFilters: (newFilters) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },
      
      resetFilters: () => set({ filters: initialFilters }),
      
      updateFilter: (key, value) => {
        const { filters } = get();
        set({ filters: { ...filters, [key]: value } });
      },

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
    {
      name: 'student-store',
    }
  )
);

// Selector hooks for better performance
export const useStudentSelection = () => {
  return useStudentStore((state) => ({
    selectedStudentId: state.selectedStudentId,
    selectedStudents: state.selectedStudents,
    setSelectedStudentId: state.setSelectedStudentId,
    setSelectedStudents: state.setSelectedStudents,
    addSelectedStudent: state.addSelectedStudent,
    removeSelectedStudent: state.removeSelectedStudent,
    clearSelectedStudents: state.clearSelectedStudents,
  }));
};

export const useStudentModals = () => {
  return useStudentStore((state) => ({
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
export const useStudentFilters = () => {
  const filters = useStudentStore((state) => state.filters);
  const setFilters = useStudentStore((state) => state.setFilters);
  const resetFilters = useStudentStore((state) => state.resetFilters);
  const updateFilter = useStudentStore((state) => state.updateFilter);
  
  return { filters, setFilters, resetFilters, updateFilter };
};

export const useStudentView = () => {
  return useStudentStore((state) => ({
    currentView: state.currentView,
    searchQuery: state.searchQuery,
    setCurrentView: state.setCurrentView,
    setSearchQuery: state.setSearchQuery,
  }));
};

export const useStudentUI = () => {
  return useStudentStore((state) => ({
    isLoading: state.isLoading,
    error: state.error,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
  }));
};