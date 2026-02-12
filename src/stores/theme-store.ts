import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type AppTheme = 'dark' | 'light';

interface ThemeStoreState {
    setTheme: (theme: AppTheme) => void;
    theme: AppTheme;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                setTheme: (theme: AppTheme) => set({ theme }),
                theme: 'light',
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
