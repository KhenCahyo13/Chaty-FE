import type { MessageType } from './private-conversation';

export type PrivateCallType = 'audio' | 'video';
export type PrivateCallStatus =
    | 'answered'
    | 'cancelled'
    | 'ended'
    | 'failed'
    | 'initiated'
    | 'missed'
    | 'rejected'
    | 'ringing';

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

export interface SocketStartPrivateCallPayload {
    call_type: PrivateCallType;
    private_conversation_id: string;
}

export interface SocketPrivateCallPayload {
    call_id: string;
    call_type: PrivateCallType;
    callee_id: string;
    caller_id: string;
    private_conversation_id: string;
    room: string;
    started_at: string;
    status: PrivateCallStatus;
}

export interface SocketPrivateCallEndedPayload {
    call_id: string;
    ended_at: string;
    ended_by: string;
    private_conversation_id: string;
    status: PrivateCallStatus;
}

export interface SocketPrivateCallAnsweredPayload {
    answered_at: string;
    call_id: string;
    private_conversation_id: string;
    room: string;
    status: 'answered';
    user_id: string;
}

export interface ActivePrivateCall {
    calleeId: string;
    callerId: string;
    callId: string;
    callType: PrivateCallType;
    isIncoming: boolean;
    peerId: string;
    peerInitials: string;
    peerName: string;
    privateConversationId: string;
    room: string;
    startedAt: string;
    status: PrivateCallStatus;
}
