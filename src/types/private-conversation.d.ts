import type { UserList } from './user';

export interface PrivateConversationList {
    createdAt: string;
    id: string;
    lastMessage: PrivateConversationListLastMessage;
    sender: UserList;
    unreadMessageCount: number;
    updatedAt: string;
}

export interface PrivateConversationListLastMessage {
    content: string;
    createdAt: string;
    id: string;
    isDeleted: boolean;
    isMe: boolean;
    isRead: boolean;
}

export interface PrivateConversationDetails {
    createdAt: string;
    id: string;
    receiver: UserList;
    updatedAt: string;
}

export interface PrivateConversationDetailsMessage {
    content: null | string;
    createdAt: string;
    id: string;
    isDeleted: boolean;
    isMe: boolean;
    isRead: boolean;
}

export interface CreatePrivateConversationResponse {
    createdAt: string;
    id: string;
    updatedAt: string;
    user1Id: string;
    user2Id: string;
}
