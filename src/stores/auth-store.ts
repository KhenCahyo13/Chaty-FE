import type { Token, User } from '@/types/auth';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthStoreState {
    token: Token | null;
    user: User | null;
    isRefreshingToken: boolean;
    setToken: (token: Token) => void;
    setIsRefreshingToken: (isRefreshing: boolean) => void;
    setUser: (user: User) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
    devtools(
        persist(
            (set) => ({
                token: null,
                user: null,
                isRefreshingToken: false,
                setIsRefreshingToken: (isRefreshing: boolean) =>
                    set({ isRefreshingToken: isRefreshing }),
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
