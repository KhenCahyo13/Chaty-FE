import type { FC } from "react";
import { TooltipProvider } from "../ui/tooltip";
import type { LayoutProps } from "@/types/components";
import type { router } from '@/main';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '../ui/sonner';

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