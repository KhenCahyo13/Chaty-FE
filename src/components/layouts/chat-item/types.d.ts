import type { PrivateConversationList } from '@/types/private-conversation';

export interface ChatItemProps {
    conversation: PrivateConversationList;
}

export interface ChatItemViewProps {
    activePrivateConversationId: null | string;
    conversation: PrivateConversationList;
    setActivePrivateConversationId: (id: null | string) => void;
}
