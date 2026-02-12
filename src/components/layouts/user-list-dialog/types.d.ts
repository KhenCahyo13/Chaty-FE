import type { UIEvent } from 'react';

import type { UserList } from '@/types/user';

export interface UserListDialogViewProps {
    handleCreatePrivateConversation: (userId: string) => void;
    handleScrollUsers: (e: UIEvent<HTMLDivElement, globalThis.UIEvent>) => void;
    isCreatePrivateConversationLoading: boolean;
    isError: boolean;
    isFetchingNextUsersPage: boolean;
    isLoading: boolean;
    openUserListDialog: boolean;
    searchUsers: string | undefined;
    setOpenUserListDialog: (open: boolean) => void;
    setSearchUsers: (search: string | undefined) => void;
    users: undefined | UserList[];
}
