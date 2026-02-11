import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, memo, useEffect, useState } from 'react';

import { fetchPrivateConversations } from '@/api/private-conversations';
import { queryKeys } from '@/lib/query-keys';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { LayoutProps } from '@/types/components';
import type { SocketPrivateMessageCreatedPayload } from '@/types/realtime';

import MainLayoutView from './view';

const MainLayout: FC<LayoutProps> = ({
    children
}) => {
    const queryClient = useQueryClient();
    const { activePrivateConversationId } = usePrivateConversationStore();
    const { user } = useAuthStore();

    const [privateConversationsLimit, _setPrivateConversationsLimit] = useState(10);

    const { data: privateConversations, isLoading: isPrivateConversationsLoading, isError: isPrivateConversationsError } = useQuery({
        queryKey: queryKeys.privateConversations.list(privateConversationsLimit),
        queryFn: () => fetchPrivateConversations(privateConversationsLimit),
    });

    // Listen for new messages sent
    useEffect(() => {
        const onPrivateMessageSent = (payload: SocketPrivateMessageCreatedPayload) => {
            if (payload.private_conversation_id === activePrivateConversationId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.privateConversations.detail(activePrivateConversationId),
                });
            }

            queryClient.invalidateQueries({
                queryKey: queryKeys.privateConversations.lists(),
            });
        }

        socket.on('private-message:sent', onPrivateMessageSent);

        return () => {
            socket.off('private-message:sent', onPrivateMessageSent);
        };
    }, [activePrivateConversationId, queryClient]);

    useEffect(() => {
        if (!user?.id) return;

        socket.auth = {
            userId: user.id,
        };

        socket.connect();

        socket.on('connect', () => {});

        socket.on('disconnect', () => {});

        return () => {
            socket.disconnect();
        };
    }, [user?.id]);


    return <MainLayoutView
        children={children}
        privateConversations={privateConversations?.data}
        isPrivateConversationsLoading={isPrivateConversationsLoading}
        isPrivateConversationsError={isPrivateConversationsError}
    />;
};

export default memo(MainLayout);