import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import type { FC } from "react";

import type { router } from '@/main';
import type { LayoutProps } from "@/types/components";

import { Toaster } from '../ui/sonner';
import { TooltipProvider } from "../ui/tooltip";

interface AppProviderProps extends LayoutProps {
    router: typeof router;
    queryClient: QueryClient;
}

export const AppProvider: FC<AppProviderProps> = ({
    children,
    router,
    queryClient
}) => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            {children}
            <RouterProvider router={router} />
            <Toaster position="top-center" />
        </TooltipProvider>
    </QueryClientProvider>
);