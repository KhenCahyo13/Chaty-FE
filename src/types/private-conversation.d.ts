import type { UserList } from './user';

export type MessageType = 'AUDIO' | 'FILE' | 'TEXT';

export interface PrivateConversationList {
    createdAt: string;
    id: string;
    lastMessage: PrivateConversationListLastMessage;
    sender: UserList;
    unreadMessageCount: number;
    updatedAt: string;
}

export interface PrivateConversationListLastMessage {
    audioUrl: null | string;
    content: null | string;
    createdAt: string;
    fileUrls: null | string[];
    id: string;
    isDeleted: boolean;
    isMe: boolean;
    isRead: boolean;
    messageType: MessageType;
}

export interface PrivateConversationDetails {
    createdAt: string;
    id: string;
    receiver: UserList;
    updatedAt: string;
}

export interface PrivateConversationDetailsMessage {
    audioUrl: null | string;
    content: null | string;
    createdAt: string;
    id: string;
    isDeleted: boolean;
    isMe: boolean;
    isRead: boolean;
    messageType: MessageType;
}

export interface CreatePrivateConversationResponse {
    createdAt: string;
    id: string;
    updatedAt: string;
    user1Id: string;
    user2Id: string;
}
