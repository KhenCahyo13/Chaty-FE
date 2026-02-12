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
    search?: string,
    cursor?: string
): Promise<ApiResponse<PrivateConversationList[], CursorMeta>> => {
    const response = await authenticatedApi.get('/private-conversations', {
        params: {
            cursor,
            limit,
            search,
        },
    });

    return response.data as ApiResponse<PrivateConversationList[], CursorMeta>;
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
                cursor,
                limit,
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

export const readPrivateConversation = async (
    id: string,
    lastReadMessageId: string
): Promise<ApiResponse<null>> => {
    const response = await authenticatedApi.post(
        `/private-conversations/${id}/read`,
        {
            last_read_message_id: lastReadMessageId,
        }
    );

    return response.data as ApiResponse<null>;
};
