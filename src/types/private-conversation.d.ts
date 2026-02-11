export interface PrivateConversationList {
    id: string;
    createdAt: string;
    updatedAt: string;
    sender: PrivateConversationListSender;
    lastMessage: PrivateConversationListLastMessage;
}

export interface PrivateConversationListSender {
    id: string;
    username: string;
    email: string;
    profile: {
        id: string;
        fullName: string;
        about: string | null;
        avatarUrl: string | null;
    } | null;
}

export interface PrivateConversationListLastMessage {
    id: string;
    content: string;
    isDeleted: boolean;
    createdAt: string;
}