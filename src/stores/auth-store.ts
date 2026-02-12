import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { Token, User } from '@/types/auth';

interface AuthStoreState {
    clearAuth: () => void;
    isRefreshingToken: boolean;
    setIsRefreshingToken: (isRefreshing: boolean) => void;
    setToken: (token: Token) => void;
    setUser: (user: User) => void;
    token: null | Token;
    user: null | User;
}

export const useAuthStore = create<AuthStoreState>()(
    devtools(
        persist(
            (set) => ({
                clearAuth: () =>
                    set({
                        token: null,
                        user: null,
                    }),
                isRefreshingToken: false,
                setIsRefreshingToken: (isRefreshing: boolean) =>
                    set({ isRefreshingToken: isRefreshing }),
                setToken: (token: Token) => set({ token }),
                setUser: (user: User) => set({ user }),
                token: null,
                user: null,
            }),
            {
                name: import.meta.env.VITE_AUTH_STORAGE_KEY,
            }
        )
    )
);
