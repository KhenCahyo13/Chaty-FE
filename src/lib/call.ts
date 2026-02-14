import type { PrivateConversationList } from '@/types/private-conversation';
import type {
    SocketPrivateCallIceCandidatePayload,
    SocketPrivateCallPayload,
    SocketPrivateCallWebRtcPayload,
} from '@/types/realtime';

import { getInitials } from './sentence';

interface PeerIdentity {
    initials: string;
    name: string;
}

export const getPrivateCallPeerIdentity = (
    privateConversationMap: Map<string, PrivateConversationList>,
    data: SocketPrivateCallPayload,
    peerId: string
): PeerIdentity => {
    const conversation = privateConversationMap.get(
        data.private_conversation_id
    );

    if (conversation?.sender.id === peerId) {
        const displayName =
            conversation.sender.profile?.fullName ??
            conversation.sender.username;

        return {
            initials: getInitials(displayName),
            name: displayName,
        };
    }

    return {
        initials: 'U',
        name: 'Unknown User',
    };
};

export const parsePrivateCallSessionDescription = (
    value: SocketPrivateCallWebRtcPayload['sdp'],
    fallbackType: 'answer' | 'offer'
): null | RTCSessionDescriptionInit => {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (parsed && typeof parsed === 'object') {
                return parsed as RTCSessionDescriptionInit;
            }
        } catch {
            return {
                sdp: value,
                type: fallbackType,
            };
        }
    }

    if (value && typeof value === 'object') {
        return value as RTCSessionDescriptionInit;
    }

    return null;
};

export const parsePrivateCallIceCandidate = (
    value: SocketPrivateCallIceCandidatePayload['candidate']
): null | RTCIceCandidateInit => {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (parsed && typeof parsed === 'object') {
                return parsed as RTCIceCandidateInit;
            }
        } catch {
            return null;
        }
    }

    if (value && typeof value === 'object') {
        return value as RTCIceCandidateInit;
    }

    return null;
};
