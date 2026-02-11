import { useQuery } from '@tanstack/react-query';
import { type FC,memo, useState } from 'react';

import { fetchPrivateConversations } from '@/api/private-conversations';
import { queryKeys } from '@/lib/query-keys';
import type { LayoutProps } from '@/types/components';

import MainLayoutView from './view';

const MainLayout: FC<LayoutProps> = ({
    children
}) => {
    const [privateConversationsLimit, _setPrivateConversationsLimit] = useState(10);

    const { data: privateConversations, isLoading: isPrivateConversationsLoading, isError: isPrivateConversationsError } = useQuery({
        queryKey: queryKeys.privateConversations.list(privateConversationsLimit),
        queryFn: () => fetchPrivateConversations(privateConversationsLimit),
    });

    return <MainLayoutView
        children={children}
        privateConversations={privateConversations?.data}
        isPrivateConversationsLoading={isPrivateConversationsLoading}
        isPrivateConversationsError={isPrivateConversationsError}
    />;
};

export default memo(MainLayout);