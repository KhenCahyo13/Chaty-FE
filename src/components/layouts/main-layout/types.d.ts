import type { LayoutProps } from '@/types/components';
import type { PrivateConversationList } from '@/types/private-conversation';

export interface MainLayoutViewProps extends LayoutProps {
    privateConversations: PrivateConversationList[] | undefined;
    isPrivateConversationsLoading: boolean;
    isPrivateConversationsError: boolean;
}
