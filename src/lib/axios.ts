import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
} from 'axios';

import { useAuthStore } from '@/stores/auth-store';
import type { ApiResponse } from '@/types/api';
import type { Token, User } from '@/types/auth';

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL as string;
const REFRESH_TOKEN_URL = '/auth/refresh';

export const publicApi: AxiosInstance = axios.create({
    baseURL: BASE_API_URL,
});

export const authenticatedApi: AxiosInstance = axios.create({
    baseURL: BASE_API_URL,
});

authenticatedApi.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();

    if (token?.access_token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization =
            `Bearer ${token.access_token}`;
    }

    return config;
});

let refreshingPromise: Promise<Token | null> | null = null;

async function refreshAccessToken(): Promise<Token | null> {
    const { token, setIsRefreshingToken, setUser } = useAuthStore.getState();

    if (!token?.refresh_token) return null;

    try {
        setIsRefreshingToken(true);
        const response = await publicApi.post<ApiResponse<User, Token>>(
            REFRESH_TOKEN_URL,
            {
                refresh_token: token.refresh_token,
            },
            {
                headers: {
                    Authorization: `Bearer ${token.refresh_token}`,
                },
            }
        );
        const payload = response.data;
        if (payload?.success && payload.meta?.access_token) {
            if (payload.data) {
                setUser(payload.data);
            }
            return payload.meta;
        }
        return null;
    } catch {
        return null;
    } finally {
        setIsRefreshingToken(false);
    }
}

function ensureRefresh(): Promise<Token | null> {
    if (!refreshingPromise) {
        refreshingPromise = refreshAccessToken().finally(() => {
            refreshingPromise = null;
        });
    }
    return refreshingPromise;
}

authenticatedApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        if (status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await ensureRefresh();
                if (!newToken) {
                    useAuthStore.getState().clearAuth();
                    return Promise.reject(error);
                }

                useAuthStore.getState().setToken(newToken);

                originalRequest.headers = originalRequest.headers ?? {};
                (
                    originalRequest.headers as Record<string, string>
                ).Authorization = `Bearer ${newToken.access_token}`;

                return authenticatedApi.request(originalRequest);
            } catch (refreshErr) {
                useAuthStore.getState().clearAuth();
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);
