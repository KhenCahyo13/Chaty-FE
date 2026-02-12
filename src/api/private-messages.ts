import type { CreateMessageFormValues } from '@/features/chat-room/types';
import { authenticatedApi } from '@/lib/axios';
import { createFormData } from '@/lib/form';

export const createMessage = async (payload: CreateMessageFormValues) => {
    const hasAudio = !!payload.audio;

    const formData = createFormData({
        audio: payload.audio,
        content: hasAudio ? undefined : payload.content?.trim(),
        message_type: hasAudio ? 'AUDIO' : 'TEXT',
        private_conversation_id: payload.private_conversation_id,
    });

    const response = await authenticatedApi.post('/private-messages', formData);

    return response.data;
};
