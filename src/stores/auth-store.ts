import type { Token, User } from '@/types/auth';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthStoreState {
    token: Token | null;
    user: User | null;
    setToken: (token: Token) => void;
    setUser: (user: User) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
    devtools(
        persist(
            (set) => ({
                token: null,
                user: null,
                setToken: (token: Token) => set({ token }),
                setUser: (user: User) => set({ user }),
                clearAuth: () =>
                    set({
                        token: null,
                        user: null,
                    }),
            }),
            {
                name: import.meta.env.VITE_AUTH_STORAGE_KEY,
            }
        )
    )
);
