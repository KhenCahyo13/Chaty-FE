import { IconMoonStars, IconSettings, IconUserCircle } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { Button } from '@/components/ui/button';

import type { SideButtonsViewProps } from './types';

const SideButtonsView: FC<SideButtonsViewProps> = ({
    handleToggleTheme,
    isDarkTheme,
    setOpenProfileDialog,
}) => (
    <aside className="hidden w-14 shrink-0 flex-col justify-end border-r border-sidebar-border/70 px-1.5 py-3 md:flex">
        <div className="flex flex-col items-center gap-y-2">
            <Button
                aria-label="Profile"
                className="size-10 rounded-xl border border-transparent hover:border-sidebar-border/80 hover:bg-background/80"
                onClick={() => setOpenProfileDialog(true)}
                size="icon"
                type="button"
                variant="ghost"
            >
                <IconUserCircle className="size-5 text-muted-foreground" />
            </Button>
            <Button
                aria-label="Settings"
                className="size-10 rounded-xl border border-transparent hover:border-sidebar-border/80 hover:bg-background/80"
                size="icon"
                type="button"
                variant="ghost"
            >
                <IconSettings className="size-5 text-muted-foreground" />
            </Button>
            <Button
                aria-label="Theme"
                aria-pressed={isDarkTheme}
                className="size-10 rounded-xl border border-transparent hover:border-sidebar-border/80 hover:bg-background/80"
                onClick={handleToggleTheme}
                size="icon"
                type="button"
                variant="ghost"
            >
                <IconMoonStars className="size-5 text-muted-foreground" />
            </Button>
        </div>
    </aside>
);

export default memo(SideButtonsView);
