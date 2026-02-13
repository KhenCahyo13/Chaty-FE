import { type FC,memo, useCallback } from 'react';

import { socket } from '@/lib/socket';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';

import type { ChatHeaderProps } from '../../types';
import ChatHeaderView from './view';

const ChatHeader: FC<ChatHeaderProps> = ({
    isReceiverOnline,
    receiver,
    receiverLastSeenAt,
}) => {
    const { activePrivateConversationId } = usePrivateConversationStore();

    const handleStartPrivateAudioCall = useCallback(() => {
        if (!activePrivateConversationId) return;

        socket.emit('private-call:start', {
            call_type: 'audio',
            private_conversation_id: activePrivateConversationId,
        });
    }, [activePrivateConversationId]);

    return <ChatHeaderView
        handleStartPrivateAudioCall={handleStartPrivateAudioCall}
        isReceiverOnline={isReceiverOnline}
        receiver={receiver}
        receiverLastSeenAt={receiverLastSeenAt}
    />;
};

export default memo(ChatHeader);