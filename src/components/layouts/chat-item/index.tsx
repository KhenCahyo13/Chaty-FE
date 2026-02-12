import { type FC, memo, useCallback } from 'react';

import { usePrivateConversationStore } from '@/stores/private-conversation-store';

import type { ChatItemProps } from './types';
import ChatItemView from './view';

const ChatItem: FC<ChatItemProps> = ({
    conversation
}) => {
    const { activePrivateConversationId, setActivePrivateConversationId } = usePrivateConversationStore();
    const handleSelect = useCallback(() => {
        setActivePrivateConversationId(conversation.id);
    }, [conversation.id, setActivePrivateConversationId]);

    return <ChatItemView
        activePrivateConversationId={activePrivateConversationId}
        conversation={conversation}
        onSelect={handleSelect}
    />;
};

export default memo(ChatItem);
