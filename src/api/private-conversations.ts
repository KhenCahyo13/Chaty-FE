import { authenticatedApi } from '@/lib/axios';
import type { ApiResponse, CursorMeta } from '@/types/api';
import type {
    CreatePrivateConversationResponse,
    PrivateConversationDetails,
    PrivateConversationDetailsMessage,
    PrivateConversationList,
} from '@/types/private-conversation';

export const fetchPrivateConversations = async (
    limit: number,
    search?: string
): Promise<ApiResponse<PrivateConversationList[]>> => {
    const response = await authenticatedApi.get('/private-conversations', {
        params: {
            limit,
            search,
        },
    });

    return response.data as ApiResponse<PrivateConversationList[]>;
};

export const fetchPrivateConversationDetails = async (
    id: string
): Promise<ApiResponse<PrivateConversationDetails>> => {
    const response = await authenticatedApi.get(`/private-conversations/${id}`);

    return response.data as ApiResponse<PrivateConversationDetails>;
};

export const fetchPrivateConversationMessagesById = async (
    id: string,
    limit: number,
    cursor?: string
): Promise<ApiResponse<PrivateConversationDetailsMessage[], CursorMeta>> => {
    const response = await authenticatedApi.get(
        `/private-conversations/${id}/messages`,
        {
            params: {
                limit,
                cursor,
            },
        }
    );

    return response.data as ApiResponse<
        PrivateConversationDetailsMessage[],
        CursorMeta
    >;
};

export const createPrivateConversation = async (
    user2Id: string
): Promise<ApiResponse<CreatePrivateConversationResponse>> => {
    const response = await authenticatedApi.post('/private-conversations', {
        user_2_id: user2Id,
    });

    return response.data as ApiResponse<CreatePrivateConversationResponse>;
};
