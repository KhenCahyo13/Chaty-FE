import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchPrivateConversationDetails } from '@/api/private-conversations';
import { queryKeys } from '@/lib/query-keys';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';

import ChatRoomView from './view'
import { useForm } from '@tanstack/react-form';
import { createMessageFormDefaultValues, createMessageFormSchema } from './schema';
import type { CreateMessageFormValues } from './types';
import { createMessage } from '@/api/private-messages';
import { toast } from 'sonner';
import { resolveErrorMessage } from '@/lib/response';
import { useEffect } from 'react';

const ChatRoom = () => {
    const { activePrivateConversationId } = usePrivateConversationStore();
    const queryClient = useQueryClient();

    const { data: conversations, isLoading: isConversationsLoading, isError: isConversationsError } = useQuery({
        queryKey: queryKeys.privateConversations.detail(activePrivateConversationId!),
        queryFn: () => fetchPrivateConversationDetails(activePrivateConversationId!),
        enabled: !!activePrivateConversationId,
    });

    const messageForm = useForm({
        defaultValues: createMessageFormDefaultValues,
        validators: {
            onSubmit: createMessageFormSchema
        },
        onSubmit: async ({ value }) => {
            console.log('Submit message:', value);
            messageMutation.mutate(value);
        }
    });

    const messageMutation = useMutation({
        mutationFn: (data: CreateMessageFormValues) => createMessage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.privateConversations.lists(),
            });

            if (activePrivateConversationId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.privateConversations.detail(activePrivateConversationId),
                });
            }

            messageForm.reset();
        },
        onError: (error) => {
            toast.error(resolveErrorMessage(error));
        }
    });

    useEffect(() => {
        if (activePrivateConversationId) {
            messageForm.setFieldValue('private_conversation_id', activePrivateConversationId);
        }
    }, [messageForm, activePrivateConversationId]);

    return <ChatRoomView
        messageForm={messageForm}
        activePrivateConversationId={activePrivateConversationId}
        conversations={conversations?.data}
        isConversationsLoading={isConversationsLoading}
        isConversationsError={isConversationsError}
        isCreateMessageLoading={messageMutation.isPending}
    />;
};

export default ChatRoom;