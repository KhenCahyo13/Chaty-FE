import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import ChatRoomView from './view'
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchPrivateConversationDetails } from '@/api/private-conversations';

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