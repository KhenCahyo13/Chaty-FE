import type { UserList } from './user';

export interface PrivateConversationList {
    id: string;
    createdAt: string;
    updatedAt: string;
    sender: UserList;
    lastMessage: PrivateConversationListLastMessage;
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
    receiver: UserList;
}

export interface PrivateConversationDetailsMessage {
    id: string;
    content: string | null;
    isMe: boolean;
    isDeleted: boolean;
    isRead: boolean;
    createdAt: string;
}
