import type { FC } from "react";
import { TooltipProvider } from "../ui/tooltip";
import type { LayoutProps } from "@/types/components";
import type { router } from '@/main';
import { RouterProvider } from '@tanstack/react-router';

interface AppProviderProps extends LayoutProps {
    router: typeof router;
}

export const AppProvider: FC<AppProviderProps> = ({
    children,
    router
}) => (
    <TooltipProvider>
        {children}
        <RouterProvider router={router} />
    </TooltipProvider>
);