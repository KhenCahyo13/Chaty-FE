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
