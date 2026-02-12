import type { UIEvent } from 'react';

import type { LayoutProps } from '@/types/components';
import type { PrivateConversationList } from '@/types/private-conversation';

export interface MainLayoutViewProps extends LayoutProps {
    privateConversations: PrivateConversationList[] | undefined;
    isPrivateConversationsLoading: boolean;
    isPrivateConversationsError: boolean;
    isFetchingNextPrivateConversationsPage: boolean;
    handleScrollPrivateConversations: (
        e: UIEvent<HTMLDivElement, globalThis.UIEvent>
    ) => void;
    setOpenUserListDialog: (open: boolean) => void;
    searchPrivateConversations: string | undefined;
    setSearchPrivateConversations: (search: string | undefined) => void;
}
