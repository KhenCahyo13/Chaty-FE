import { type InfiniteData, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { type UIEvent,useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { createPrivateConversation } from '@/api/private-conversations';
import { fetchUsers } from '@/api/users';
import { DEFAULT_DEBOUNCE_DELAY, DEFAULT_LIMIT } from '@/components/constants/state';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { useComponentsStore } from '@/stores/components';
import { usePrivateConversationStore } from '@/stores/private-conversation-store';
import type { ApiResponse, CursorMeta } from '@/types/api';
import type { UserList } from '@/types/user';

import UserListDialogView from './view';

const UserListDialog = () => {
    const { openUserListDialog, setOpenUserListDialog } = useComponentsStore();
    const { setActivePrivateConversationId } = usePrivateConversationStore();

    const [searchUsers, setSearchUsers] = useState<string | undefined>(undefined);
    const [debouncedSearchUsers] = useDebounce(searchUsers, DEFAULT_DEBOUNCE_DELAY);

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteQuery<
        ApiResponse<UserList[], CursorMeta>,
        Error,
        InfiniteData<ApiResponse<UserList[], CursorMeta>>,
        ReturnType<typeof queryKeys.users.list>,
        string | undefined
    >({
        queryKey: queryKeys.users.list(DEFAULT_LIMIT, debouncedSearchUsers),
        queryFn: ({ pageParam }) =>
            fetchUsers(DEFAULT_LIMIT, debouncedSearchUsers, pageParam),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage?.meta?.nextCursor ?? undefined,
    });

    const users = useMemo(() => {
        if (!data) return [];

        return data.pages.flatMap((page) =>
            Array.isArray(page?.data) ? page.data : []
        );
    }, [data]);

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

    const handleScrollUsers = useCallback((
        e: UIEvent<HTMLDivElement, globalThis.UIEvent>
    ) => {
        if (!hasNextPage || isFetchingNextPage) return;

        const element = e.currentTarget;
        const remainingHeight =
            element.scrollHeight - element.scrollTop - element.clientHeight;
        if (remainingHeight > 120) return;

        fetchNextPage();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return <UserListDialogView
        openUserListDialog={openUserListDialog}
        setOpenUserListDialog={setOpenUserListDialog}
        users={users}
        isLoading={isLoading}
        isError={isError}
        isFetchingNextUsersPage={isFetchingNextPage}
        handleScrollUsers={handleScrollUsers}
        handleCreatePrivateConversation={handleCreatePrivateConversation}
        isCreatePrivateConversationLoading={createPrivateConversationMutation.isPending}
        searchUsers={searchUsers}
        setSearchUsers={setSearchUsers}
    />;
};

export default UserListDialog;
