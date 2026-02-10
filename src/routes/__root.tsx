import { createRootRoute, Outlet } from '@tanstack/react-router';

import MainLayout from '@/components/layouts/main-layout';

export const Route = createRootRoute({
    component: () => {
        return (
            <MainLayout>
                <Outlet />
            </MainLayout>
        );
    },
});
