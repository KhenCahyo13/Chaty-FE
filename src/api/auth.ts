import type { LoginFormValues } from '@/components/layouts/login-dialog/types';
import { authenticatedApi, publicApi } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Token, User } from '@/types/auth';

export const login = async (
    data: LoginFormValues
): Promise<ApiResponse<User, Token>> => {
    const response = await publicApi.post('/auth/login', data);

    return response.data as ApiResponse<User, Token>;
};

export const logout = async (): Promise<void> => {
    await authenticatedApi.post('/auth/logout');
};
