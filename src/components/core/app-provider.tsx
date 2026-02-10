import type { FC } from "react";
import { TooltipProvider } from "../ui/tooltip";
import type { LayoutProps } from "@/types/components";

export const AppProvider: FC<LayoutProps> = ({
    children
}) => (
    <TooltipProvider>
        {children}
    </TooltipProvider>
);