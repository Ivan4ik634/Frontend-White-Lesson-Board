import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (value: 'light' | 'dark') => void;
}
export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (value) => set({ theme: value }),
    }),
    {
      name: 'theme',
    },
  ),
);
