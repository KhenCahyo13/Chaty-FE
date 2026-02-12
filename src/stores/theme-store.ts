import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type AppTheme = 'light' | 'dark';

interface ThemeStoreState {
    theme: AppTheme;
    setTheme: (theme: AppTheme) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                theme: 'light',
                setTheme: (theme: AppTheme) => set({ theme }),
                toggleTheme: () =>
                    set({
                        theme: get().theme === 'dark' ? 'light' : 'dark',
                    }),
            }),
            {
                name: import.meta.env.VITE_THEME_STORAGE_KEY,
            }
        )
    )
);
