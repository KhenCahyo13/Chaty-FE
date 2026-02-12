import type { RefObject, UIEvent } from 'react';
import type { VirtualItem } from '@tanstack/react-virtual';

import type { LayoutProps } from '@/types/components';
import type { PrivateConversationList } from '@/types/private-conversation';

export interface MainLayoutViewProps extends LayoutProps {
    conversationsContainerRef: RefObject<HTMLDivElement | null>;
    conversationVirtualItems: VirtualItem[];
    conversationVirtualMeasureElement: (
        element: Element | null
    ) => void;
    conversationVirtualTotalSize: number;
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
