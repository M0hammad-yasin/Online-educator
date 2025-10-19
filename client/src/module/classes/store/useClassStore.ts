// client/src/module/classes/store/useClassStore.ts

import { create } from 'zustand';
import { ClassFilters } from '../index';

interface ClassStoreState {
  // UI State
  selectedClassId: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isCalendarViewActive: boolean;
  
  // Filter State
  filters: ClassFilters;
  
  // View State
  currentView: 'list' | 'calendar' | 'grouped';
  
  // Actions
  setSelectedClassId: (id: string | null) => void;
  setCreateModalOpen: (open: boolean) => void;
  setEditModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
  setCalendarViewActive: (active: boolean) => void;
  setFilters: (filters: Partial<ClassFilters>) => void;
  resetFilters: () => void;
  setCurrentView: (view: 'list' | 'calendar' | 'grouped') => void;
  clearState: () => void;
}

const initialFilters: ClassFilters = {
  page: 1,
  limit: 10,
  status: 'all-classes',
  // orderBy: [], 
};

export const useClassStore = create<ClassStoreState>((set, _) => ({
  // Initial State
  selectedClassId: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isCalendarViewActive: false,
  filters: initialFilters,
  currentView: 'list',
  
  // Actions
  setSelectedClassId: (id) => set({ selectedClassId: id }),
  
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  
  setEditModalOpen: (open) => set({ 
    isEditModalOpen: open,
    // Clear selected class when closing edit modal
    ...(open === false && { selectedClassId: null })
  }),
  
  setDeleteModalOpen: (open) => set({ 
    isDeleteModalOpen: open,
    // Clear selected class when closing delete modal
    ...(open === false && { selectedClassId: null })
  }),
  
  setCalendarViewActive: (active) => set({ isCalendarViewActive: active }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  resetFilters: () => set({ filters: initialFilters }),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  clearState: () => set({
    selectedClassId: null,
    isCreateModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isCalendarViewActive: false,
    filters: initialFilters,
    currentView: 'list',
  }),
}));

// Selectors for better performance
export const useClassStoreSelectors = {
  selectedClassId: () => useClassStore((state) => state.selectedClassId),
  isCreateModalOpen: () => useClassStore((state) => state.isCreateModalOpen),
  isEditModalOpen: () => useClassStore((state) => state.isEditModalOpen),
  isDeleteModalOpen: () => useClassStore((state) => state.isDeleteModalOpen),
  isCalendarViewActive: () => useClassStore((state) => state.isCalendarViewActive),
  filters: () => useClassStore((state) => state.filters),
  currentView: () => useClassStore((state) => state.currentView),
  
  // Computed selectors
  isAnyModalOpen: () => useClassStore((state) => 
    state.isCreateModalOpen || state.isEditModalOpen || state.isDeleteModalOpen
  ),
  
  hasActiveFilters: () =>
    useClassStore((state) => {
      const { filters } = state;
  
      return !!(
        filters.startDate ||
        filters.endDate ||
        filters.studentId ||
        filters.teacherId ||
        (filters.status && filters.status !== 'all-classes') ||
        filters.search ||
        filters.grade ||
        (filters.orderBy && filters.orderBy.length > 0) 
      );
    }),
};