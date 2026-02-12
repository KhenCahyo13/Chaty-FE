import { type InfiniteData,useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, memo, useEffect, useState } from 'react';

import { fetchPrivateConversations } from '@/api/private-conversations';
import { formatSocketPrivateMessage } from '@/lib/message';
import { queryKeys } from '@/lib/query-keys';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import { useComponentsStore } from '@/stores/components';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { ApiResponse, CursorMeta } from '@/types/api';
import type { LayoutProps } from '@/types/components';
import type { PrivateConversationDetailsMessage } from '@/types/private-conversation';
import type { SocketPrivateMessageCreatedPayload } from '@/types/realtime';

import MainLayoutView from './view';

const MainLayout: FC<LayoutProps> = ({
    children
}) => {
    const queryClient = useQueryClient();
    const { activePrivateConversationId } = usePrivateConversationStore();
    const { setOpenUserListDialog } = useComponentsStore();
    const { user } = useAuthStore();

    const [privateConversationsLimit, _setPrivateConversationsLimit] = useState(10);

    const { data: privateConversations, isLoading: isPrivateConversationsLoading, isError: isPrivateConversationsError } = useQuery({
        queryKey: queryKeys.privateConversations.list(privateConversationsLimit),
        queryFn: () => fetchPrivateConversations(privateConversationsLimit),
    });

    // Listen for new messages sent
    useEffect(() => {
        const onPrivateMessageSent = (payload: SocketPrivateMessageCreatedPayload) => {
            if (payload.private_conversation_id !== activePrivateConversationId) return;

            queryClient.setQueryData<InfiniteData<ApiResponse<PrivateConversationDetailsMessage[], CursorMeta>>>(
                queryKeys.privateConversations.message(activePrivateConversationId), (old) => {
                    if (!old) return old;

                    const firstPage = old.pages[0];
                    const nextMessage = formatSocketPrivateMessage(
                        payload.message,
                        user?.id ?? ''
                    );
                    const fallbackFirstPage: ApiResponse<
                        PrivateConversationDetailsMessage[],
                        CursorMeta
                    > = {
                        data: [],
                        meta: { nextCursor: null },
                        success: true,
                        message: '',
                    };
                    const safeFirstPage = firstPage ?? fallbackFirstPage;

                    return {
                        ...old,
                        pages: [
                            {
                                ...safeFirstPage,
                                data: [
                                    ...(Array.isArray(safeFirstPage.data)
                                        ? safeFirstPage.data
                                        : []),
                                    nextMessage,
                                ],
                            },
                            ...old.pages.slice(1),
                        ],
                    };
                }
            );
        }

        socket.on('private-message:sent', onPrivateMessageSent);

        return () => {
            socket.off('private-message:sent', onPrivateMessageSent);
        };
    }, [activePrivateConversationId, queryClient, user?.id]);

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
        privateConversations={privateConversations?.data}
        isPrivateConversationsLoading={isPrivateConversationsLoading}
        isPrivateConversationsError={isPrivateConversationsError}
        setOpenUserListDialog={setOpenUserListDialog}
    />;
};

export default memo(MainLayout);
