import type { PrivateConversationList } from '@/types/private-conversation';

export interface ChatItemProps {
    conversation: PrivateConversationList;
}

export interface ChatItemViewProps {
    conversation: PrivateConversationList;
    activePrivateConversationId: string | null;
    setActivePrivateConversationId: (id: string | null) => void;
}
