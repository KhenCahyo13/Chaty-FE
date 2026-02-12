import { useQuery } from '@tanstack/react-query';

import { fetchUsers } from '@/api/users';
import { queryKeys } from '@/lib/query-keys';
import { useComponentsStore } from '@/stores/components';

import UserListDialogView from './view';

const UserListDialog = () => {
    const { openUserListDialog, setOpenUserListDialog } = useComponentsStore();

    const { data, isLoading, isError } = useQuery({
        queryKey: queryKeys.users.list(20, ''),
        queryFn: () => fetchUsers(20, ''),
    });

    return <UserListDialogView
        openUserListDialog={openUserListDialog}
        setOpenUserListDialog={setOpenUserListDialog}
        users={data?.data}
        isLoading={isLoading}
        isError={isError}
    />;
};

export default UserListDialog;