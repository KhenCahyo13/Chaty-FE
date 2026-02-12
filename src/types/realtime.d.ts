export interface SocketPrivateMessageCreatedPayload {
    private_conversation_id: string;
    message: SocketPrivateMessagePayload;
}

export interface SocketPrivateMessagePayload {
    id: string;
    content: string | null;
    senderId: string;
    isDeleted: boolean;
    createdAt: string;
    readsCount: number;
}

export interface SocketPrivateMessageReadPayload {
    privateConversationId: string;
    readerId: string;
    messageIds: string[];
    readAt: Date;
}
