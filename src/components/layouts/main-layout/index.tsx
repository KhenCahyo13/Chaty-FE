import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { type FC, memo, type UIEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { fetchPrivateConversations } from '@/api/private-conversations';
import { DEFAULT_DEBOUNCE_DELAY, DEFAULT_LIMIT } from '@/components/constants/state';
import { usePrivateMessageListener } from '@/hooks/use-private-message-listener';
import { queryKeys } from '@/lib/query-keys';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import { useComponentsStore } from '@/stores/components';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { ApiResponse, CursorMeta } from '@/types/api';
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
        data: privateConversationsData,
        isLoading: isPrivateConversationsLoading,
        isError: isPrivateConversationsError,
        hasNextPage: hasNextPrivateConversationsPage,
        isFetchingNextPage: isFetchingNextPrivateConversationsPage,
        fetchNextPage: fetchNextPrivateConversationsPage,
    } = useInfiniteQuery<
        ApiResponse<PrivateConversationList[], CursorMeta>,
        Error,
        InfiniteData<ApiResponse<PrivateConversationList[], CursorMeta>>,
        ReturnType<typeof queryKeys.privateConversations.list>,
        string | undefined
    >({
        queryKey: queryKeys.privateConversations.list(DEFAULT_LIMIT, debouncedSearchPrivateConversations),
        queryFn: ({ pageParam }) =>
            fetchPrivateConversations(
                DEFAULT_LIMIT,
                debouncedSearchPrivateConversations,
                pageParam
            ),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage?.meta?.nextCursor ?? undefined,
    });

    const privateConversations = useMemo(() => {
        if (!privateConversationsData) return [];

        return privateConversationsData.pages.flatMap((page) =>
            Array.isArray(page?.data) ? page.data : []
        );
    }, [privateConversationsData]);

    const handleScrollPrivateConversations = useCallback((
        e: UIEvent<HTMLDivElement, globalThis.UIEvent>
    ) => {
        if (
            !hasNextPrivateConversationsPage ||
            isFetchingNextPrivateConversationsPage
        ) {
            return;
        }

        const element = e.currentTarget;
        const remainingHeight =
            element.scrollHeight - element.scrollTop - element.clientHeight;
        if (remainingHeight > 120) return;

        fetchNextPrivateConversationsPage();
    }, [
        fetchNextPrivateConversationsPage,
        hasNextPrivateConversationsPage,
        isFetchingNextPrivateConversationsPage,
    ]);

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
