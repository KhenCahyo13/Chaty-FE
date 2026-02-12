import type { UIEvent } from 'react';

import type { UserList } from '@/types/user';

export interface UserListDialogViewProps {
    openUserListDialog: boolean;
    setOpenUserListDialog: (open: boolean) => void;
    users: UserList[] | undefined;
    isLoading: boolean;
    isError: boolean;
    isFetchingNextUsersPage: boolean;
    handleScrollUsers: (e: UIEvent<HTMLDivElement, globalThis.UIEvent>) => void;
    handleCreatePrivateConversation: (userId: string) => void;
    isCreatePrivateConversationLoading: boolean;
    searchUsers: string | undefined;
    setSearchUsers: (search: string | undefined) => void;
}
