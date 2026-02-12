import { type FC,memo } from 'react';

import { usePrivateConversationStore } from '@/stores/private-conversation-store';

import type { ChatItemProps } from './types';
import ChatItemView from './view';

const ChatItem: FC<ChatItemProps> = ({
    conversation
}) => {
    const { activePrivateConversationId, setActivePrivateConversationId } = usePrivateConversationStore();

    return <ChatItemView
        activePrivateConversationId={activePrivateConversationId}
        conversation={conversation}
        setActivePrivateConversationId={setActivePrivateConversationId}
    />;
};

export default memo(ChatItem);