import type { PrivateConversationDetailsMessage } from '@/types/private-conversation';
import type { SocketPrivateMessagePayload } from '@/types/realtime';

export const formatSocketPrivateMessage = (message: SocketPrivateMessagePayload, currentUserId: string): PrivateConversationDetailsMessage => {
    return {
        id: message.id,
        content: message.content,
        isMe: message.senderId === currentUserId,
        isDeleted: message.isDeleted,
        isRead: message.senderId === currentUserId ? message.readsCount > 0 : true,
        createdAt: message.createdAt,
    };
};
