import { memo, useState, type FC } from 'react';
import MainLayoutView from './view';
import type { LayoutProps } from '@/types/components';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchPrivateConversations } from '@/api/private-conversations';

const MainLayout: FC<LayoutProps> = ({
    children
}) => {
    const [privateConversationsLimit, setPrivateConversationsLimit] = useState(10);

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