import { type FC, memo, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { fetchPrivateConversations } from '@/api/private-conversations';
import { DEFAULT_DEBOUNCE_DELAY, DEFAULT_LIMIT } from '@/components/constants/state';
import { useCursorPaginationList } from '@/hooks/use-cursor-pagination-list';
import { usePrivateMessageListener } from '@/hooks/use-private-message-listener';
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
    const { user } = useAuthStore();

    const [searchPrivateConversations, setSearchPrivateConversations] = useState<string | undefined>(undefined);
    const [debouncedSearchPrivateConversations] = useDebounce(searchPrivateConversations, DEFAULT_DEBOUNCE_DELAY);

    const {
        items: privateConversations,
        isLoading: isPrivateConversationsLoading,
        isError: isPrivateConversationsError,
        isFetchingNextPage: isFetchingNextPrivateConversationsPage,
        handleScroll: handleScrollPrivateConversations,
    } = useCursorPaginationList<
        PrivateConversationList,
        ReturnType<typeof queryKeys.privateConversations.list>
    >({
        queryKey: queryKeys.privateConversations.list(
            DEFAULT_LIMIT,
            debouncedSearchPrivateConversations
        ),
        queryFn: (pageParam) =>
            fetchPrivateConversations(
                DEFAULT_LIMIT,
                debouncedSearchPrivateConversations,
                pageParam
            ),
    });

    usePrivateMessageListener({
        activePrivateConversationId,
        eventName: 'private-message:sent',
    });

    useEffect(() => {
        if (!user?.id) return;

        socket.auth = {
            userId: user.id,
        };

        socket.connect();

        socket.on('connect', () => { });

        socket.on('disconnect', () => { });

        return () => {
            socket.disconnect();
        };
    }, [user?.id]);


    return <MainLayoutView
        children={children}
        privateConversations={privateConversations}
        isPrivateConversationsLoading={isPrivateConversationsLoading}
        isPrivateConversationsError={isPrivateConversationsError}
        isFetchingNextPrivateConversationsPage={
            isFetchingNextPrivateConversationsPage
        }
        handleScrollPrivateConversations={handleScrollPrivateConversations}
        setOpenUserListDialog={setOpenUserListDialog}
        searchPrivateConversations={searchPrivateConversations}
        setSearchPrivateConversations={setSearchPrivateConversations}
    />;
};

export default memo(MainLayout);
