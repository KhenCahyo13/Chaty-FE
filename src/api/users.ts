import { authenticatedApi } from '@/lib/axios';
import type { ApiResponse, CursorMeta } from '@/types/api';
import type { UserList } from '@/types/user';

export const fetchUsers = async (
    limit: number,
    search?: string,
    cursor?: string
): Promise<ApiResponse<UserList[], CursorMeta>> => {
    const response = await authenticatedApi.get('/users', {
        params: {
            limit,
            search,
            cursor,
        },
    });

    return response.data as ApiResponse<UserList[], CursorMeta>;
};
