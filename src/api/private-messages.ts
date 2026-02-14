import type { CreateMessageFormValues } from '@/features/chat-room/types';
import { authenticatedApi } from '@/lib/axios';

export const createMessage = async (payload: CreateMessageFormValues) => {
    const hasFiles = !!payload.files?.length;
    const hasAudio = !!payload.audio;
    const messageType = hasFiles ? 'FILE' : hasAudio ? 'AUDIO' : 'TEXT';
    const formData = new FormData();

    formData.append('message_type', messageType);
    formData.append('private_conversation_id', payload.private_conversation_id);

    if (messageType === 'TEXT') {
        formData.append('content', payload.content?.trim() ?? '');
    }

    if (messageType === 'AUDIO' && payload.audio) {
        formData.append('audio', payload.audio);
    }

    if (messageType === 'FILE') {
        payload.files?.forEach((file) => {
            formData.append('files', file);
        });
    }

    const response = await authenticatedApi.post('/private-messages', formData);

    return response.data;
};
