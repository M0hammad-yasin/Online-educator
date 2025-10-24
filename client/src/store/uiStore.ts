// client/src/store/uiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Mobile menu state
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Search modal state
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  toggleSearchModal: () => void;

  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Page title
  pageTitle: string;
  setPageTitle: (title: string) => void;

  // Breadcrumb items
  breadcrumbItems: Array<{ title: string; path?: string }>;
  setBreadcrumbItems: (items: Array<{ title: string; path?: string }>) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Mobile menu state
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

      // Search modal state
      searchModalOpen: false,
      setSearchModalOpen: (open) => set({ searchModalOpen: open }),
      toggleSearchModal: () =>
        set((state) => ({ searchModalOpen: !state.searchModalOpen })),

      // Loading states
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Page title
      pageTitle: 'Dashboard',
      setPageTitle: (title) => set({ pageTitle: title }),

      // Breadcrumb items
      breadcrumbItems: [],
      setBreadcrumbItems: (items) => set({ breadcrumbItems: items }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

export default useUIStore;