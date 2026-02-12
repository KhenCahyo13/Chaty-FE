import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { createPrivateConversation } from '@/api/private-conversations';
import { fetchUsers } from '@/api/users';
import { DEFAULT_DEBOUNCE_DELAY } from '@/components/constants/state';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { useComponentsStore } from '@/stores/components';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';

import UserListDialogView from './view';

const UserListDialog = () => {
    const { openUserListDialog, setOpenUserListDialog } = useComponentsStore();
    const { setActivePrivateConversationId } = usePrivateConversationStore();

    const [searchUsers, setSearchUsers] = useState<string | undefined>(undefined);
    const [debouncedSearchUsers] = useDebounce(searchUsers, DEFAULT_DEBOUNCE_DELAY);

    const { data, isLoading, isError } = useQuery({
        queryKey: queryKeys.users.list(20, debouncedSearchUsers),
        queryFn: () => fetchUsers(20, debouncedSearchUsers),
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
        searchUsers={searchUsers}
        setSearchUsers={setSearchUsers}
    />;
};

export default UserListDialog;