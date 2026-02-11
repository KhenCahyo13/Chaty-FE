import { authenticatedApi } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { PrivateConversationList } from '@/types/private-conversation';

export const fetchPrivateConversations = async (
    limit: number
): Promise<ApiResponse<PrivateConversationList[]>> => {
    const response = await authenticatedApi.get('/private-conversations', {
        params: {
            limit
        }
    });

    return response.data as ApiResponse<PrivateConversationList[]>;
}