import type { UIEvent } from 'react';

import type { LayoutProps } from '@/types/components';
import type { PrivateConversationList } from '@/types/private-conversation';

export interface MainLayoutViewProps extends LayoutProps {
    handleScrollPrivateConversations: (
        e: UIEvent<HTMLDivElement, globalThis.UIEvent>
    ) => void;
    isFetchingNextPrivateConversationsPage: boolean;
    isPrivateConversationsError: boolean;
    isPrivateConversationsLoading: boolean;
    privateConversations: PrivateConversationList[] | undefined;
    searchPrivateConversations: string | undefined;
    setOpenUserListDialog: (open: boolean) => void;
    setSearchPrivateConversations: (search: string | undefined) => void;
}
