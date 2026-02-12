import { authenticatedApi } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { UserList } from '@/types/user';

export const fetchUsers = async (
    limit: number,
    search?: string
): Promise<ApiResponse<UserList[]>> => {
    const response = await authenticatedApi.get('/users', {
        params: {
            limit,
            search,
        },
    });

    return response.data as ApiResponse<UserList[]>;
};
