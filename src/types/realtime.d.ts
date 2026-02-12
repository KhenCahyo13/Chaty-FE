export interface SocketPrivateMessageCreatedPayload {
    message: SocketPrivateMessagePayload;
    private_conversation_id: string;
}

export interface SocketPrivateMessagePayload {
    content: null | string;
    createdAt: string;
    id: string;
    isDeleted: boolean;
    readsCount: number;
    senderId: string;
}

export interface SocketPrivateMessageReadPayload {
    messageIds: string[];
    privateConversationId: string;
    readAt: Date;
    readerId: string;
}
