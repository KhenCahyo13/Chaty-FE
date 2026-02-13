import { useEffect } from 'react';

import { socket } from '@/lib/socket';
import type { SocketPresencePayload } from '@/types/realtime';

export const usePrivateMessageOnlineStatus = (
    activePrivateConversationId: string,
    setIsReceiverOnline: (isOnline: boolean) => void,
    setReceiverLastSeenAt: (lastSeenAt: null | string) => void
) => {
    useEffect(() => {
        if (!activePrivateConversationId) return;

        const onReceiverPresence = (data: SocketPresencePayload) => {
            if (data.private_conversation_id !== activePrivateConversationId)
                return;

            setIsReceiverOnline(data.is_online);
            setReceiverLastSeenAt(data.last_seen_at);
        };

        socket.on('private-conversation:presence', onReceiverPresence);

        socket.emit('private-conversation:join', {
            private_conversation_id: activePrivateConversationId,
        });

        return () => {
            socket.emit('private-conversation:leave', {
                private_conversation_id: activePrivateConversationId,
            });
            socket.off('private-conversation:presence', onReceiverPresence);
        };
    }, [
        activePrivateConversationId,
        setIsReceiverOnline,
        setReceiverLastSeenAt,
    ]);
};
