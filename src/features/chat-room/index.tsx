import { useQuery } from '@tanstack/react-query';

import { fetchPrivateConversationDetails } from '@/api/private-conversations';
import { queryKeys } from '@/lib/query-keys';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';

import ChatRoomView from './view'

const ChatRoom = () => {
    const { activePrivateConversationId } = usePrivateConversationStore();

    const { data: conversations, isLoading: isConversationsLoading, isError: isConversationsError } = useQuery({
        queryKey: queryKeys.privateConversations.detail(activePrivateConversationId!),
        queryFn: () => fetchPrivateConversationDetails(activePrivateConversationId!),
        enabled: !!activePrivateConversationId,
    });

    return <ChatRoomView
        activePrivateConversationId={activePrivateConversationId}
        conversations={conversations?.data}
        isConversationsLoading={isConversationsLoading}
        isConversationsError={isConversationsError}
    />;
};

export default ChatRoom;