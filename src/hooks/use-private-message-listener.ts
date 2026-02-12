import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { formatSocketPrivateMessage } from '@/lib/message';
import { queryKeys } from '@/lib/query-keys';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiResponse, CursorMeta } from '@/types/api';
import type { PrivateConversationDetailsMessage } from '@/types/private-conversation';
import type { SocketPrivateMessageCreatedPayload } from '@/types/realtime';

interface UsePrivateMessageListenerProps {
    activePrivateConversationId: string | null;
    eventName: 'private-message:sent' | 'private-message:new';
}

export const usePrivateMessageListener = ({
    activePrivateConversationId,
    eventName,
}: UsePrivateMessageListenerProps) => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    useEffect(() => {
        const onPrivateMessage = (payload: SocketPrivateMessageCreatedPayload) => {
            if (!activePrivateConversationId) return;
            if (payload.private_conversation_id !== activePrivateConversationId) return;

            queryClient.setQueryData<InfiniteData<ApiResponse<PrivateConversationDetailsMessage[], CursorMeta>>>(
                queryKeys.privateConversations.message(activePrivateConversationId),
                (old) => {
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
        };

        socket.on(eventName, onPrivateMessage);

        return () => {
            socket.off(eventName, onPrivateMessage);
        };
    }, [activePrivateConversationId, eventName, queryClient, user?.id]);
};
