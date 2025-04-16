import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      mode: "light",
      toggleTheme: () =>
        set((state) => ({ mode: state.mode === "light" ? "dark" : "light" })),
      setTheme: (mode: ThemeMode) => set({ mode }),
    }),
    {
      name: "theme-storage", // name of the item in the storage
      //   getStorage: () => localStorage, // use localStorage
    }
  )
);

export default useThemeStore;
