import type { PrivateConversationDetails, PrivateConversationDetailsMessage, PrivateConversationListUser } from '@/types/private-conversation';

export interface ChatBubbleProps {
    message: PrivateConversationDetailsMessage;
}

export interface ChatHeaderProps {
    receiver: PrivateConversationListUser | undefined;
}

export interface ChatRoomViewProps {
    activePrivateConversationId: string | null;
    conversations: PrivateConversationDetails | undefined;
    isConversationsLoading: boolean;
    isConversationsError: boolean;
}
