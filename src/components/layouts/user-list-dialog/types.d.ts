import type { UserList } from '@/types/user';

export interface UserListDialogViewProps {
    openUserListDialog: boolean;
    setOpenUserListDialog: (open: boolean) => void;
    users: UserList[] | undefined;
    isLoading: boolean;
    isError: boolean;
    handleCreatePrivateConversation: (userId: string) => void;
    isCreatePrivateConversationLoading: boolean;
}
