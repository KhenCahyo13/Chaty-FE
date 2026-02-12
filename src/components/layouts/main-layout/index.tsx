import { type FC, memo, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useVirtualizer } from '@tanstack/react-virtual';

import { fetchPrivateConversations } from '@/api/private-conversations';
import { DEFAULT_DEBOUNCE_DELAY, DEFAULT_LIMIT } from '@/constants/state';
import { useCursorPaginationList } from '@/hooks/use-cursor-pagination-list';
import { usePrivateMessageListener } from '@/hooks/use-private-message-listener';
import { registerCurrentWebPushToken } from '@/lib/push-token';
import { queryKeys } from '@/lib/query-keys';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import { useComponentsStore } from '@/stores/components';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { LayoutProps } from '@/types/components';
import type { PrivateConversationList } from '@/types/private-conversation';

import MainLayoutView from './view';

const MainLayout: FC<LayoutProps> = ({
    children
}) => {
    const { activePrivateConversationId } = usePrivateConversationStore();
    const { setOpenUserListDialog } = useComponentsStore();
    const { token, user } = useAuthStore();

    const [searchPrivateConversations, setSearchPrivateConversations] = useState<string | undefined>(undefined);
    const [debouncedSearchPrivateConversations] = useDebounce(searchPrivateConversations, DEFAULT_DEBOUNCE_DELAY);

    const {
        handleScroll: handleScrollPrivateConversations,
        isError: isPrivateConversationsError,
        isFetchingNextPage: isFetchingNextPrivateConversationsPage,
        isLoading: isPrivateConversationsLoading,
        items: privateConversations,
    } = useCursorPaginationList<
        PrivateConversationList,
        ReturnType<typeof queryKeys.privateConversations.list>
    >({
        queryFn: (pageParam) =>
            fetchPrivateConversations(
                DEFAULT_LIMIT,
                debouncedSearchPrivateConversations,
                pageParam
            ),
        queryKey: queryKeys.privateConversations.list(
            DEFAULT_LIMIT,
            debouncedSearchPrivateConversations
        ),
    });

    usePrivateMessageListener({
        activePrivateConversationId,
        eventName: 'private-message:sent',
    });
    usePrivateMessageListener({
        activePrivateConversationId,
        eventName: 'private-message:new',
    });

    useEffect(() => {
        if (!user?.id) return;

        socket.auth = {
            userId: user.id,
        };

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id || !token?.access_token) return;

        void registerCurrentWebPushToken();
    }, [token?.access_token, user?.id]);

    const conversationsContainerRef = useRef<HTMLDivElement | null>(null);
    const conversationVirtualizer = useVirtualizer({
        count: privateConversations?.length ?? 0,
        estimateSize: () => 72,
        getScrollElement: () => conversationsContainerRef.current,
        overscan: 6,
    });

    return <MainLayoutView
        children={children}
        conversationsContainerRef={conversationsContainerRef}
        conversationVirtualItems={conversationVirtualizer.getVirtualItems()}
        conversationVirtualMeasureElement={conversationVirtualizer.measureElement}
        conversationVirtualTotalSize={conversationVirtualizer.getTotalSize()}
        handleScrollPrivateConversations={handleScrollPrivateConversations}
        isFetchingNextPrivateConversationsPage={
            isFetchingNextPrivateConversationsPage
        }
        isPrivateConversationsError={isPrivateConversationsError}
        isPrivateConversationsLoading={isPrivateConversationsLoading}
        privateConversations={privateConversations}
        searchPrivateConversations={searchPrivateConversations}
        setOpenUserListDialog={setOpenUserListDialog}
        setSearchPrivateConversations={setSearchPrivateConversations}
    />;
};

export default memo(MainLayout);
