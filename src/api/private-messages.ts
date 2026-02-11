import type { CreateMessageFormValues } from '@/features/chat-room/types';
import { authenticatedApi } from '@/lib/axios';

export const createMessage = async (payload: CreateMessageFormValues) => {
    const response = await authenticatedApi.post('/private-messages', payload);

    return response.data;
};
