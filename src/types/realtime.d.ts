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
