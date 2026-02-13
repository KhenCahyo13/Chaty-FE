import type { MessageType } from './private-conversation';

export interface SocketPrivateMessageCreatedPayload {
    message: SocketPrivateMessagePayload;
    private_conversation_id: string;
}

export interface SocketPrivateMessagePayload {
    audioUrl: null | string;
    content: null | string;
    createdAt: string;
    fileUrls: null | string[];
    id: string;
    isDeleted: boolean;
    messageType: MessageType;
    readsCount: number;
    senderId: string;
}

export interface SocketPrivateMessageReadPayload {
    messageIds: string[];
    privateConversationId: string;
    readAt: Date;
    readerId: string;
}

export interface SocketErrorPayload {
    message: string;
}

export interface SocketPresencePayload {
    is_online: boolean;
    last_seen_at: null | string;
    private_conversation_id: string;
    user_id: string;
}
