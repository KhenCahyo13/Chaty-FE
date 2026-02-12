import type { PrivateConversationDetailsMessage } from '@/types/private-conversation';
import type { SocketPrivateMessagePayload } from '@/types/realtime';

export const formatSocketPrivateMessage = (
    message: SocketPrivateMessagePayload,
    currentUserId: string
): PrivateConversationDetailsMessage => {
    return {
        audioUrl: message.audioUrl,
        content: message.content,
        createdAt: message.createdAt,
        id: message.id,
        isDeleted: message.isDeleted,
        isMe: message.senderId === currentUserId,
        isRead:
            message.senderId === currentUserId ? message.readsCount > 0 : true,
        messageType: message.messageType,
    };
};
