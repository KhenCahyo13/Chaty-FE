import {
    type InfiniteData,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';

import { readPrivateConversation } from '@/api/private-conversations';
import { queryKeys } from '@/lib/query-keys';
import { socket } from '@/lib/socket';
import type { ApiResponse, CursorMeta } from '@/types/api';
import type {
    PrivateConversationDetailsMessage,
    PrivateConversationList,
} from '@/types/private-conversation';
import type { SocketPrivateMessageReadPayload } from '@/types/realtime';

interface UsePrivateMessageReadProps {
    activePrivateConversationId: null | string;
    messages: PrivateConversationDetailsMessage[];
}

export const usePrivateMessageRead = ({
    activePrivateConversationId,
    messages,
}: UsePrivateMessageReadProps) => {
    const queryClient = useQueryClient();
    const requestedReadRef = useRef<null | string>(null);

    const lastMessage = useMemo(() => {
        return messages[messages.length - 1] ?? null;
    }, [messages]);

    const lastMessageId = lastMessage?.id ?? null;

    const readMutation = useMutation({
        mutationFn: ({
            conversationId,
            lastReadMessageId,
        }: {
            conversationId: string;
            lastReadMessageId: string;
        }) => readPrivateConversation(conversationId, lastReadMessageId),
        onError: (_, variables) => {
            const requestKey = `${variables.conversationId}:${variables.lastReadMessageId}`;
            if (requestedReadRef.current === requestKey) {
                requestedReadRef.current = null;
            }
        },
    });

    useEffect(() => {
        if (!activePrivateConversationId || !lastMessageId) return;

        const requestKey = `${activePrivateConversationId}:${lastMessageId}`;
        if (requestedReadRef.current === requestKey) return;

        requestedReadRef.current = requestKey;
        readMutation.mutate({
            conversationId: activePrivateConversationId,
            lastReadMessageId: lastMessageId,
        });
    }, [
        activePrivateConversationId,
        lastMessageId,
        lastMessage?.isMe,
        lastMessage?.isRead,
        readMutation,
    ]);

    useEffect(() => {
        const onPrivateMessageRead = (
            payload: SocketPrivateMessageReadPayload
        ) => {
            const messageIds = new Set(payload.messageIds);
            if (!messageIds.size) return;

            queryClient.setQueryData<
                InfiniteData<
                    ApiResponse<PrivateConversationDetailsMessage[], CursorMeta>
                >
            >(
                queryKeys.privateConversations.message(
                    payload.privateConversationId
                ),
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            data: Array.isArray(page.data)
                                ? page.data.map((message) =>
                                      messageIds.has(message.id)
                                          ? { ...message, isRead: true }
                                          : message
                                  )
                                : [],
                        })),
                    };
                }
            );

            queryClient.setQueriesData<
                InfiniteData<ApiResponse<PrivateConversationList[], CursorMeta>>
            >(
                {
                    queryKey: queryKeys.privateConversations.lists(),
                },
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            data: Array.isArray(page.data)
                                ? page.data.map((conversation) => {
                                      if (
                                          conversation.id !==
                                          payload.privateConversationId
                                      ) {
                                          return conversation;
                                      }

                                      if (
                                          !messageIds.has(
                                              conversation.lastMessage.id
                                          )
                                      ) {
                                          return conversation;
                                      }

                                      return {
                                          ...conversation,
                                          lastMessage: {
                                              ...conversation.lastMessage,
                                              isRead: true,
                                          },
                                      };
                                  })
                                : [],
                        })),
                    };
                }
            );
        };

        socket.on('private-message:read', onPrivateMessageRead);

        return () => {
            socket.off('private-message:read', onPrivateMessageRead);
        };
    }, [queryClient]);
};
