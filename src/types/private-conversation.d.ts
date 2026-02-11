export interface PrivateConversationList {
    id: string;
    createdAt: string;
    updatedAt: string;
    sender: PrivateConversationListUser;
    lastMessage: PrivateConversationListLastMessage;
}

export interface PrivateConversationListUser {
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
    isRead: boolean;
    isMe: boolean;
    createdAt: string;
}

export interface PrivateConversationDetails {
    id: string;
    createdAt: string;
    updatedAt: string;
    receiver: PrivateConversationListUser;
}

export interface PrivateConversationDetailsMessage {
    id: string;
    content: string | null;
    isMe: boolean;
    isDeleted: boolean;
    isRead: boolean;
    createdAt: string;
}
