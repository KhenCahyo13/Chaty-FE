import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { createPrivateConversation } from '@/api/private-conversations';
import { fetchUsers } from '@/api/users';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { useComponentsStore } from '@/stores/components';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';

import UserListDialogView from './view';

const UserListDialog = () => {
    const { openUserListDialog, setOpenUserListDialog } = useComponentsStore();
    const { setActivePrivateConversationId } = usePrivateConversationStore();

    const { data, isLoading, isError } = useQuery({
        queryKey: queryKeys.users.list(20, ''),
        queryFn: () => fetchUsers(20, ''),
    });

    const createPrivateConversationMutation = useMutation({
        mutationFn: (user2Id: string) => createPrivateConversation(user2Id),
        onSuccess: (response) => {
            setActivePrivateConversationId(response.data.id);
            setOpenUserListDialog(false);
        },
        onError: (error) => {
            toast.error(resolveErrorMessage(error));
        }
    });

    const handleCreatePrivateConversation = useCallback((user2Id: string) => {
        createPrivateConversationMutation.mutate(user2Id);
    }, [createPrivateConversationMutation]);

    return <UserListDialogView
        openUserListDialog={openUserListDialog}
        setOpenUserListDialog={setOpenUserListDialog}
        users={data?.data}
        isLoading={isLoading}
        isError={isError}
        handleCreatePrivateConversation={handleCreatePrivateConversation}
        isCreatePrivateConversationLoading={createPrivateConversationMutation.isPending}
    />;
};

export default UserListDialog;