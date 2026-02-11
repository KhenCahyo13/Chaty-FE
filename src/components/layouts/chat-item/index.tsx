import { type FC,memo } from 'react';

import type { ChatItemProps } from './types';
import ChatItemView from './view';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';

const ChatItem: FC<ChatItemProps> = ({
    conversation
}) => {
    const { activePrivateConversationId, setActivePrivateConversationId } = usePrivateConversationStore();

    return <ChatItemView
        conversation={conversation}
        activePrivateConversationId={activePrivateConversationId}
        setActivePrivateConversationId={setActivePrivateConversationId}
    />;
};

export default memo(ChatItem);