import { memo, type FC } from 'react';
import MainLayoutView from './view';
import type { LayoutProps } from '@/types/components';

const MainLayout: FC<LayoutProps> = ({
    children
}) => {
    return <MainLayoutView
        children={children}
    />;
};

export default memo(MainLayout);