import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { createPrivateConversation } from '@/api/private-conversations';
import { fetchUsers } from '@/api/users';
import { DEFAULT_DEBOUNCE_DELAY, DEFAULT_LIMIT } from '@/components/constants/state';
import { useCursorPaginationList } from '@/hooks/use-cursor-pagination-list';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { useComponentsStore } from '@/stores/components';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { UserList } from '@/types/user';

import UserListDialogView from './view';

const UserListDialog = () => {
    const { openUserListDialog, setOpenUserListDialog } = useComponentsStore();
    const { setActivePrivateConversationId } = usePrivateConversationStore();

    const [searchUsers, setSearchUsers] = useState<string | undefined>(undefined);
    const [debouncedSearchUsers] = useDebounce(searchUsers, DEFAULT_DEBOUNCE_DELAY);

    const {
        handleScroll: handleScrollUsers,
        isError,
        isFetchingNextPage,
        isLoading,
        items: users,
    } = useCursorPaginationList<UserList, ReturnType<typeof queryKeys.users.list>>({
        queryFn: (pageParam) =>
            fetchUsers(DEFAULT_LIMIT, debouncedSearchUsers, pageParam),
        queryKey: queryKeys.users.list(DEFAULT_LIMIT, debouncedSearchUsers),
    });

    const createPrivateConversationMutation = useMutation({
        mutationFn: (user2Id: string) => createPrivateConversation(user2Id),
        onError: (error) => {
            toast.error(resolveErrorMessage(error));
        },
        onSuccess: (response) => {
            setActivePrivateConversationId(response.data.id);
            setOpenUserListDialog(false);
        }
    });

    const handleCreatePrivateConversation = useCallback((user2Id: string) => {
        createPrivateConversationMutation.mutate(user2Id);
    }, [createPrivateConversationMutation]);

    return <UserListDialogView
        handleCreatePrivateConversation={handleCreatePrivateConversation}
        handleScrollUsers={handleScrollUsers}
        isCreatePrivateConversationLoading={createPrivateConversationMutation.isPending}
        isError={isError}
        isFetchingNextUsersPage={isFetchingNextPage}
        isLoading={isLoading}
        openUserListDialog={openUserListDialog}
        searchUsers={searchUsers}
        setOpenUserListDialog={setOpenUserListDialog}
        setSearchUsers={setSearchUsers}
        users={users}
    />;
};

export default UserListDialog;
