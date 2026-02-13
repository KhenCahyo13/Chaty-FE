import type { PrivateConversationList } from '@/types/private-conversation';

export const getLastMessagePreview = (conversation: PrivateConversationList) => {
    if (conversation.lastMessage.isDeleted) {
        return 'This message was deleted';
    }

    if (conversation.lastMessage.messageType === 'AUDIO') {
        return 'Audio message';
    }

    if (conversation.lastMessage.messageType === 'FILE') {
        return 'File message';
    }

    return conversation.lastMessage.content ?? '';
};